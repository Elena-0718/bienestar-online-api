import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { NutritionRepository } from './nutrition.repository';
import { SubscriptionRepository } from 'src/subscription/subscription.repository';
import { ProfessionalRepository } from 'src/professional/professional.repository';

import { CreateNutritionPlanDto } from './dtos/create-nutrition-plan.dto';
import { UpdateNutritionPlanDto } from './dtos/update-nutrition-plan.dto';
import { NutritionPlan } from 'src/entities/nutrition-plan.entity';

@Injectable()
export class NutritionService {
  constructor(
    private readonly nutritionRepo: NutritionRepository,
    private readonly subscriptionRepo: SubscriptionRepository,
    private readonly professionalRepo: ProfessionalRepository,
  ) {}

  /* =========================
      CREATE
  ========================== */
  async create(
    dto: CreateNutritionPlanDto,
    professionalId: string,
  ): Promise<NutritionPlan> {
    const subscription =
      await this.subscriptionRepo.getActiveSubscriptionByUser(dto.userUuid);

    if (!subscription) {
      throw new BadRequestException(
        'El usuario no tiene una suscripción activa',
      );
    }

    const professional = await this.professionalRepo.findOne({
      where: { uuid: professionalId },
    });

    if (!professional) {
      throw new NotFoundException('Profesional no encontrado');
    }

    return this.nutritionRepo.createNutritionPlan(
      subscription,
      professional,
      dto,
    );
  }

  /* =========================
      FIND BY USER 
      (Se encarga de buscar el plan de Natalia usando su UUID)
  ========================== */
  async findByUser(userUuid: string): Promise<NutritionPlan> {
    // Buscamos la suscripción del usuario específico
    const subscription = await this.subscriptionRepo.getActiveSubscriptionByUser(userUuid);

    if (!subscription) {
      throw new NotFoundException('Suscripción activa no encontrada para este usuario');
    }

    // El repositorio ya filtra por isActive: true y ordena por fecha descendente
    const plans = await this.nutritionRepo.findBySubscription(subscription.uuid);
    
    if (!plans || plans.length === 0) {
      throw new NotFoundException('No hay planes nutricionales asignados a este usuario');
    }
    
    // Retornamos el primero (el más reciente)
    return plans[0]; 
  }

  /* =========================
      FIND ONE
  ========================== */
  async findOne(uuid: string): Promise<NutritionPlan> {
    const plan = await this.nutritionRepo.findById(uuid);

    if (!plan) {
      throw new NotFoundException('Plan nutricional no encontrado');
    }

    return plan;
  }

  /* =========================
      UPDATE
  ========================== */
  async update(
    uuid: string,
    dto: UpdateNutritionPlanDto,
  ): Promise<NutritionPlan> {
    const plan = await this.findOne(uuid);
    return this.nutritionRepo.updatePlan(plan, dto);
  }

  /* =========================
      DELETE (SOFT)
  ========================== */
  async deactivate(uuid: string): Promise<NutritionPlan> {
    const plan = await this.findOne(uuid);
    return this.nutritionRepo.deactivatePlan(plan);
  }
}