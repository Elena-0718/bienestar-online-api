import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ConsultationRepository } from './consultation.repository';
import { SubscriptionService } from '../subscriptions/subscription.service';
import { ConsultationStatus, Consultation } from 'src/entities/consultation.entity';
import { UserService } from 'src/users/users.service';
import { ProfessionalService } from 'src/professional/professional.service';
import { CreateConsultationDto } from './dtos/create-consultation.dto';

@Injectable()
export class ConsultationService {
  // ✅ slots de 20 min
  private readonly SLOT_MINUTES = 20;

  constructor(
    private readonly repo: ConsultationRepository,
    private readonly subscriptionService: SubscriptionService,
    private readonly userService: UserService,
    private readonly professionalService: ProfessionalService,
  ) {}

  // ==============================================================
  // NORMALIZACIÓN: bloques de 20 minutos (:00, :20, :40)
  // ==============================================================
  private normalizeDateToSlot(date: Date): Date {
    const d = new Date(date);
    d.setSeconds(0, 0);

    const minutes = d.getMinutes();
    const snapped = Math.floor(minutes / this.SLOT_MINUTES) * this.SLOT_MINUTES;
    d.setMinutes(snapped);

    return d;
  }

  // ==============================================================
  // Generar URL de videollamada (simple)
  // ==============================================================
  private generateMeetingUrl(uuid: string): string {
    return `https://meet.jit.si/bienestar-${uuid}?jwt=&config.prejoinPageEnabled=false`;
  }

  // ==============================================================
  // VALIDACIÓN: evitar solape en el mismo slot de 20 min
  // ==============================================================
  private async validateAvailability(
    professionalUserUuid: string,
    scheduledAt: Date,
    excludeUuid?: string,
  ) {
    const blockMs = this.SLOT_MINUTES * 60 * 1000;

    const start = new Date(scheduledAt.getTime());
    const end = new Date(scheduledAt.getTime() + blockMs - 1);

    const existing = await this.repo.findByProfessionalAndRange(
      professionalUserUuid,
      start,
      end,
      excludeUuid,
    );

    if (existing && existing.status !== ConsultationStatus.CANCELED) {
      throw new ConflictException(
        `El horario no está disponible. Existe una cita activa a las ${new Date(existing.scheduledAt).toLocaleTimeString(
          [],
          {
            hour: '2-digit',
            minute: '2-digit',
          },
        )}`,
      );
    }
  }

  // ==============================================================
  // CREAR CONSULTA (USER)
  // ==============================================================
  async create(userUuid: string, dto: CreateConsultationDto) {
    const subscription = await this.subscriptionService.findActiveByUser(userUuid);
    if (!subscription) throw new NotFoundException('Suscripción activa no encontrada');

    const scheduledAt = this.normalizeDateToSlot(new Date(dto.scheduledAt));
    if (scheduledAt < new Date()) {
      throw new BadRequestException('No se puede agendar una consulta en el pasado');
    }

    const user = await this.userService.findByUuid(userUuid);

    // dto.professionalUuid = UUID del ProfessionalProfile
    const professionalProfile = await this.professionalService.findOne(dto.professionalUuid);
    const professionalUser = professionalProfile?.user;

    if (!professionalUser) {
      throw new NotFoundException('El usuario asociado al profesional no fue encontrado');
    }

    // validar choque (con UUID del USER del profesional)
    await this.validateAvailability(professionalUser.uuid, scheduledAt);

    const consultationData: Partial<Consultation> = {
      user,
      professional: professionalUser,
      subscription,
      type: dto.type,
      scheduledAt,
      durationMinutes: this.SLOT_MINUTES, // ✅ 20 min
      status: ConsultationStatus.SCHEDULED,
    };

    const created = await this.repo.create(consultationData);

    // ✅ Generar URL al crear
    const meetingUrl = this.generateMeetingUrl(created.uuid);
    await this.repo.update(created.uuid, { meetingUrl });

    return this.repo.findByUuid(created.uuid);
  }

  // ==============================================================
  // OBTENER MIS CONSULTAS (USER)
  // ==============================================================
  async getMyConsultations(userUuid: string) {
    return this.repo.findByUser(userUuid);
  }

  // ==============================================================
  // OBTENER CONSULTAS DEL PROFESIONAL
  // ✅ Acepta uuid del ProfessionalProfile O del User
  // ==============================================================
  async getProfessionalConsultations(professionalUuid: string) {
    let professionalUserUuid = professionalUuid;

    try {
      const profile = await this.professionalService.findOne(professionalUuid);
      if (profile?.user?.uuid) {
        professionalUserUuid = profile.user.uuid;
      }
    } catch {
      // si no es profile uuid, asumimos que es user uuid
    }

    return this.repo.findByProfessional(professionalUserUuid);
  }

