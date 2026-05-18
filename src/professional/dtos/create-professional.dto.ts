import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsObject,
  IsUrl, // Útil para validar que la URL de la foto tenga formato correcto
} from 'class-validator';
import { ProfessionalType } from 'src/entities/professional.entity';
import { User } from 'src/entities/users.entity';

export class CreateProfessionalDto {
  @IsEnum(ProfessionalType, {
    message: 'El tipo debe ser NUTRITIONIST o TRAINER',
  })
  @IsNotEmpty({ message: 'El tipo de profesional es obligatorio' })
  type: ProfessionalType;

  @IsString()
  @IsNotEmpty({ message: 'El título profesional es obligatorio' })
  professionalTitle: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Los años de experiencia no pueden ser negativos' })
  yearsOfExperience?: number;

  @IsOptional()
  @IsString()
  bio?: string;

  /* =========================================================
      NUEVO CAMPO: PHOTO URL
  ========================================================= */
  @IsOptional()
  @IsString()
  // No usamos IsUrl() porque a veces localhost:3002 da falsos negativos 
  // en validadores estrictos, con IsString() basta.
  photoUrl?: string;

  /* =========================================================
      USUARIO VINCULADO
  ========================================================= */
  @IsOptional() 
  @IsObject()
  user?: User; 
}