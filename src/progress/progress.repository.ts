import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Progress } from 'src/entities/progress.entity';

@Injectable()
export class ProgressRepository {
  constructor(
    @InjectRepository(Progress)
    private readonly progressDB: Repository<Progress>,
  ) {}

  /* =========================
      CREATE
  ========================== */
  async createProgress(data: Partial<Progress>): Promise<Progress> {
    const progress = this.progressDB.create(data);
    return this.progressDB.save(progress);
  }

  /* =========================
      FIND BY UUID
  ========================== */
  async findByUuid(uuid: string): Promise<Progress | null> {
    return this.progressDB.findOne({
      where: { uuid },
      relations: ['subscription', 'user', 'professional'],
    });
  }

  /* =========================
      EXISTS (UNIQUE DATE)
  ========================== */
  async existsForDate(
    subscriptionUuid: string,
    recordDate: Date,
  ): Promise<boolean> {
    const count = await this.progressDB.count({
      where: {
        subscription: { uuid: subscriptionUuid },
        recordDate,
      },
    });
    return count > 0;
  }

  /* =========================
      FIND BY USER + DATE RANGE
      (Clave para el motor de gráficos)
  ========================== */
  async findByUserAndDateRange(
    userUuid: string,
    from?: string,
    to?: string,
  ): Promise<Progress[]> {
    const where: any = {
      user: { uuid: userUuid },
      isActive: true,
    };

    // Si existen fechas, filtramos el rango. 
    // Si no, trae todo el historial para la gráfica general.
    if (from && to) {
      where.recordDate = Between(new Date(from), new Date(to));
    }

    return this.progressDB.find({
      where,
      order: { recordDate: 'ASC' }, // ASC es obligatorio para que la línea del tiempo fluya bien
      relations: ['professional'],
    });
  }

  /* =========================
      UPDATE
  ========================== */
  async updateProgress(
    progress: Progress,
    data: Partial<Progress>,
  ): Promise<Progress> {
    Object.assign(progress, data);
    return this.progressDB.save(progress);
  }

  /* =========================
      SOFT DELETE
  ========================== */
  async deactivateProgress(progress: Progress): Promise<Progress> {
    progress.isActive = false;
    return this.progressDB.save(progress);
  }
}