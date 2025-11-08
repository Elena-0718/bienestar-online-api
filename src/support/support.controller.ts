import { Controller, Get, Param } from '@nestjs/common';
import { SupportService } from './support.service';

@Controller('support')
export class SupportController {
constructor(private readonly  supportservice: SupportService) {} 
 


@Get("getProductById")
getProductById(@Param("id") id: string) {
    return this.supportservice.getProductByIdService(id);
}


}
