import { IsInt, IsNotEmpty } from "class-validator";

export class CreateOrdersDto {

    @IsNotEmpty({ message: 'La cantidad es requerido' })
        @IsInt({
            message: 'La cantidad debe ser un entero',
          })

    cant: number;

    @IsNotEmpty({ message: 'El subtotal es requerido' })

    subTotal: number;

    @IsNotEmpty({ message: 'El iva es requerido' })

    iva: number;

    @IsNotEmpty({ message: 'El descuento es requerido' })
    
    discount: number;   

}