import { PartialType} from '@nestjs/mapped-types';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateSubscriptionDto } from './createSubscription.dto';


export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {
   @IsNotEmpty({ message: 'El id de la suscripcion es obligatorio' })
  @IsUUID('4', { message: 'El id de la suscripcion debe tener un formato UUID' })
  uuid: string;
}