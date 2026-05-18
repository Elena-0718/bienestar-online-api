import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { DeliveryStatus } from 'src/entities/delivery.entity';

export class UpdateDeliveryStatusDto {
  @ApiProperty({
    enum: DeliveryStatus,
    example: DeliveryStatus.IN_TRANSIT,
  })
  @IsEnum(DeliveryStatus)
  @IsNotEmpty()
  status: DeliveryStatus;
}

