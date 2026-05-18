import {
  IsOptional,
  IsString,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { WeeklyNutritionPlanDto } from './weekly-nutrition-plan.dto';


export class UpdateNutritionPlanDto {
  @IsOptional()
  @IsString()
  objective?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsObject()
  weeklyPlan?: WeeklyNutritionPlanDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
