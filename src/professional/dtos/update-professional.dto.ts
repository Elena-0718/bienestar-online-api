import { PartialType } from '@nestjs/swagger'; // Cambiado para soporte de Swagger
import { CreateProfessionalDto } from './create-professional.dto';
import { IsOptional, IsBoolean } from 'class-validator';

export class UpdateProfessionalDto extends PartialType(CreateProfessionalDto) {
  @IsOptional()
  @IsBoolean({ message: 'El estado debe ser un valor booleano' })
  isActive?: boolean;
}