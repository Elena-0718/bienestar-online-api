import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SubscriptionStatus } from 'src/enum/subscription-status.enum';


export class UpdateSubscriptionStatusDto {
  @ApiProperty({
    description: 'Nuevo estado de la suscripción',
    enum: SubscriptionStatus,
    example: SubscriptionStatus.PAUSED,
  })
  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;
}
