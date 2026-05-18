import { IsOptional, IsDateString, IsString } from 'class-validator';

export class UpdateConsultationDto {
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @IsOptional()
  @IsString()
  meetingUrl?: string;
}
