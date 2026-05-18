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
import { Plan } from './plan.entity';
import { Progress } from './progress.entity';
import { NutritionPlan } from './nutrition-plan.entity';
import { WorkoutPlan } from './workout.entity';
import { SubscriptionStatus } from '../enum/subscription-status.enum';
import { BillingCycle } from '../enum/billingcycle.enum';


@Entity({ name: 'subscription' })
@Index(['user', 'status'])
export class Subscription {

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => User, (user) => user.subscriptions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @ManyToOne(() => Plan, (plan) => plan.subscriptions, {
    nullable: false,
    onDelete: 'RESTRICT',
    eager: true,
  })
  @JoinColumn({ name: 'plan_uuid' })
  plan: Plan;

  @Column({
    type: 'enum',
    enum: BillingCycle,
    nullable: false,
    default: BillingCycle.MONTHLY,
  })
  billingCycle: BillingCycle;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column({ type: 'date', nullable: false, default: () => 'CURRENT_DATE' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate: Date | null;

  @OneToMany(() => NutritionPlan, (plan) => plan.subscription)
  nutritionPlans: NutritionPlan[];

  @OneToMany(() => WorkoutPlan, (plan) => plan.subscription)
  workoutPlans: WorkoutPlan[];

  @OneToMany(() => Progress, (progress) => progress.subscription)
  progressRecords: Progress[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
