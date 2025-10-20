
import { SubscriptionPeriod } from 'src/enum/subscriptionperiod.enum'; 
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,

  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';   

import { Purchase } from './purchase.entity';
import { User } from './users.entity';

@Entity({ name: 'subscription' })
export class Suscription {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;

  @Column({
    type: 'boolean',
    default: true,
    })
    isactive: boolean;

@Column({
    type: 'enum',
    enum: SubscriptionPeriod,
    default: SubscriptionPeriod.MONTHLY,
  })
  subscriptionperiod:SubscriptionPeriod;

@ManyToOne(() => User, (users) => users.subscription)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne (() => Purchase, (purchase) => purchase.subscription)
  @JoinColumn({ name: 'purchase_id' })
  purchase: Purchase[];
}
