import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MealDto } from './meal.dto';


export class DayMealsDto {
  @ValidateNested({ each: true })
  @Type(() => MealDto)
  breakfast: MealDto[];

  @ValidateNested({ each: true })
  @Type(() => MealDto)
  lunch: MealDto[];

  @ValidateNested({ each: true })
  @Type(() => MealDto)
  dinner: MealDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MealDto)
  snacks?: MealDto[];
}
