import {
  IsUUID,
  IsString,
  IsOptional,
  IsBoolean,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { WeeklyWorkoutPlanDto } from './weekly-workout-plan.dto';


/* =========================
   DTO PRINCIPAL
========================= */

export class CreateWorkoutPlanDto {
  @IsUUID()
  userId: string;

  @IsUUID()
  professionalId: string;

  @IsString()
  objective: string;

  @IsOptional()
  @IsString()
  notes: string;

  @IsObject()
  @ValidateNested()
  @Type(() => WeeklyWorkoutPlanDto)
  weeklyRoutine: WeeklyWorkoutPlanDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
