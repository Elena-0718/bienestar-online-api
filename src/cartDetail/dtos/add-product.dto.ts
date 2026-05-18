import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsNotEmpty } from 'class-validator';

export class AddProductDto {

  @ApiProperty({
    description: 'UUID del producto físico que se desea agregar al carrito.',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c4',
  })
  @IsUUID('4', {
    message: 'El UUID del producto no es válido.',
  })
  @IsNotEmpty({
    message: 'El producto es obligatorio para agregarlo al carrito.',
  })
  product_uuid: string;

  @ApiProperty({
    description: 'Cantidad de unidades del producto a agregar al carrito.',
    example: 2,
    minimum: 1,
  })
  @IsInt({
    message: 'La cantidad debe ser un número entero.',
  })
  @Min(1, {
    message: 'La cantidad mínima permitida es 1.',
  })
  quantity: number;
}
