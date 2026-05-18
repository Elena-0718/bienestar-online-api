import { IsUUID, IsEnum, IsDateString } from 'class-validator';
import { ConsultationType } from 'src/entities/consultation.entity';

export class CreateConsultationDto {
  @IsUUID()
  professionalUuid: string;

  @IsEnum(ConsultationType)
  type: ConsultationType;

  @IsDateString()
  scheduledAt: string;
}

