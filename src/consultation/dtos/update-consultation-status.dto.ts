import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ConsultationStatus } from 'src/entities/consultation.entity';

export class UpdateConsultationStatusDto {
  @IsEnum(ConsultationStatus)
  status: ConsultationStatus;

  @IsOptional()
  @IsString()
  professionalNotes?: string;
}
