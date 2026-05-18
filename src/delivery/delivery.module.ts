import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Delivery } from 'src/entities/delivery.entity';
import { Order } from 'src/entities/order.entity';

import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { DeliveryRepository } from './delivery.repository';

import { OrderModule } from 'src/order/order.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Delivery, Order]),
    OrderModule,
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService, DeliveryRepository],
  exports: [DeliveryRepository], // ✅ CLAVE: disponible para otros módulos (PaymentModule)
})
export class DeliveryModule {}