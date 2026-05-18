import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsUUID()
  @IsNotEmpty()
  product_uuid: string;

  @IsNotEmpty()
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'Lista de productos', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ description: 'Dirección de envío personalizada', example: 'Calle 123 #45-67', required: false })
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiProperty({ description: 'Teléfono de contacto para la entrega', example: '3001234567', required: false })
  @IsString()
  @IsOptional()
  shippingPhone?: string;
}