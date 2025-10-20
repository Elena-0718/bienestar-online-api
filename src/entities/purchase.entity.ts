import { StatusOrder } from 'src/enum/statusOrder.enum';
import {
  Column,
  Entity,
  JoinColumn,

  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './users.entity';
import { OrderDetail } from './order_detail.entity';
import { Pay } from './pay.entity';
import { Suscription } from './subscription.entity';
import { join } from 'path';

@Entity({ name: 'purchase' })
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  addressDelivery: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateCreated: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  deliveryDate: Date;

  @Column({
    type: 'enum',
    enum: StatusOrder,
    default: StatusOrder.CREATED,
  })
  statusOrder: StatusOrder;

  @ManyToOne(() => User, (users) => users.purchase)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderDetail, (order_detail) => order_detail.purchase)
  order_detail: OrderDetail[];
    
    @ManyToOne(() => Pay, (pay) => pay.purchase)
    @JoinColumn({ name: 'pay_id' })
    pay: Pay[];
  
    @OneToMany (() => Suscription, (subscription) => subscription.purchase)
    @JoinColumn({ name: 'subscription_id' })
    subscription: Suscription[];

}