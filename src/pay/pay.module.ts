import { Module } from '@nestjs/common';
import { PayController } from './pay.controller';
import { PayService } from './pay.service';
import { PayRepository } from './pay.repository';


@Module({
  controllers: [PayController],
  providers: [PayService, PayRepository],
})
export class PayModule {}
