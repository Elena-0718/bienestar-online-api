import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { PaymentStatus } from 'src/entities/payment.entity';

export class UpdatePaymentDto {

  @ApiProperty({
    enum: PaymentStatus,
    description: 'Nuevo estado del pago.',
    example: PaymentStatus.CONFIRMED,
    required: false,
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status?: PaymentStatus;
}
