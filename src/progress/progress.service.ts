import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { ProgressRepository } from './progress.repository';
import { SubscriptionRepository } from 'src/subscription/subscription.repository';
import { CreateProgressDto } from './dtos/create-progress.dto';
import { UpdateProgressDto } from './dtos/update-progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    private readonly progressRepo: ProgressRepository,
    private readonly subscriptionRepo: SubscriptionRepository,
  ) {}

  /* =========================
      STATS (PARA GRÁFICOS)
  ========================== */
  async getStatsByUser(userUuid: string, from?: string, to?: string) {
    const history = await this.progressRepo.findByUserAndDateRange(userUuid, from, to);

    if (history.length === 0) {
      return {
        hasData: false,
        message: 'Aún no tienes registros para mostrar gráficos.',
      };
    }

    const first = history[0];
    const last = history[history.length - 1];

    const summary = {
      weightDiff: Number(((last.weightKg || 0) - (first.weightKg || 0)).toFixed(2)),
      fatDiff: Number(((last.bodyFatPercentage || 0) - (first.bodyFatPercentage || 0)).toFixed(2)),
      muscleDiff: Number(((last.muscleMassKg || 0) - (first.muscleMassKg || 0)).toFixed(2)),
      totalRecords: history.length,
    };

    return {
      hasData: true,
      summary,
      charts: {
        labels: history.map((p) => p.recordDate),
        datasets: [
          { label: 'Peso (kg)', data: history.map((p) => p.weightKg) },
          { label: 'Grasa (%)', data: history.map((p) => p.bodyFatPercentage) },
          { label: 'Músculo (kg)', data: history.map((p) => p.muscleMassKg) },
        ],
      },
      history,
    };
  }

  /* =========================
      CREATE
  ========================== */
  async create(
    userUuid: string,
    professionalUuid: string,
    dto: CreateProgressDto,
  ) {
    const subscription =
      await this.subscriptionRepo.getActiveSubscriptionByUser(userUuid);

    if (!subscription) {
      throw new BadRequestException(
        'El usuario no tiene una suscripción activa',
      );
    }

    const recordDate = dto.recordDate ? new Date(dto.recordDate) : new Date();

    const exists = await this.progressRepo.existsForDate(
      subscription.uuid,
      recordDate,
    );

    if (exists) {
      throw new BadRequestException(
        'Ya existe un registro de progreso para esta fecha',
      );
    }

    // CORRECCIÓN: Asignación directa sin "?? null" para evitar error de tipos TS2322
    return this.progressRepo.createProgress({
      subscription,
      user: { uuid: userUuid } as any,
      professional: { uuid: professionalUuid } as any,
      recordDate,
      weightKg: dto.weightKg,
      bodyFatPercentage: dto.bodyFatPercentage,
      muscleMassKg: dto.muscleMassKg,
      waistCm: dto.waistCm,
      hipCm: dto.hipCm,
      chestCm: dto.chestCm,
      energyLevel: dto.energyLevel,
      adherenceLevel: dto.adherenceLevel,
      professionalNotes: dto.professionalNotes, 
      userNotes: dto.userNotes,
      isActive: true,
    });
  }

  /* =========================
      FIND ONE
  ========================== */
  async findByUuid(uuid: string) {
    const progress = await this.progressRepo.findByUuid(uuid);

    if (!progress || !progress.isActive) {
      throw new NotFoundException(
        'Registro de progreso no encontrado',
      );
    }

    return progress;
  }

  /* =========================
      FIND BY USER
  ========================== */
  async findByUser(userUuid: string, from?: string, to?: string) {
    return this.progressRepo.findByUserAndDateRange(userUuid, from, to);
  }

  /* =========================
      UPDATE
  ========================== */
  async update(uuid: string, dto: UpdateProgressDto) {
    const progress = await this.progressRepo.findByUuid(uuid);

    if (!progress || !progress.isActive) {
      throw new NotFoundException(
        'Registro de progreso no encontrado',
      );
    }

    return this.progressRepo.updateProgress(progress, dto);
  }

  /* =========================
      DELETE (SOFT)
  ========================== */
  async delete(uuid: string) {
    const progress = await this.progressRepo.findByUuid(uuid);

    if (!progress || !progress.isActive) {
      throw new NotFoundException(
        'Registro de progreso no encontrado',
      );
    }

    await this.progressRepo.deactivateProgress(progress);

    return {
      message: 'Registro de progreso desactivado correctamente',
    };
  }
}