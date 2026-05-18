import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DeliveryRepository } from './delivery.repository';
import { OrderRepository } from 'src/order/order.repository';
import { CreateDeliveryDto } from './dtos/create-delivery.dto';
import { PaymentStatus } from 'src/entities/payment.entity';
import { UpdateDeliveryStatusDto } from './dtos/UpdateStatusDeliverydto';
import { Roles } from 'src/enum/roles.enum';

@Injectable()
export class DeliveryService {
  constructor(
    private readonly deliveryRepo: DeliveryRepository,
    private readonly orderRepo: OrderRepository,
  ) {}

  getAll() {
    return this.deliveryRepo.findAll();
  }

  async create(dto: CreateDeliveryDto) {
    const order = await this.orderRepo.getOrderByIdRepository(dto.order_uuid);
    if (!order) throw new NotFoundException('Orden no existe');

    if (!order.payment || order.payment.status !== PaymentStatus.CONFIRMED) {
      throw new BadRequestException('Pago no confirmado');
    }

    if (order.delivery) {
      throw new BadRequestException('La orden ya tiene domicilio');
    }

    return this.deliveryRepo.createDelivery(order);
  }

  async updateStatus(uuid: string, dto: UpdateDeliveryStatusDto) {
    const delivery = await this.deliveryRepo.findById(uuid);
    if (!delivery) throw new NotFoundException('Domicilio no encontrado');

    return this.deliveryRepo.updateStatus(delivery, dto.status);
  }

  async getById(uuid: string, req: any) {
    const delivery = await this.deliveryRepo.findById(uuid);
    if (!delivery) throw new NotFoundException('Domicilio no encontrado');

    if (req.user.role === Roles.USER) {
      if (delivery.order.user.uuid !== req.user.user_uuid) {
        throw new ForbiddenException('No autorizado');
      }
    }

    return delivery;
  }
}

