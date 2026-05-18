import { IsUUID, IsString, IsOptional, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WeeklyNutritionPlanDto } from './weekly-nutrition-plan.dto';


export class CreateNutritionPlanDto {
  @IsUUID()
  userUuid: string;

  @IsString()
  objective: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => WeeklyNutritionPlanDto)
  weeklyPlan: WeeklyNutritionPlanDto;
}
