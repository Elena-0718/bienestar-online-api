import { Injectable } from '@nestjs/common';

import { PlanRepository } from './plan.repository';
import { CreatePlanDto } from './dtos/create-plan.dto';
import { UpdatePlanDto } from './dtos/update-plan.dto';

@Injectable()
export class PlanService {
  constructor(private readonly planRepository: PlanRepository) {}

  // =========================
  // ADMIN
  // =========================

  getAllPlans() {
    return this.planRepository.getAllPlansRepository();
  }

  getPlanById(uuid: string) {
    return this.planRepository.getPlanByIdRepository(uuid);
  }

  createPlan(dto: CreatePlanDto) {
    return this.planRepository.postCreatePlanRepository(dto);
  }

  async updatePlan(uuid: string, dto: UpdatePlanDto) {
    const plan = await this.planRepository.getPlanByIdRepository(uuid);
    return this.planRepository.putUpdatePlanRepository(plan, dto);
  }

  async deletePlan(uuid: string) {
    const plan = await this.planRepository.getPlanByIdRepository(uuid);
    return this.planRepository.deletePlanRepository(plan);
  }

  // =========================
  // USER
  // =========================

  getActivePlans() {
    return this.planRepository.getActivePlansRepository();
  }
}
