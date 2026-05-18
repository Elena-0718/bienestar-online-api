import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Order } from './order.entity';

export enum DeliveryStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

@Entity({ name: 'deliveries' })
@Index(['order'], { unique: true })
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'enum',
    enum: DeliveryStatus,
    default: DeliveryStatus.PENDING,
  })
  status: DeliveryStatus;

  @Column({ type: 'timestamp', nullable: true })
  shippedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 20 })
  phoneNumber: string;

  @OneToOne(() => Order, (order) => order.delivery, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_uuid' })
  order: Order;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
