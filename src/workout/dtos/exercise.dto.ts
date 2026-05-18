import { IsString, IsOptional, IsNumber } from 'class-validator';

export class Exercisedto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  sets: number;

  @IsOptional()
  @IsNumber()
  reps?: number;

  @IsOptional()
  @IsString()
  time?: string;

  @IsString()
  rest: string;
}
