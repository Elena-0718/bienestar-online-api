import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateSubscriptionDatesDto {
  @ApiProperty({
    description: 'Nueva fecha de finalización',
    example: '2026-03-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
