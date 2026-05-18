import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductQuantityDto {
  @ApiProperty({
    description: 'Cantidad del producto que se va a actualizar en el carrito.',
    example: 5,
    minimum: 1,
  })
  @Type(() => Number)
  @IsNotEmpty({
    message: 'La cantidad es obligatoria.',
  })
  @IsInt({
    message: 'La cantidad debe ser un número entero.',
  })
  @Min(1, {
    message: 'La cantidad mínima permitida es 1.',
  })
  quantity: number;
}
