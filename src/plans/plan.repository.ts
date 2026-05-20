import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Plan } from 'src/entities/plan.entity';
import { CreatePlanDto } from './dtos/create-plan.dto';
import { UpdatePlanDto } from './dtos/update-plan.dto';

@Injectable()
export class PlanRepository {
  constructor(
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  // =========================
  // ADMIN
  // =========================

  getAllPlansRepository() {
    return this.planRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getPlanByIdRepository(uuid: string) {
    const plan = await this.planRepository.findOne({
      where: { uuid },
    });

    if (!plan) {
      throw new NotFoundException('Plan no encontrado');
    }

    return plan;
  }

  async postCreatePlanRepository(dto: CreatePlanDto) {
    const plan = this.planRepository.create(dto);
    return this.planRepository.save(plan);
  }

  async putUpdatePlanRepository(plan: Plan, dto: UpdatePlanDto) {
    Object.assign(plan, dto);
    await this.planRepository.save(plan);

    return {
      message: 'Plan actualizado correctamente',
    };
  }

  async deletePlanRepository(plan: Plan) {
    plan.isActive = false;
    await this.planRepository.save(plan);

    return {
      message: 'Plan desactivado correctamente',
    };
  }

  // =========================
  // USER
  // =========================

  getActivePlansRepository() {
    return this.planRepository.find({
      where: { isActive: true },
      order: { price: 'ASC' },
    });
  }
}

