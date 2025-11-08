import { PartialType} from '@nestjs/mapped-types';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreatePurchaseDto } from './createPurchase.dto';


export class UpdatePurchaseDto extends PartialType(CreatePurchaseDto) {
   @IsNotEmpty({ message: 'El id de la compra es obligatorio' })
  @IsUUID('4', { message: 'El id de la compra debe tener un formato UUID' })
  uuid: string;
}