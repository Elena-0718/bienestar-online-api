
 
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
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

   @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

   

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



@ManyToOne(() => User, (users) => users.subscription)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne (() => Purchase, (purchase) => purchase.subscription)
  @JoinColumn({ name: 'purchase_id' })
  purchase: Purchase[];
}
