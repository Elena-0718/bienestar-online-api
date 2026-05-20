import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SubscriptionRepository } from './subscription.repository';

import { User } from 'src/entities/users.entity';
import { Plan, PlanType } from 'src/entities/plan.entity';
import { Subscription } from 'src/entities/subscription.entity';

import { CreateSubscriptionDto } from './dtos/createSubscription.dto';
import { UpdateSubscriptionStatusDto } from './dtos/updateSubscription.dto';
import { UpdateSubscriptionDatesDto } from './dtos/UpdateSubscriptionDates.dto';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionRepo: SubscriptionRepository,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Plan)
    private readonly planRepo: Repository<Plan>,
  ) {}

  // =========================
  // CREATE
  // =========================

  async createSubscription(dto: CreateSubscriptionDto) {
    const user = await this.userRepo.findOne({
      where: { uuid: dto.userUuid },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado.');

    const plan = await this.planRepo.findOne({
      where: { uuid: dto.planUuid },
    });
    if (!plan) throw new NotFoundException('Plan no encontrado.');

    // Buscar suscripción activa actual
    const activeSubscription =
      await this.subscriptionRepo.getActiveSubscriptionByUser(dto.userUuid);

    /**
     * ✅ REGLA AJUSTADA:
     * - Si ya hay ACTIVE y NO es FREE => Bloqueamos (tu regla original).
     * - Si ya hay ACTIVE y es FREE => Permitimos reemplazar por el nuevo plan.
     */
    if (activeSubscription) {
      const currentType = activeSubscription?.plan?.type ?? PlanType.FREE;

      // Si ya tiene plan pago/real activo, no permitimos otra suscripción activa
      if (currentType !== PlanType.FREE) {
        throw new BadRequestException(
          'El usuario ya tiene una suscripción activa.',
        );
      }

      // Si la activa es FREE, cancelamos y reemplazamos por el nuevo plan
      // (Esto evita que queden 2 ACTIVE y que el guard tome el FREE)
      await this.subscriptionRepo.cancelAllActiveByUser(dto.userUuid);
    }

    return this.subscriptionRepo.createSubscription({
      user,
      plan,
      billingCycle: dto.billingCycle,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    });
  }

  // =========================
  // READ
  // =========================

  getAllSubscriptions() {
    return this.subscriptionRepo.getAllSubscriptions();
  }

  async getSubscriptionById(uuid: string) {
    const subscription = await this.subscriptionRepo.getSubscriptionById(uuid);

    if (!subscription) {
      throw new NotFoundException('Suscripción no encontrada.');
    }

    return subscription;
  }

  // =========================
  // UPDATE
  // =========================

  async updateSubscriptionStatus(uuid: string, dto: UpdateSubscriptionStatusDto) {
    const subscription = await this.subscriptionRepo.getSubscriptionById(uuid);

    if (!subscription) {
      throw new NotFoundException('Suscripción no encontrada.');
    }

    return this.subscriptionRepo.updateSubscriptionStatus(subscription, dto);
  }

  async updateSubscriptionDates(uuid: string, dto: UpdateSubscriptionDatesDto) {
    const subscription = await this.subscriptionRepo.getSubscriptionById(uuid);

    if (!subscription) {
      throw new NotFoundException('Suscripción no encontrada.');
    }

    return this.subscriptionRepo.updateSubscriptionDates(subscription, dto);
  }

  // =========================
  // OBTENER SUSCRIPCIÓN ACTIVA POR USUARIO
  // =========================

  async findActiveByUser(userUuid: string): Promise<Subscription> {
    const subscription =
      await this.subscriptionRepo.getActiveSubscriptionByUser(userUuid);

    if (!subscription) {
      throw new NotFoundException('El usuario no tiene una suscripción activa.');
    }

    return subscription;
  }
}