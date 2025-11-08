import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateSubscriptionDto {

@IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({
    message: 'El nombre debe ser una cadena de caracteres',
  })

  @MinLength(3, {
    message: 'El nombre debe tener minimo 3 caracteres',
  })
  @MaxLength(25, {
    message: 'El nombre no puede contener mas de 25 caracteres',
  })



  name: string;



@IsNotEmpty({
          message: 'La fecha es requerida',
        })
 @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
          message: 'La fecha debe estar en formato dd/mm/aaaa',
        })
date: string;




}