import { PaymentStatus } from 'src/enum/paymentstatus.enum';
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
@Entity({ name: 'pay' })
export class Pay {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  date: Date;
  @Column({
      type: 'enum',
      enum: PaymentStatus,
      default: PaymentStatus.PENDING,
    })
paymentstatus: PaymentStatus;

@ManyToOne(() => User, (users) => users.pay)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany (() => Purchase, (purchase) => purchase.pay)
  @JoinColumn({ name: 'purchase_id' })
  purchase: Purchase[];
}

