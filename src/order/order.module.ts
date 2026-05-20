// src/order/order.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderRepository } from './order.repository';
import { CartModule } from 'src/cart/cart.module';
import { UserModule } from 'src/users/users.module';
import { OrderDetailModule } from 'src/order-details/orderdetail.module';
import { CartDetail } from 'src/entities/cartDetail.entity'; // Entidad
import { CartRepository } from 'src/cart/cart.repository'; // Lo necesita tu OrderService

// src/order/order.module.ts
@Module({
  imports: [
    TypeOrmModule.forFeature([Order]), // Solo la entidad propia de este módulo
    UserModule,
    CartModule, // <--- Este módulo ya provee el CartRepository
    forwardRef(() => OrderDetailModule),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository], // QUITAMOS CartRepository de aquí
  exports: [OrderRepository],
})
export class OrderModule {}