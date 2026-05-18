import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsEnum,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

import { Objective } from 'src/enum/objective.enum';
import { Sex } from 'src/enum/sex.enum';

export class UpdateUserDto {

  /* =========================
     DATOS PERSONALES (EDITABLES)
  ========================== */

  @ApiPropertyOptional({
    description: 'Nombre completo del usuario',
    example: 'Ana Milena Reyes Castro',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[\p{L}\s]+$/u, {
    message: 'El nombre solo debe contener letras y espacios.',
  })
  @MaxLength(150)
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Número de teléfono colombiano',
    example: '3146780918',
  })
  @IsOptional()
  @IsString()
  @Matches(/^(?:\+57)?3\d{9}$/, {
    message: 'Debe ser un número colombiano válido.',
  })
  phone?: string;

  @ApiPropertyOptional({ example: 'Calle 10 # 5-20' }) // <-- CAMBIO 2: Agregar address
  @IsOptional()
  @IsString()
  address?: string;

 

  /* =========================
     PERFIL DE BIENESTAR
  ========================== */

  @ApiPropertyOptional({
    description: 'Objetivo del usuario',
    enum: Objective,
  })
  @IsOptional()
  @IsEnum(Objective, {
    message: 'El objetivo no es válido.',
  })
  objective?: Objective;

  @ApiPropertyOptional({
    description: 'Peso en kilogramos',
    example: 70,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El peso debe ser un número.' })
  @Min(30)
  @Max(300)
  weight?: number;

  @ApiPropertyOptional({
    description: 'Altura en centimetros',
    example: 170,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La altura debe ser un número.' })
  @Min(1)
  @Max(300)
  height?: number;

  @ApiPropertyOptional({
    description: 'Observaciones adicionales del usuario',
    example: 'Prefiere entrenar en la mañana',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  observations?: string;

  @ApiPropertyOptional({
    description: 'URL de la foto de perfil',
    example: 'https://miapp.com/uploads/foto.jpg',
  })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  /* =========================
     ESTADO
  ========================== */

  @ApiPropertyOptional({
    description: 'Estado del usuario (activo/inactivo)',
    example: true,
  })
  @IsOptional()
  isActive?: boolean;
}
