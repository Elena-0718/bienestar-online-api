import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Roles } from 'src/enum/roles.enum';

export class ChangeRoleDto {
  @ApiProperty({
    description: 'Rol al que se desea cambiar el usuario.',
    example: Roles.USER,
    enum: Roles,
  })
  @IsNotEmpty({ message: 'El campo "role" es obligatorio.' })
  @IsEnum(Roles, { message: 'El rol debe ser "Admin", "User" o "Professional".' })
  role: Roles;
}