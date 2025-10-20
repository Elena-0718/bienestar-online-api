import { Module } from '@nestjs/common';
import { OrderdetailController } from './orderdetail.controller';
import { OrderdetailService } from './orderdetail.service';

@Module({
  controllers: [OrderdetailController],
  providers: [OrderdetailService]
})
export class OrderdetailModule {}
