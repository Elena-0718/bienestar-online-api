import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsNumber, Min } from 'class-validator';
import { ProfessionalType } from 'src/entities/professional.entity';

export class AdminCreateProfessionalDto {
  @IsUUID()
  @IsNotEmpty()
  userUuid: string;

  @IsEnum(ProfessionalType)
  type: ProfessionalType;

  @IsString()
  @IsNotEmpty()
  professionalTitle: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  yearsOfExperience?: number;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
}