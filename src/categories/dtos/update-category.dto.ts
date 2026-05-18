import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @ApiPropertyOptional({
    description: 'Nombre de la categoría de bienestar o fitness.',
    example: 'Accesorios de Entrenamiento',
  })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto válido.' })
  name?: string;

  @ApiPropertyOptional({
    description: 'Descripción opcional de la categoría.',
    example:
      'Accesorios utilizados para mejorar la técnica y el rendimiento durante el entrenamiento.',
  })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto válido.' })
  description?: string;
}
