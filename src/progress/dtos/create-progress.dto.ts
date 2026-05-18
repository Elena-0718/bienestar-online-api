import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProgressDto {
  @IsOptional()
  @IsDateString()
  recordDate?: Date;

  @IsOptional()
  @IsNumber()
  weightKg?: number;

  @IsOptional()
  @IsNumber()
  bodyFatPercentage?: number;

  @IsOptional()
  @IsNumber()
  muscleMassKg?: number;

  @IsOptional()
  @IsNumber()
  waistCm?: number;

  @IsOptional()
  @IsNumber()
  hipCm?: number;

  @IsOptional()
  @IsNumber()
  chestCm?: number;

  @IsOptional()
  @IsString()
  energyLevel?: string;

  @IsOptional()
  @IsString()
  adherenceLevel?: string;

  @IsOptional()
  @IsString()
  professionalNotes?: string; // Agregado el ? y @IsOptional para mayor seguridad

  @IsOptional()
  @IsString()
  userNotes?: string; // Agregado el ? y @IsOptional
}