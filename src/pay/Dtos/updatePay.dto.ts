import { PartialType} from '@nestjs/mapped-types';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreatePayDto } from './createPay.dto';

export class UpdatePayDto extends PartialType(CreatePayDto) {
   @IsNotEmpty({ message: 'El id del Pago es obligatorio' })
  @IsUUID('4', { message: 'El id del pago debe tener un formato UUID' })
  uuid: string;
}