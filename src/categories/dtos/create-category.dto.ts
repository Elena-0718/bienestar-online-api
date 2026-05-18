import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Nombre de la categoría de bienestar o fitness.',
    example: 'Suplementos Deportivos',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio.' })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción opcional de la categoría.',
    example: 'Productos enfocados en mejorar el rendimiento físico y la recuperación muscular.',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
