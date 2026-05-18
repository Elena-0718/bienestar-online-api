import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Subscription } from 'src/entities/subscription.entity';
import { User } from 'src/entities/users.entity';
import { Plan } from 'src/entities/plan.entity';

import { UpdateSubscriptionStatusDto } from './dtos/updateSubscription.dto';
import { UpdateSubscriptionDatesDto } from './dtos/UpdateSubscriptionDates.dto';

import { BillingCycle } from 'src/enum/billingcycle.enum';
import { SubscriptionStatus } from 'src/enum/subscription-status.enum';

@Injectable()
export class SubscriptionRepository {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
  ) {}

  /* =========================
     CREATE
  ========================== */

  async createSubscription(data: {
    user: User;
    plan: Plan;
    billingCycle: BillingCycle;
    startDate: Date;
    endDate?: Date;
  }): Promise<Subscription> {
    const subscription = this.subscriptionRepo.create({
      user: data.user,
      plan: data.plan,
      billingCycle: data.billingCycle,
      startDate: data.startDate,
      endDate: data.endDate ?? null,
      status: SubscriptionStatus.ACTIVE,
    });

    return this.subscriptionRepo.save(subscription);
  }

  /* =========================
     READ
  ========================== */

  getAllSubscriptions(): Promise<Subscription[]> {
    return this.subscriptionRepo.find({
      relations: ['user', 'plan'],
      order: { createdAt: 'DESC' },
    });
  }

  getSubscriptionById(uuid: string): Promise<Subscription | null> {
    return this.subscriptionRepo.findOne({
      where: { uuid },
      relations: ['user', 'plan'],
    });
  }

  /**
   * 🟢 SUSCRIPCIÓN ACTIVA (CLAVE PARA AUTH / GUARDS)
   * ✅ FIX: si existen 2 ACTIVE (FREE + BIENESTAR), devolvemos la más reciente.
   */
  async getActiveSubscriptionByUser(
    userUuid: string,
  ): Promise<Subscription | null> {
    return this.subscriptionRepo
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.plan', 'plan')
      .leftJoin('subscription.user', 'user')
      .where('user.uuid = :userUuid', { userUuid })
      .andWhere('subscription.status = :status', {
        status: SubscriptionStatus.ACTIVE,
      })
      .orderBy('subscription.created_at', 'DESC') // 👈 columna real del entity
      .getOne();
  }

  /* =========================
     UPDATE
  ========================== */

  async updateSubscriptionStatus(
    subscription: Subscription,
    dto: UpdateSubscriptionStatusDto,
  ): Promise<Subscription> {
    subscription.status = dto.status;
    return this.subscriptionRepo.save(subscription);
  }

  async updateSubscriptionDates(
    subscription: Subscription,
    dto: UpdateSubscriptionDatesDto,
  ): Promise<Subscription> {
    if (dto.endDate) {
      subscription.endDate = new Date(dto.endDate);
    }
    return this.subscriptionRepo.save(subscription);
  }

  /* =========================
     EXTRA (RECOMENDADO)
  ========================== */

  /**
   * 🔥 Cancela todas las suscripciones activas del usuario.
   * Úsalo cuando confirmas un pago de plan para evitar 2 ACTIVE.
   */
  async cancelAllActiveByUser(userUuid: string): Promise<void> {
    await this.subscriptionRepo
      .createQueryBuilder()
      .update(Subscription)
      .set({
        status: SubscriptionStatus.CANCELED,
        endDate: () => 'CURRENT_DATE',
      })
      .where('user_uuid = :userUuid', { userUuid })
      .andWhere('status = :status', { status: SubscriptionStatus.ACTIVE })
      .execute();
  }
}