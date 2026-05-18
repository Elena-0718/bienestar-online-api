import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsUUID,
  IsOptional,
  Min,
  IsInt,
  IsArray,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto {
  @ApiPropertyOptional({
    description: 'Nombre del producto.',
    example: 'Proteína Whey 2lb',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Descripción del producto.',
    example: 'Proteína para recuperación muscular.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Precio del producto.',
    example: 115000,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'Stock disponible.',
    example: 40,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    description: 'UUID de la nueva categoría.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c4',
  })
  @IsOptional()
  @IsUUID('4', { message: 'La categoría debe ser un UUID válido.' })
  categoryUuid?: string;

  @ApiPropertyOptional({
    description: 'Listado de URLs de imágenes del producto.',
    example: [
      'https://miapp.com/images/product1.jpg',
      'https://miapp.com/images/product2.jpg',
    ],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];
}
