import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { NutritionPlan } from 'src/entities/nutrition-plan.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { CreateNutritionPlanDto } from './dtos/create-nutrition-plan.dto';
import { UpdateNutritionPlanDto } from './dtos/update-nutrition-plan.dto';
import { Professional } from 'src/entities/professional.entity';

@Injectable()
export class NutritionRepository extends Repository<NutritionPlan> {
  constructor(private readonly dataSource: DataSource) {
    super(NutritionPlan, dataSource.createEntityManager());
  }

  /* =========================
     CREATE
  ========================== */
  async createNutritionPlan(
    subscription: Subscription,
    professional: Professional,
    dto: CreateNutritionPlanDto,
  ): Promise<NutritionPlan> {
    const plan = this.create({
      subscription,
      professional,
      objective: dto.objective,
      notes: dto.notes,
      weeklyPlan: dto.weeklyPlan, // ✅ jsonb directo
      isActive: true,
    });

    return this.save(plan);
  }

  /* =========================
     FIND BY SUBSCRIPTION
  ========================== */
  async findBySubscription(
    subscriptionUuid: string,
  ): Promise<NutritionPlan[]> {
    return this.find({
      where: {
        subscription: { uuid: subscriptionUuid },
        isActive: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  /* =========================
     FIND ONE
  ========================== */
  async findById(uuid: string): Promise<NutritionPlan | null> {
    return this.findOne({
      where: { uuid },
    });
  }

  /* =========================
     UPDATE
  ========================== */
  async updatePlan(
    plan: NutritionPlan,
    dto: UpdateNutritionPlanDto,
  ): Promise<NutritionPlan> {
    Object.assign(plan, dto);
    return this.save(plan);
  }

  /* =========================
     SOFT DELETE
  ========================== */
  async deactivatePlan(plan: NutritionPlan): Promise<NutritionPlan> {
    plan.isActive = false;
    return this.save(plan);
  }
}
