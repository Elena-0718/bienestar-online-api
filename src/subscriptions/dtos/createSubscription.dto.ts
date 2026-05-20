import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';

import { BillingCycle } from 'src/enum/billingcycle.enum';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'UUID del usuario que contrata el plan',
    example: 'a12f3c3e-8c7a-4a9d-bc5f-123456789abc',
  })
  @IsUUID()
  userUuid: string;

  @ApiProperty({
    description: 'UUID del plan contratado',
    example: 'b34f9c2e-2f9a-4d3c-bc8d-987654321abc',
  })
  @IsUUID()
  planUuid: string;

  @ApiProperty({
    description: 'Ciclo de facturación',
    enum: BillingCycle,
    example: BillingCycle.MONTHLY,
  })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  

  @ApiProperty({
    description: 'Fecha de inicio de la suscripción',
    example: '2026-01-15',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    description: 'Fecha de finalización (opcional)',
    example: '2026-02-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
