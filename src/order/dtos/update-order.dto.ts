import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { OrderStatus } from 'src/entities/order.entity';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Nuevo estado de la orden',
    enum: OrderStatus,
    example: OrderStatus.SHIPPED,
  })
  @IsEnum(OrderStatus, {
    message: 'Estado de orden no válido.',
  })
  status: OrderStatus;
}

