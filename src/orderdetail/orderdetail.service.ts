import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';


import { OrderRepository } from 'src/order/order.repository';
import { Order } from 'src/entities/order.entity';
import { OrderDetailRepository } from './orderdetail.repository';

@Injectable()
export class OrderDetailService {
  constructor(
    private readonly orderDetailRepository: OrderDetailRepository,
    private readonly orderRepository: OrderRepository,
  ) {}

  /* =========================
     ADMIN
  ========================== */

  async getOrderDetailsAdminService(uuid: string) {
    // Validar si existe la orden
    const orderExists: Order | null =
      await this.orderRepository.getOrderByIdRepository(uuid);

    if (!orderExists) {
      throw new NotFoundException('Orden no encontrada.');
    }

    return this.orderDetailRepository.getOrderDetailsAdminRepository(
      orderExists,
    );
  }

  /* =========================
     USER
  ========================== */

  async getOrderDetailsUserService(req: any, uuid: string) {
    const userUuid: string = req.user.user_uuid;

    // Validar si existe la orden
    const orderExists: Order | null =
      await this.orderRepository.getOrderByIdRepository(uuid);

    if (!orderExists) {
      throw new NotFoundException('Orden no encontrada.');
    }

    // Validar que la orden pertenezca al usuario
    if (orderExists.user.uuid !== userUuid) {
      throw new ForbiddenException('No tienes acceso a esta orden.');
    }

    return this.orderDetailRepository.getOrderDetailsUserRepository(
      orderExists,
      userUuid,
    );
  }
}

