import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Payment,
  PaymentStatus,
  PaymentMethod,
} from 'src/entities/payment.entity';

import { OrderRepository } from 'src/order/order.repository';
import { UpdatePaymentDto } from './dtos/update-payment.dto';

@Injectable()
export class PaymentRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    private readonly orderRepository: OrderRepository,
  ) {}

  // =========================
  // READ
  // =========================

  // Buscar pago por orden (Tienda)
  async getPaymentByOrderRepository(orderUuid: string) {
    return this.paymentRepository.findOne({
      where: { order: { uuid: orderUuid } },
      relations: [
        'order',
        'order.user',
        'order.delivery', // ✅ IMPORTANTE
        'plan',
        'user',
      ],
    });
  }

  // Obtener todos los pagos (Admin)
  async getAllPaymentsRepository() {
    return this.paymentRepository.find({
      order: { createdAt: 'DESC' },
      relations: [
        'order',
        'order.user',
        'order.delivery', // ✅ IMPORTANTE
        'plan',
        'user',
      ],
    });
  }

  async getPaymentByIdRepository(uuid: string) {
    return this.paymentRepository.findOne({
      where: { uuid },
      relations: [
        'order',
        'order.user',
        'order.delivery', // ✅ CLAVE para no duplicar delivery
        'plan',
        'user',
      ],
    });
  }

  // =========================
  // UPDATE
  // =========================

  /**
   * CONFIRMAR PAGO
   * - Marca pago como CONFIRMED
   * - Si tiene order => marca orden como PAID (preparing)
   * - Si tiene plan => el service crea suscripción (no aquí)
   */
  async putConfirmPaymentRepository(payment: Payment) {
    payment.status = PaymentStatus.CONFIRMED;
    payment.paidAt = new Date();

    // Si el pago tiene una orden (productos)
    if (payment.order) {
      await this.orderRepository.putOrderPreparingRepository(payment.order);
    }

    await this.paymentRepository.save(payment);

    return {
      message: 'Pago confirmado correctamente.',
      payment,
    };
  }

  async putUpdatePaymentStatusRepository(payment: Payment, dto: UpdatePaymentDto) {
    if (dto.status) {
      payment.status = dto.status;
    }
    await this.paymentRepository.save(payment);
    return payment;
  }

  async deletePaymentRepository(payment: Payment) {
    payment.status = PaymentStatus.REJECTED;
    await this.paymentRepository.save(payment);
    return payment;
  }

  // =========================
  // CREATE
  // =========================

  /**
   * REGISTRAR PAGO (Polimórfico)
   * Soporta tanto órdenes como planes directos
   */
  async postRegisterPaymentRepository(data: {
    method: PaymentMethod;
    total: number;
    user_uuid: string; // siempre necesario
    order_uuid?: string;
    plan_uuid?: string;
  }) {
    const payment = this.paymentRepository.create({
      method: data.method,
      total: data.total,
      user: { uuid: data.user_uuid } as any,
      reference: `REF-${Math.random()
        .toString(36)
        .substring(2, 9)
        .toUpperCase()}`,
    });

    if (data.order_uuid) payment.order = { uuid: data.order_uuid } as any;
    if (data.plan_uuid) payment.plan = { uuid: data.plan_uuid } as any;

    await this.paymentRepository.save(payment);
    return payment;
  }
}