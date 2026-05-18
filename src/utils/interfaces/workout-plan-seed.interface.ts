import { WeeklyWorkoutPlan } from '../../entities/workout.entity';

export interface WorkoutPlanSeedData {
  email: string;
  objective: string;
  notes?: string;
  weeklyRoutine: WeeklyWorkoutPlan;
}
