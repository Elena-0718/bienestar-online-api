import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'usuario@email.com',
  })
  @IsNotEmpty({ message: 'El email es obligatorio.' })
  @IsEmail({}, { message: 'Debe ser un correo válido.' })
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: 'Password123*',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
