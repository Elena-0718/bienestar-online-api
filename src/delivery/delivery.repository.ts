import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Delivery, DeliveryStatus } from 'src/entities/delivery.entity';
import { Order } from 'src/entities/order.entity';

@Injectable()
export class DeliveryRepository {
  constructor(
    @InjectRepository(Delivery)
    private readonly deliveryRepo: Repository<Delivery>,
  ) {}

  findAll() {
    return this.deliveryRepo.find({
      relations: ['order', 'order.user'],
      order: { createdAt: 'DESC' },
    });
  }

  findById(uuid: string) {
    return this.deliveryRepo.findOne({
      where: { uuid },
      relations: ['order', 'order.user'],
    });
  }

  /**
   * ✅ MANUAL (ADMIN)
   * Crea delivery desde una Orden cargada con relaciones:
   * - order.user
   * - opcional: order.delivery (para validar rápido)
   *
   * Reglas:
   * - Si ya existe delivery para esa orden → retorna el existente (idempotente)
   * - Usa shippingAddress/shippingPhone de la orden (prioridad)
   * - Fallback a user.address/user.phone
   */
  async createDelivery(order: Order): Promise<Delivery> {
    if (!order?.uuid) {
      throw new BadRequestException('Orden inválida para crear delivery.');
    }

    // Si ya viene cargado (por relations), úsalo
    if ((order as any).delivery?.uuid) {
      return (order as any).delivery as Delivery;
    }

    // Idempotencia: si ya existe en BD, retornarlo
    const existing = await this.deliveryRepo.findOne({
      where: { order: { uuid: order.uuid } },
      relations: ['order', 'order.user'],
    });
    if (existing) return existing;

    const address =
      (order.shippingAddress && order.shippingAddress.trim()) ||
      (order.user?.address && String(order.user.address).trim()) ||
      '';

    const phoneNumber =
      (order.shippingPhone && order.shippingPhone.trim()) ||
      ((order.user as any)?.phone && String((order.user as any).phone).trim()) ||
      '';

    if (!address) {
      throw new BadRequestException(
        'No se puede crear delivery: falta shippingAddress en la orden y address en el usuario.',
      );
    }

    if (!phoneNumber) {
      throw new BadRequestException(
        'No se puede crear delivery: falta shippingPhone en la orden y phone en el usuario.',
      );
    }

    const delivery = this.deliveryRepo.create({
      order,
      address,
      phoneNumber,
      status: DeliveryStatus.PENDING,
    });

    try {
      return await this.deliveryRepo.save(delivery);
    } catch (err: any) {
      /**
       * Si hay carrera (2 admins crean al tiempo), el unique index en order
       * puede disparar 23505. En ese caso, devolvemos el existente.
       */
      const pgCode = (err as QueryFailedError & { code?: string })?.code;
      if (pgCode === '23505') {
        const already = await this.deliveryRepo.findOne({
          where: { order: { uuid: order.uuid } },
          relations: ['order', 'order.user'],
        });
        if (already) return already;
      }
      throw err;
    }
  }

  async updateStatus(delivery: Delivery, status: DeliveryStatus): Promise<Delivery> {
    if (!delivery) throw new NotFoundException('Delivery no encontrado.');

    delivery.status = status;

    if (status === DeliveryStatus.SHIPPED) {
      delivery.shippedAt = new Date();
    }

    if (status === DeliveryStatus.DELIVERED) {
      delivery.deliveredAt = new Date();
    }

    return this.deliveryRepo.save(delivery);
  }
}