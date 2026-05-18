import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './users.entity';
import { CartDetail } from './cartDetail.entity';




/* =========================
   ENUM ESTADO DEL CARRITO
========================== */
export enum CartStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE= 'INACTIVE',
}

@Entity({ name: 'cart' })
@Index(['user', 'status']) // 🔥 búsqueda rápida carrito activo
export class Cart {
  /* =========================
     IDENTIFICACIÓN
  ========================== */

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  /* =========================
     TOTALES
  ========================== */

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Subtotal sin impuestos ni descuentos',
  })
  subtotal: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Impuestos',
  })
  tax: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Descuentos aplicados',
  })
  discount: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Total final del carrito',
  })
  total: number;

  @Column({
    length: 3,
    default: 'COP',
    comment: 'Moneda ISO',
  })
  currency: string;

  /* =========================
     ESTADO
  ========================== */

  @Column({
    type: 'enum',
    enum: CartStatus,
    default: CartStatus.ACTIVE,
  })
  status: CartStatus;

  /* =========================
     RELACIONES
  ========================== */

  /**
   * Usuario dueño del carrito
   */
  @ManyToOne(() => User, (user) => user.carts, {
    nullable: false,
  })
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  /**
   * Productos del carrito
   */
  @OneToMany(
    () => CartDetail,
    (detail) => detail.cart,
    {
      cascade: ['insert', 'update'], // 🔐 NO remove
    },
  )
  cartDetails: CartDetail[];

  /* =========================
     AUDITORÍA
  ========================== */

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;
}
