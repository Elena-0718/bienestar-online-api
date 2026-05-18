import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Consultation, ConsultationStatus } from '../entities/consultation.entity';

@Injectable()
export class ConsultationRepository {
  constructor(
    @InjectRepository(Consultation)
    private readonly db: Repository<Consultation>,
  ) {}

  async create(data: Partial<Consultation>): Promise<Consultation> {
    const entity = this.db.create(data);
    return this.db.save(entity);
  }

  async findByUuid(uuid: string): Promise<Consultation | null> {
    return this.db.findOne({
      where: { uuid },
      relations: ['user', 'professional', 'subscription'],
    });
  }

  async findByUser(userUuid: string): Promise<Consultation[]> {
    return this.db.find({
      where: { user: { uuid: userUuid } },
      relations: ['professional', 'subscription'],
      order: { scheduledAt: 'DESC' },
    });
  }

  async findByProfessional(professionalUuid: string): Promise<Consultation[]> {
    return this.db.find({
      where: { professional: { uuid: professionalUuid } },
      relations: ['user', 'subscription'],
      order: { scheduledAt: 'DESC' },
    });
  }

  /**
   * ✅ ADMIN: listar todas las consultas
   */
  async findAll(): Promise<Consultation[]> {
    return this.db.find({
      relations: ['user', 'professional', 'subscription'],
      order: { scheduledAt: 'DESC' },
    });
  }

  /**
   * ✅ Para UI: "próximas citas" (ej: 10 min antes)
   */
  async findUserInRange(userUuid: string, start: Date, end: Date): Promise<Consultation[]> {
    return this.db.find({
      where: {
        user: { uuid: userUuid },
        status: ConsultationStatus.SCHEDULED,
        scheduledAt: Between(start, end),
      },
      relations: ['professional', 'subscription'],
      order: { scheduledAt: 'ASC' },
    });
  }

  /**
   * ✅ BUSCA SOLAPAMIENTOS EN RANGO
   * - Excluye CANCELADAS
   * - (Opcional) excluye la misma cita (para update)
   */
  async findByProfessionalAndRange(
    professionalUuid: string,
    start: Date,
    end: Date,
    excludeUuid?: string,
  ): Promise<Consultation | null> {
    const qb = this.db
      .createQueryBuilder('c')
      .where('c.professional_uuid = :professionalUuid', { professionalUuid })
      .andWhere('c.status != :canceled', { canceled: ConsultationStatus.CANCELED })
      .andWhere('c."scheduledAt" BETWEEN :start AND :end', {
        start: start.toISOString(),
        end: end.toISOString(),
      });

    if (excludeUuid) {
      qb.andWhere('c.uuid != :excludeUuid', { excludeUuid });
    }

    return qb.getOne();
  }

  async save(consultation: Consultation): Promise<Consultation> {
    return this.db.save(consultation);
  }

  async update(uuid: string, data: Partial<Consultation>): Promise<Consultation | null> {
    await this.db.update({ uuid }, data);
    return this.findByUuid(uuid);
  }

  async delete(uuid: string): Promise<void> {
    await this.db.delete({ uuid });
  }

  // ==============================================================
  // ✅ CRON: buscar consultas SCHEDULED que ya deberían finalizar
  // (scheduledAt + durationMinutes) <= now
  // ==============================================================
  async findExpiredScheduled(now: Date): Promise<Array<{ uuid: string }>> {
    return this.db
      .createQueryBuilder('c')
      .select(['c.uuid'])
      .where('c.status = :status', { status: ConsultationStatus.SCHEDULED })
      .andWhere(
        `(c."scheduledAt" + (c."durationMinutes" || ' minutes')::interval) <= :now`,
        { now: now.toISOString() },
      )
      .getMany();
  }

  // ==============================================================
  // ✅ CRON: completar muchas (FIX UUID ARRAY) usando In()
  // ==============================================================
  async completeMany(uuids: string[], completedAt: Date): Promise<void> {
    if (!uuids?.length) return;

    await this.db.update(
      { uuid: In(uuids) },
      {
        status: ConsultationStatus.COMPLETED,
        completedAt,
      } as any,
    );
  }
}