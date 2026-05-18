import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  
} from 'typeorm';

import { Category } from './category.entity';
import { OrderDetail } from './order_detail.entity';
import { CartDetail } from './cartDetail.entity';


@Entity({ name: 'products' })
@Index(['name'])
@Index(['isActive'])
export class Product {

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  /* 🖼️ IMÁGENES */
  @Column({
    type: 'text',
    array: true,
    nullable: true,
  })
  images: string[];

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_uuid' })
  category: Category;

  @OneToMany(() => CartDetail, (cartDetail) => cartDetail.product)
  cartDetails: CartDetail[];

  @OneToMany(() => OrderDetail, (orderDetail) => orderDetail.product)
  orderDetails: OrderDetail[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}