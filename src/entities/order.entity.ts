import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';

import { User } from './users.entity';
import { OrderDetail } from './order_detail.entity';
import { Payment } from './payment.entity';
import { Delivery } from './delivery.entity';

export enum OrderStatus {
  CREATED = 'CREATED',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

@Entity({ name: 'orders' })
@Index(['user'])
@Index(['status'])
@Index(['createdAt'])
export class Order {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  /* =========================
      MONTOS
  ========================== */

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  iva: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  deliveryCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  total: number;

  /* =========================
      DATOS DE ENVÍO CONFIRMADOS (Añadido)
  ========================== */

  @Column({ 
    type: 'varchar', 
    length: 255, 
    nullable: true,
    comment: 'Dirección de entrega confirmada por el usuario para esta orden' 
  })
  shippingAddress: string;

  @Column({ 
    type: 'varchar', 
    length: 50, 
    nullable: true, 
    comment: 'Teléfono de contacto confirmado para esta orden'
  })
  shippingPhone: string;

  /* =========================
      ESTADO
  ========================== */

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.CREATED,
  })
  status: OrderStatus;

  /* =========================
      RELACIONES
  ========================== */

  @ManyToOne(() => User, (user) => user.orders, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @OneToMany(() => OrderDetail, (detail) => detail.order, {
    cascade: ['insert'],
  })
  orderDetails: OrderDetail[];

  @OneToOne(() => Payment, (payment) => payment.order, {
    nullable: true, // Cambiado a true para permitir creación inicial antes del pago
    cascade: ['insert'],
  })
  payment: Payment;

  @OneToOne(() => Delivery, (delivery) => delivery.order, {
    nullable: true, // Cambiado a true porque el delivery se crea tras confirmar pago
    cascade: ['insert'],
  })
  delivery: Delivery;

  /* =========================
      AUDITORÍA
  ========================== */

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}