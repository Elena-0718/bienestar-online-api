import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/order_detail.entity';

@Injectable()
export class OrderDetailRepository {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailRepository: Repository<OrderDetail>,
  ) {}

  // =========================
  // CREAR DETALLES
  // =========================
  async postCreateOrderDetailsRepository(details: OrderDetail[]) {
    return this.orderDetailRepository.save(details);
  }

  // =========================
  // ADMIN
  // =========================
  async getOrderDetailsAdminRepository(order: Order) {
    return this.orderDetailRepository.find({
      where: {
        order: { uuid: order.uuid },
      },
      relations: ['product', 'order'],
    });
  }

  // =========================
  // USER  ✅ AQUÍ ESTABA EL PROBLEMA
  // =========================
  async getOrderDetailsUserRepository(
    order: Order,
    userUuid: string,
  ) {
    return this.orderDetailRepository.find({
      where: {
        order: {
          uuid: order.uuid,
          user: { uuid: userUuid },
        },
      },
      relations: ['product', 'order'],
    });
  }
}

