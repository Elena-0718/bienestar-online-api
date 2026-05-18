import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { Order, OrderStatus } from 'src/entities/order.entity';
import { OrderRepository } from './order.repository';
import { CartRepository } from 'src/cart/cart.repository';
import { OrderDetail } from 'src/entities/order_detail.entity';
import { OrderDetailRepository } from 'src/orderdetail/orderdetail.repository';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { CreateOrderDto } from './dtos/create-order.dto'; // Importación necesaria

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartRepository: CartRepository,
    private readonly orderDetailRepository: OrderDetailRepository,
  ) {}

  // =========================
  // ADMIN
  // =========================

  getAllOrdersService() {
    return this.orderRepository.getAllOrdersRepository();
  }

  async putOrderStatusService(uuid: string, dto: UpdateOrderDto) {
    const order = await this.orderRepository.getOrderByIdRepository(uuid);
    if (!order) throw new NotFoundException('Orden no encontrada.');

    return this.orderRepository.putUpdateOrderStatusRepository(order, dto);
  }

  async deleteOrderService(uuid: string) {
    const order = await this.orderRepository.getOrderByIdRepository(uuid);
    if (!order) throw new NotFoundException('Orden no encontrada.');

    return this.orderRepository.deleteOrderRepository(order);
  }

  // =========================
  // USER
  // =========================

  async postCreateOrderService(req: any, dto: CreateOrderDto) { // 🔧 Añadido dto como parámetro
    const userUuid = req.user.user_uuid || req.user.uuid || req.user.id;

    if (!userUuid) {
      throw new BadRequestException('Usuario no identificado en el token.');
    }

    const cart = await this.cartRepository.getCartByUserIdRepository(userUuid);

    if (!cart || !cart.cartDetails || cart.cartDetails.length === 0) {
      throw new BadRequestException('Carrito vacío.');
    }

    const subtotal = cart.cartDetails.reduce(
      (sum, d) => sum + Number(d.unitPrice || 0) * d.quantity,
      0,
    );

    const iva = subtotal * 0.19;
    const deliveryCost = 4000;

    const order = new Order();
    order.user = { uuid: userUuid } as any; 
    order.subtotal = subtotal;
    order.discount = 0;
    order.iva = iva;
    order.deliveryCost = deliveryCost;
    order.total = subtotal + iva + deliveryCost;
    order.status = OrderStatus.CREATED;

    // 🔧 ASIGNACIÓN DE DATOS DE ENVÍO CONFIRMADOS
    // Si el usuario envió datos nuevos en el DTO, se usan esos. 
    // Si no, la entidad tomará los del perfil (según la lógica del repositorio/entidad)
   // Líneas 84 y 85 en order.service.ts
order.shippingAddress = dto.shippingAddress!; 
order.shippingPhone = dto.shippingPhone!;

    const savedOrder = await this.orderRepository.postCreateOrderRepository(order);

    const details = cart.cartDetails.map((d) => {
      const od = new OrderDetail();
      od.order = savedOrder;
      od.product = d.product;
      od.quantity = d.quantity;
      od.unitPrice = d.unitPrice;
      od.subtotal = Number(d.unitPrice || 0) * d.quantity;
      return od;
    });

    await this.orderDetailRepository.postCreateOrderDetailsRepository(details);

    await this.cartRepository.completeCart(cart);
    await this.cartRepository.clearCart(cart);

    return savedOrder;
  }

  getOrdersHistoryService(req: any) {
    const userUuid = req.user.user_uuid || req.user.uuid || req.user.id;
    return this.orderRepository.getOrdersHistoryRepository(userUuid);
  }

  async putCancelOrderService(req: any, uuid: string) {
    const userUuid = req.user.user_uuid || req.user.uuid || req.user.id;
    const order = await this.orderRepository.getOrderByIdRepository(uuid);
    
    if (!order) throw new NotFoundException('Orden no encontrada.');

    if (order.user.uuid !== userUuid) {
      throw new ForbiddenException('No puedes cancelar esta orden.');
    }

    if (order.status === OrderStatus.CANCELED) {
      throw new ConflictException('La orden ya está cancelada.');
    }

    if (
      order.status !== OrderStatus.CREATED &&
      order.status !== OrderStatus.PAID
    ) {
      throw new BadRequestException(
        'No se puede cancelar una orden en este estado.',
      );
    }

    return this.orderRepository.putCancelOrderRepository(order);
  }

  // =========================
  // SHARED
  // =========================

  async getOrderByIdService(uuid: string, req: any) {
    const userUuid = req.user.user_uuid || req.user.uuid || req.user.id;
    const order = await this.orderRepository.getOrderByIdRepository(uuid);
    
    if (!order) throw new NotFoundException('Orden no encontrada.');

    const isAdmin = req.user.role === 'ADMIN';
    const isOwner = order.user.uuid === userUuid;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException('No tienes permisos.');
    }

    return order;
  }
}