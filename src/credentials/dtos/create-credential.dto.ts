import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, ValidateIf } from 'class-validator';
import { MatchPassword } from 'src/decorators/matchPassword.decorator';

export class CreateCredentialDto {
  @ApiProperty({
    description: 'Correo electrónico único del usuario',
    example: 'usuario@email.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Contraseña segura',
    example: 'Password123*',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?_~\-])[A-Za-z\d!@#$%^&*?_~\-]{8,}$/,
  )
  password: string;

  @ApiProperty({
    description: 'Confirmación de contraseña',
    example: 'Password123*',
  })
  @MatchPassword('password')
  confirmPassword: string;
}
