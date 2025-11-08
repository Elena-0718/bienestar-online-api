import { PartialType} from '@nestjs/mapped-types';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateProductDto } from './createProduct.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
   @IsNotEmpty({ message: 'El id del Producto es obligatorio' })
  @IsUUID('4', { message: 'El id del producto debe tener un formato UUID' })
  uuid: string;
}