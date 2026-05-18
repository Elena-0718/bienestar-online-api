import { PartialType } from '@nestjs/swagger'; // O '@nestjs/mapped-types' si no usas Swagger
import { CreateProgressDto } from './create-progress.dto';

/**
 * UpdateProgressDto hereda todas las validaciones de CreateProgressDto
 * pero transforma cada campo en opcional (@IsOptional).
 */
export class UpdateProgressDto extends PartialType(CreateProgressDto) {}