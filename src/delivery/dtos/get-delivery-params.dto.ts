import { IsUUID } from 'class-validator';

export class GetDeliveryParamsDto {
  @IsUUID()
  uuid: string;
}
