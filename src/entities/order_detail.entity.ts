import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Purchase } from './purchase.entity';
import { Products } from './products.entity';

@Entity({ name: 'order_detail' })
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'int',
    nullable: false,
  })
  cant: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  subTotal: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  iva: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  discount: number;

  

  @ManyToOne(() => Purchase, (purchase) => purchase.order_detail)
  @JoinColumn({ name: 'order_id' })
  purchase: Purchase;

  @ManyToOne(() => Products, (products) => products.order_detail)
  @JoinColumn({ name: 'product_id' })
  products: Products;
    order: any;
}