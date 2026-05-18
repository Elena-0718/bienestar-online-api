import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { WorkoutDayDto } from './workout-day.dto';



export class WeeklyWorkoutPlanDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => WorkoutDayDto)
  monday?: WorkoutDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkoutDayDto)
  tuesday?: WorkoutDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkoutDayDto)
  wednesday?: WorkoutDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkoutDayDto)
  thursday?: WorkoutDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkoutDayDto)
  friday?: WorkoutDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkoutDayDto)
  saturday?: WorkoutDayDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => WorkoutDayDto)
  sunday?: WorkoutDayDto;
}
