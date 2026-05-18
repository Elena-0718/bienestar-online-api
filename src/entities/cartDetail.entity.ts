import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Unique,
  Index,
} from 'typeorm';

import { Cart } from './cart.entity';
import { Product } from './products.entity';

@Entity({ name: 'cart_detail' })
@Unique(['cart', 'product'])
@Index(['cart'])
@Index(['product'])
export class CartDetail {
  /* =========================
     IDENTIFICACIÓN
  ========================== */

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  /* =========================
     CANTIDAD Y PRECIOS
  ========================== */

  @Column({ type: 'int' })
  quantity: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'Precio unitario al agregar al carrito',
  })
  unitPrice: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    comment: 'quantity * unitPrice',
  })
  subtotal: number;

  /* =========================
     RELACIONES
  ========================== */

  @ManyToOne(() => Cart, (cart) => cart.cartDetails, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cart_uuid' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartDetails, {
    nullable: false,
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

