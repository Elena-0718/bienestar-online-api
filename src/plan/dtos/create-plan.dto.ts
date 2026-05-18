import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { PlanType } from '../../entities/plan.entity';


export class CreatePlanDto {
  @ApiProperty({
    description: 'Nombre visible del plan',
    example: 'Plan Bienestar',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Tipo de plan',
    enum: PlanType,
    example: PlanType.BIENESTAR,
  })
  @IsEnum(PlanType)
  type: PlanType;

  @ApiProperty({
    description: 'Precio mensual base del plan',
    example: 89000,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Cantidad de consultas nutricionales al mes',
    example: 2,
  })
  @IsInt()
  @Min(0)
  nutritionConsultations: number;

  @ApiProperty({
    description: 'Cantidad de consultas fitness/deportólogo al mes',
    example: 2,
  })
  @IsInt()
  @Min(0)
  fitnessConsultations: number;

  @ApiProperty({
    description: 'Acceso a biblioteca de artículos y videos',
    example: true,
  })
  @IsBoolean()
  hasLibraryAccess: boolean;

  @ApiProperty({
    description: 'Indica si el plan está activo',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
