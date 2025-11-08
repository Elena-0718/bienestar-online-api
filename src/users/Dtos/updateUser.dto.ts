import { PartialType} from '@nestjs/mapped-types';
import { CreateUserDto } from './createUser.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
   @IsNotEmpty({ message: 'El id del usuario es obligatorio' })
  @IsUUID('4', { message: 'El id del usuario debe tener un formato UUID' })
  uuid: string;
}