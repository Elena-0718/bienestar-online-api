import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario para recuperación de contraseña',
    example: 'usuario@email.com',
  })
  @IsNotEmpty({ message: 'El email es obligatorio para recuperar la cuenta.' })
  @IsEmail({}, { message: 'Debe ser un correo válido.' })
  email: string;
}