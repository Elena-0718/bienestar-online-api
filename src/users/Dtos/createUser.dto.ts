import { IsEmail, IsInt, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    roles: string;
    static password(password: any, arg1: number): string | PromiseLike<string> {
        throw new Error('Method not implemented.');
    }
     @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({
    message: 'El nombre debe ser una cadena de caracteres',
  })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  @MinLength(3, {
    message: 'El nombre debe tener minimo 3 caracteres',
  })
  @MaxLength(25, {
    message: 'El nombre no puede contener mas de 25 caracteres',
  })


    name: string;


@IsNotEmpty({
    message: 'El apellido es requerido',
  })
  @IsString({
    message: 'El apellido debe ser una cadena de caracteres',
  })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/, {
    message: 'El apellido solo puede contener letras y espacios',
  })
  @MinLength(3, {
    message: 'El apellido debe tener minimo 3 caracteres',
  })
  @MaxLength(25, {
    message: 'El apellido no puede contener mas de 25 caracteres',
  })


    lastName: string;


    @IsEmail(
    {},
    {
      message: 'El email debe tener un formato de correo electronico',
    },
  )


    email: string;



    @IsNotEmpty({
    message: 'El numero telefonico es requerido',
  })
  @IsInt({
    message: 'El numero telefonico debe ser un entero',
  })
  


    phoneNumber: number;


 @IsNotEmpty({
    message: 'La fecha de cumpleaños es requerida',
  })
  @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
    message: 'La fecha de cumpleaños debe estar en formato dd/mm/aaaa',
  })



  birthDate: string;
    


     @IsNotEmpty({
    message: 'El nombre de usuario es requerido',
  })
  @IsString({
    message: 'El nombre de usuario debe ser una cadena caracteres',
  })



    userName: string;



    @IsNotEmpty({ message: 'El password es requerido' })
  @IsString({ message: 'El password debe ser una cadena de caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/,
    {
      message:
        'El password debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula, un número y un carácter especial',
    },
  )


  
    password: string; 
}
