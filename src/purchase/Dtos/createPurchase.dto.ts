import { IsNotEmpty, Matches } from "class-validator";

export class CreatePurchaseDto {

@IsNotEmpty({
          message: 'La direccion es requerida',
})
  addressDelivery: string;

  @IsNotEmpty({
          message: 'La fecha es requerida',
        })
 @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
          message: 'La fecha debe estar en formato dd/mm/aaaa',
        })
  dateCreated: string;

  @IsNotEmpty({
        message: 'La fecha es requerida',
      })
      @Matches(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/, {
        message: 'La fecha debe estar en formato dd/mm/aaaa',
      })

    deliveryDate: string;

}