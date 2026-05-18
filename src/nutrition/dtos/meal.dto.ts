import { IsString, IsOptional, IsNumber } from 'class-validator';

export class MealDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  portions?: string;

  @IsOptional()
  @IsNumber()
  calories?: number;
}
