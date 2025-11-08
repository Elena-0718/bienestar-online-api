import { PartialType} from '@nestjs/mapped-types';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateOrdersDto } from './createOrders.dto';


export class UpdateOrdersDto extends PartialType(CreateOrdersDto) {
   @IsNotEmpty({ message: 'El id del detalle de la orden es obligatorio' })
  @IsUUID('4', { message: 'El id del detalle de la orden debe tener un formato UUID' })
  uuid: string;
}