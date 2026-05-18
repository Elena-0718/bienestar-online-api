import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DayMealsDto } from './day-meals.dto';


export class WeeklyNutritionPlanDto {
  @ValidateNested()
  @Type(() => DayMealsDto)
  monday: DayMealsDto;

  @ValidateNested()
  @Type(() => DayMealsDto)
  tuesday: DayMealsDto;

  @ValidateNested()
  @Type(() => DayMealsDto)
  wednesday: DayMealsDto;

  @ValidateNested()
  @Type(() => DayMealsDto)
  thursday: DayMealsDto;

  @ValidateNested()
  @Type(() => DayMealsDto)
  friday: DayMealsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DayMealsDto)
  saturday?: DayMealsDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => DayMealsDto)
  sunday?: DayMealsDto;
}
