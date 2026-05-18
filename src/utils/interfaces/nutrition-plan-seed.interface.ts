import { WeeklyPlan } from '../../entities/nutrition-plan.entity';

export interface NutritionPlanSeedData {
  userEmail: string;
  objective: string;
  notes?: string;
  weeklyPlan: WeeklyPlan;
}
