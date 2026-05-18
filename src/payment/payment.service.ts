import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreatePaymentDto } from './dtos/create-payment.dto';
import { PaymentRepository } from './payment.repository';
import { OrderRepository } from 'src/order/order.repository';
import { SubscriptionRepository } from 'src/subscription/subscription.repository';
import { UpdatePaymentDto } from './dtos/update-payment.dto';
import { PaymentStatus } from 'src/entities/payment.entity';
import { BillingCycle } from 'src/enum/billingcycle.enum';
import { DeliveryRepository } from 'src/delivery/delivery.repository';

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly orderRepository: OrderRepository,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly deliveryRepository: DeliveryRepository,
  ) {}

  getAllPaymentsService() {
    return this.paymentRepository.getAllPaymentsRepository();
  }

  /**
   * CONFIRMAR PAGO (Admin)
   * - Confirma pago
   * - Si es plan: reemplaza suscripción activa
   * - Si es orden: marca orden como PAID + crea delivery automáticamente
   */
  async putConfirmPaymentService(uuid: string) {
    // 1) Traer pago con relations: order, order.user, order.delivery, plan, user
    const payment = await this.paymentRepository.getPaymentByIdRepository(uuid);

    if (!payment) throw new NotFoundException('Pago no encontrado.');
    if (payment.status === PaymentStatus.CONFIRMED) {
      throw new ConflictException('El pago ya fue confirmado.');
    }

    // 2) Confirmar pago (y si trae order, tu repo ya marca PAID ahí)
    const result = await this.paymentRepository.putConfirmPaymentRepository(payment);

    // 3) PAGO DE ORDEN => asegurar PAID + crear delivery (solo si no existe)
    if (payment.order) {
      // Blindaje: asegurar orden en PAID (si el repo ya lo hace, no pasa nada)
      await this.orderRepository.putOrderPreparingRepository(payment.order);

      // ✅ Idempotencia real: verificar delivery
      const hasDeliveryInRelation = !!payment.order.delivery;

      if (!hasDeliveryInRelation) {
        // ✅ Recomendado: validar que existan datos de envío en la orden
        // (porque delivery debe ir a la dirección confirmada en checkout)
        const address = payment.order.shippingAddress;
        const phone = payment.order.shippingPhone;

        if (!address || !phone) {
          throw new BadRequestException(
            'La orden no tiene dirección/teléfono de envío confirmados.',
          );
        }

        // ✅ Crear delivery usando dirección de la ORDEN (no del perfil del usuario)
        // Para que funcione, ajusta DeliveryRepository.createDelivery(order)
        // para tomar order.shippingAddress / order.shippingPhone
        await this.deliveryRepository.createDelivery(payment.order);

        console.log(`Sistema: Delivery creado para la orden ${payment.order.uuid}`);
      } else {
        console.log(
          `Sistema: La orden ${payment.order.uuid} ya tiene delivery, se omite creación.`,
        );
      }
    }

    // 4) PAGO DE PLAN => reemplazar suscripción activa
    if (payment.plan && payment.user) {
      await this.subscriptionRepository.cancelAllActiveByUser(payment.user.uuid);

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(startDate.getMonth() + 1);

      await this.subscriptionRepository.createSubscription({
        user: payment.user,
        plan: payment.plan,
        billingCycle: BillingCycle.MONTHLY,
        startDate,
        endDate,
      });

      console.log(
        `Sistema: Suscripción activada para el usuario ${payment.user.uuid} (Plan: ${payment.plan.uuid})`,
      );
    }

    return result;
  }

  /**
   * REGISTRAR PAGO (User)
   * Soporta tanto productos (Order) como suscripciones directas (Plan)
   */
  async postRegisterPaymentService(req: any, dto: CreatePaymentDto) {
    const userUuid = req.user.userId || req.user.uuid;

    if (!userUuid) {
      throw new BadRequestException(
        'No se pudo identificar al usuario desde el token.',
      );
    }

    // CASO A: Pago de Orden (Tienda)
    if (dto.order_uuid) {
      const order = await this.orderRepository.getOrderByIdRepository(dto.order_uuid);

      if (!order) throw new NotFoundException('La orden no existe.');
      if (order.user.uuid !== userUuid) {
        throw new BadRequestException('No autorizado para pagar esta orden.');
      }

      const existingPayment =
        await this.paymentRepository.getPaymentByOrderRepository(dto.order_uuid);

      if (existingPayment) {
        throw new ConflictException('La orden ya tiene un pago.');
      }

      return this.paymentRepository.postRegisterPaymentRepository({
        method: dto.method,
        total: Number(order.total),
        user_uuid: userUuid,
        order_uuid: dto.order_uuid,
      });
    }

    // CASO B: Pago de Plan (Suscripción)
    if (dto.plan_uuid && dto.total) {
      return this.paymentRepository.postRegisterPaymentRepository({
        method: dto.method,
        total: Number(dto.total),
        user_uuid: userUuid,
        plan_uuid: dto.plan_uuid,
      });
    }

    throw new BadRequestException(
      'Faltan datos para procesar el pago (order_uuid o plan_uuid).',
    );
  }

  // --- MÉTODOS DE APOYO ---

  async putUpdatePaymentStatusService(uuid: string, dto: UpdatePaymentDto) {
    const payment = await this.paymentRepository.getPaymentByIdRepository(uuid);
    if (!payment) throw new NotFoundException('Pago no encontrado.');
    return this.paymentRepository.putUpdatePaymentStatusRepository(payment, dto);
  }

  async deletePaymentService(uuid: string) {
    const payment = await this.paymentRepository.getPaymentByIdRepository(uuid);
    if (!payment) throw new NotFoundException('Pago no encontrado.');
    return this.paymentRepository.deletePaymentRepository(payment);
  }

  async getPaymentByIdService(uuid: string) {
    const payment = await this.paymentRepository.getPaymentByIdRepository(uuid);
    if (!payment) throw new NotFoundException('Pago no encontrado.');
    return payment;
  }
}