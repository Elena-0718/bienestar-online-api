import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ApproveProfessionalDto {
  @IsBoolean({ message: 'El campo isApproved debe ser true o false' })
  @IsNotEmpty({ message: 'El estado de aprobación es obligatorio' })
  isApproved: boolean;
}