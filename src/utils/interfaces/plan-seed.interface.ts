import { PlanType } from '../../entities/plan.entity';

export interface PlanSeedData {
  name: string;
  type: PlanType;
  price: number;
  nutritionConsultations: number;
  fitnessConsultations: number;
  hasLibraryAccess: boolean;
  isActive: boolean;
}
