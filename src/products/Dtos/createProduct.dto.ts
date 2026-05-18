import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsUUID,
  Min,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nombre del producto.',
    example: 'Proteína Whey 2lb',
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio.' })
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del producto.',
    example: 'Proteína whey concentrada ideal para recuperación muscular.',
  })
  @IsString()
  @IsNotEmpty({ message: 'La descripción del producto es obligatoria.' })
  description: string;

  @ApiProperty({
    description: 'Precio del producto.',
    example: 120000,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo.' })
  price: number;

  @ApiProperty({
    description: 'Cantidad disponible en inventario.',
    example: 50,
  })
  @Type(() => Number)
  @IsInt({ message: 'El stock debe ser un número entero.' })
  @Min(0, { message: 'El stock no puede ser negativo.' })
  stock: number;

  @ApiProperty({
    description: 'UUID de la categoría a la que pertenece el producto.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c4',
  })
  @IsUUID('4', { message: 'La categoría debe ser un UUID válido.' })
  @IsNotEmpty({ message: 'La categoría es obligatoria.' })
  categoryUuid: string;

  @ApiProperty({
    description: 'Listado de URLs de imágenes del producto.',
    example: [
      'https://miapp.com/images/product1.jpg',
      'https://miapp.com/images/product2.jpg',
    ],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: 'Las imágenes deben enviarse como un arreglo.' })
  @IsUrl({}, { each: true })
  images?: string[];
}
