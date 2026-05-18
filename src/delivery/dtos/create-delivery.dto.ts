import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateDeliveryDto {
  @ApiProperty({
    description: 'UUID de la orden',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c4',
  })
  @IsUUID()
  @IsNotEmpty()
  order_uuid: string;
}
