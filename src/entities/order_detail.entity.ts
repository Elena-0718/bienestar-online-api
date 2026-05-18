import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { Order } from './order.entity';
import { Product } from './products.entity';

@Entity({ name: 'order_detail' })
@Index(['order'])
@Index(['product'])
export class OrderDetail {
  /* =========================
     IDENTIFICACIÓN
  ========================== */

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  /* =========================
     CANTIDADES Y PRECIOS
  ========================== */

  @Column({
    type: 'int',
    nullable: false,
    comment: 'Cantidad del producto comprado',
  })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    comment: 'Precio unitario del producto al momento de la compra',
  })
  unitPrice: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
    comment: 'Subtotal = quantity * unitPrice',
  })
  subtotal: number;

  /* =========================
     RELACIONES
  ========================== */

  /**
   * Orden a la que pertenece el detalle
   */
  @ManyToOne(() => Order, (order) => order.orderDetails, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_uuid' })
  order: Order;

  /**
   * Producto comprado
   * No se elimina para preservar histórico
   */
  @ManyToOne(() => Product, (product) => product.orderDetails, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_uuid' })
  product: Product;

  /* =========================
     AUDITORÍA
  ========================== */

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
