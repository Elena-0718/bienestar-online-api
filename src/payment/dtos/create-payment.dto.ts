import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsUUID, IsOptional, IsNumber } from 'class-validator';
import { PaymentMethod } from 'src/entities/payment.entity';

export class CreatePaymentDto {

  @ApiProperty({
    enum: PaymentMethod,
    description: 'Método de pago válido.',
    example: PaymentMethod.CARD,
  })
  @IsEnum(PaymentMethod, {
    message: 'El método de pago no es válido.',
  })
  @IsNotEmpty()
  method: PaymentMethod;

  @ApiProperty({
    description: 'UUID de la orden asociada al pago (opcional si es plan).',
    required: false,
  })
  @IsUUID()
  @IsOptional() // Clave para que no explote si pagas un plan
  order_uuid?: string;

  @ApiProperty({
    description: 'UUID del plan que se desea adquirir.',
    required: false,
  })
  @IsUUID()
  @IsOptional() // Clave para que no explote si pagas una orden
  plan_uuid?: string;

  @ApiProperty({
    description: 'Monto total a pagar por el plan.',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  total?: number;
}