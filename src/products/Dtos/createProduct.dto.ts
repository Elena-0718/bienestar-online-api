import { IsInt, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateProductDto {

      @IsNotEmpty({ message: 'El nombre  es requerido' })
      @IsString({
    message: 'El nombre debe ser una cadena de caracteres',
  })
      @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/, {
        message: 'El nombre solo puede contener letras y espacios',
      })
      @MinLength(3, {
        message: 'El nombre debe tener minimo 3 caracteres',
      })
      @MaxLength(50, {
        message: 'El nombre no puede contener mas de 50 caracteres',
      })
    
  name: string;



    @IsNotEmpty({ message: 'La descripcion es requerida' })
    @IsString({
    message: 'El nombre debe ser una cadena de caracteres',
  })
    @MinLength(20, {
      message: 'La descripcion debe tener minimo 20 caracteres',
    })
    @MaxLength(200, {
      message: 'La descripcion no puede contener mas de 200 caracteres',
    })


  description: string;


    @IsNotEmpty({ message: 'El precio es requerido' })  


  price: number;

    @IsNotEmpty({ message: 'El stock es requerido' })
    @IsInt({
        message: 'El stock debe ser un entero',
      })
  stock: number;
} 