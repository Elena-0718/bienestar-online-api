import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order, OrderStatus } from 'src/entities/order.entity';
import { UpdateOrderDto } from './dtos/update-order.dto';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  // =========================
  // ADMIN
  // =========================

  getAllOrdersRepository(): Promise<Order[]> {
    return this.orderRepository.find({
      order: { createdAt: 'DESC' },
      relations: [
        'user',
        'payment',
        'delivery',
        'orderDetails',
        'orderDetails.product', // ✅ detalle completo
      ],
    });
  }

  async putUpdateOrderStatusRepository(order: Order, dto: UpdateOrderDto) {
    order.status = dto.status;
    await this.orderRepository.save(order);

    return {
      message: `Estado de la orden actualizado a ${dto.status}.`,
    };
  }

  async deleteOrderRepository(order: Order) {
    order.status = OrderStatus.CANCELED;
    await this.orderRepository.save(order);

    return {
      message: 'Orden cancelada correctamente.',
    };
  }

  // =========================
  // USER
  // =========================

  async postCreateOrderRepository(order: Order): Promise<Order> {
    return this.orderRepository.save(order);
  }

  getOrdersHistoryRepository(userUuid: string): Promise<Order[]> {
    return this.orderRepository.find({
      where: { user: { uuid: userUuid } },
      order: { createdAt: 'DESC' },
      relations: [
        'user',
        'payment',
        'delivery',
        'orderDetails',
        'orderDetails.product', // ✅ historial con productos
      ],
    });
  }

  async putCancelOrderRepository(order: Order) {
    order.status = OrderStatus.CANCELED;
    await this.orderRepository.save(order);

    return {
      message: 'Orden cancelada correctamente.',
    };
  }

  // =========================
  // SHARED
  // =========================

  getOrderByIdRepository(uuid: string): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { uuid },
      relations: [
        'user',
        'payment',
        'delivery',
        'orderDetails',
        'orderDetails.product', // ✅ necesario para ver items
      ],
    });
  }

  // =========================
  // PAYMENT
  // =========================

  async putOrderPreparingRepository(order: Order) {
    order.status = OrderStatus.PAID;
    await this.orderRepository.save(order);

    return {
      message: `Orden ${order.uuid} marcada como PAGADA.`,
      status: order.status,
    };
  }
}