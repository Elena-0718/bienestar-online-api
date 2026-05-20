// src/orderdetail/orderdetail.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderModule } from 'src/order/order.module';
import { OrderDetailController } from './orderdetail.controller';
import { OrderDetailService } from './orderdetail.service';
import { OrderDetailRepository } from './orderdetail.repository';
import { OrderDetail } from 'src/entities/order_detail.entity'; // Verifica que este sea el nombre real

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderDetail, Order]),
    forwardRef(() => OrderModule),
  ],
  controllers: [OrderDetailController],
  providers: [OrderDetailService, OrderDetailRepository],
  exports: [OrderDetailRepository], // Esto permite que OrderService lo inyecte sin errores
})
export class OrderDetailModule {}