  // ==============================================================
  // BUSCAR CONSULTA POR UUID
  // ==============================================================
  async findByUuid(uuid: string) {
    const consultation = await this.repo.findByUuid(uuid);
    if (!consultation) throw new NotFoundException('Consulta no encontrada');
    return consultation;
  }

  // ==============================================================
  // ✅ JOIN: para "Conectarse" desde user o profesional
  // - valida permisos
  // - si no existe meetingUrl, la crea
  // ==============================================================
  async joinMeeting(requesterUuid: string, consultationUuid: string) {
    const consultation = await this.findByUuid(consultationUuid);

    const isUser = consultation.user?.uuid === requesterUuid;
    const isProfessional = consultation.professional?.uuid === requesterUuid;

    if (!isUser && !isProfessional) {
      throw new BadRequestException('No tienes permiso para unirte a esta consulta');
    }

    // si por alguna razón no tiene link, lo generamos
    if (!consultation.meetingUrl) {
      const meetingUrl = this.generateMeetingUrl(consultation.uuid);
      await this.repo.update(consultation.uuid, { meetingUrl });
      consultation.meetingUrl = meetingUrl;
    }

    return {
      uuid: consultation.uuid,
      meetingUrl: consultation.meetingUrl,
      scheduledAt: consultation.scheduledAt,
      durationMinutes: consultation.durationMinutes,
      status: consultation.status,
    };
  }

  // ==============================================================
  // ✅ UPCOMING: para UI (ej: alerta 10 min antes)
  // /consultations/me/upcoming?minutes=10
  // ==============================================================
  async getMyUpcomingConsultations(userUuid: string, minutesAhead: number) {
    const now = new Date();
    const end = new Date(now.getTime() + minutesAhead * 60 * 1000);
    return this.repo.findUserInRange(userUuid, now, end);
  }

  // ==============================================================
  // ACTUALIZAR CONSULTA (USER) (MODIFICAR/CANCELAR)
  // Mantengo tu regla de 24h
  // ==============================================================
  async update(uuid: string, dto: any) {
    const consultation = await this.findByUuid(uuid);

    const ahora = new Date();
    const fechaCita = new Date(consultation.scheduledAt);
    const diferenciaHoras = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);

    if (diferenciaHoras < 24) {
      throw new BadRequestException(
        'Las citas solo pueden modificarse o cancelarse con al menos 24 horas de anticipación',
      );
    }

    if (dto.scheduledAt) {
      const newScheduledAt = this.normalizeDateToSlot(new Date(dto.scheduledAt));
      if (newScheduledAt < ahora) {
        throw new BadRequestException('La nueva fecha no puede ser en el pasado');
      }

      await this.validateAvailability(consultation.professional.uuid, newScheduledAt, uuid);
      dto.scheduledAt = newScheduledAt;
    }

    // si cancelan
    if (dto.status === ConsultationStatus.CANCELED) {
      dto.canceledAt = new Date();
    }

    return this.repo.update(uuid, dto);
  }

  // ==============================================================
  // ELIMINAR CONSULTA (USER)
  // ==============================================================
  async delete(uuid: string) {
    await this.findByUuid(uuid);
    return this.repo.delete(uuid);
  }

  // ==============================================================
  // ✅ ADMIN
  // - listar todas
  // - actualizar (sin regla de 24h)
  // - cancelar rápido
  // ==============================================================
  async adminListAll() {
    return this.repo.findAll();
  }

  async adminUpdate(uuid: string, dto: any) {
    const consultation = await this.findByUuid(uuid);

    // si el admin cambia scheduledAt, normalizamos slot
    if (dto.scheduledAt) {
      dto.scheduledAt = this.normalizeDateToSlot(new Date(dto.scheduledAt));
    }

    // estados automáticos
    if (dto.status === ConsultationStatus.CANCELED) {
      dto.canceledAt = new Date();
    }

    if (dto.status === ConsultationStatus.COMPLETED) {
      dto.completedAt = new Date();
    }

    // (opcional) si el admin intenta reprogramar y quiere validar disponibilidad:
    // Solo validamos si cambió scheduledAt
    if (dto.scheduledAt) {
      await this.validateAvailability(consultation.professional.uuid, new Date(dto.scheduledAt), uuid);
    }

    return this.repo.update(uuid, dto);
  }

  async adminCancel(uuid: string) {
    return this.adminUpdate(uuid, { status: ConsultationStatus.CANCELED });
  }

  // ==============================================================
  // ✅ CRON: auto-completar consultas vencidas
  // (scheduledAt + durationMinutes) <= now  => COMPLETED
  // ==============================================================
  @Cron(CronExpression.EVERY_MINUTE)
  async autoCompletePastConsultations() {
    const now = new Date();
    const expired = await this.repo.findExpiredScheduled(now);
    const uuids = expired.map((x) => x.uuid);
    await this.repo.completeMany(uuids, now);
  }
}