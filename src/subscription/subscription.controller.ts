import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './Dtos/createSubscription.dto';
import { UpdateSubscriptionDto } from './Dtos/updateSubscription.dto';

@Controller('subscription')
export class SubscriptionController {
  putUpdateSubscriptionService: any;
    
    constructor(private readonly subscriptionService: SubscriptionService) {}


    // Ruta para obtener una suscripcion por su ID
     @Get("getSubscriptionById/:uuid")
      getSubscriptionById(@Param('uuid', ParseUUIDPipe) uuid: string) {
        return this.subscriptionService.getSubscriptionByIdService(uuid); 
        
      }

      // Ruta para crear una nueva suscripcion

       @Post('createSubscription')
         postCreateUser(@Body() createSubscriptionDto: CreateSubscriptionDto) {
          return this.subscriptionService.postCreateSubscriptionService(createSubscriptionDto);
        
        }

        @Put('updateSubscription/:uuid')
  @HttpCode(HttpStatus.OK)
  updateSubscription(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateSubscriptionDto: CreateSubscriptionDto, 
  ) {
    return this.putUpdateSubscriptionService(uuid,updateSubscriptionDto);
  }

@Delete('deleteSubscription/:uuid')
  @HttpCode(HttpStatus.OK)
  deleteSubscription(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.subscriptionService.deleteSubscriptionService(uuid);
  }
}

