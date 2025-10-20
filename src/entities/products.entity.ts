import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { OrderDetail } from './order_detail.entity';

@Entity({ name: 'products' })
export class Products {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
    nullable: false,
  })
  name: string;

 
  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

   @Column({
    type: 'decimal',
    scale: 2,
    nullable: false,
  })
  price: number;


  @Column({
    type: 'int',
    nullable: false,
  })
  stock: number;

  @Column({
    type: 'boolean',
  })
  isDisponible: true;
    

  @OneToMany(() => OrderDetail, (order_detail) => order_detail.products)
  order_detail: OrderDetail[];
}