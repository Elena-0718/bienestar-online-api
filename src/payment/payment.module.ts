import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentRepository } from './payment.repository';

import { Payment } from 'src/entities/payment.entity';
import { Order } from 'src/entities/order.entity';

import { OrderModule } from 'src/order/order.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { DeliveryModule } from 'src/delivery/delivery.module'; // ✅ IMPORT

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Order]),
    OrderModule,
    SubscriptionModule,
    DeliveryModule, // ✅ CLAVE
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
