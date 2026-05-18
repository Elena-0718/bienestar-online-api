import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { Order } from './order.entity';
import { Plan } from './plan.entity';
import { User } from './users.entity';

export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
  CARD = 'CARD',
  PAYPAL = 'PAYPAL',
  MERCADOPAGO = 'MERCADOPAGO',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  CANCELED = 'CANCELED',
}

@Entity({ name: 'payments' })
@Index(['status'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total: number;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: false })
  method: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDING })
  status: PaymentStatus;

  /* ============================================================
      RELACIONES (El corazón de la suscripción directa)
  ============================================================ */

  // 1. El usuario que realiza el pago (Indispensable para saber a quién activar)
  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  // 2. Relación con Plan (Para suscripciones directas)
  @ManyToOne(() => Plan, { nullable: true })
  @JoinColumn({ name: 'plan_uuid' })
  plan: Plan;

  // 3. Relación con Orden (Se vuelve opcional para no chocar con planes)
  @OneToOne(() => Order, (order) => order.payment, {
    nullable: true, 
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'order_uuid' })
  order: Order;

  /* ============================================================
      DATOS DE SEGUIMIENTO
  ============================================================ */

  @Column({ type: 'varchar', length: 100, nullable: true })
  reference: string;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}


