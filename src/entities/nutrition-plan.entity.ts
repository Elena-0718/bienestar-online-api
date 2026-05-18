import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';

import { Subscription } from './subscription.entity';
import { Professional } from './professional.entity';

@Entity({ name: 'nutrition_plans' })
@Index(['subscription'])
@Index(['professional'])
export class NutritionPlan {

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => Subscription, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subscription_uuid' })
  subscription: Subscription;

  @ManyToOne(() => Professional, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'professional_uuid' })
  professional: Professional;

  @Column({
    type: 'varchar',
    length: 100,
  })
  objective: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes?: string;

  /* 🔥 FIX IMPORTANTE */
  @Column({
    type: 'jsonb',
    comment: 'Plan nutricional semanal estructurado por días y comidas',
  })
  weeklyPlan: Record<string, any>; // ✅ NO WeeklyPlan

  @Column({
    type: 'boolean',
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}




/* =========================
   TIPOS AUXILIARES
========================== */

/**
 * Permite planes flexibles por días
 * Ej: monday, tuesday, customDay1, etc.
 */
export type WeeklyPlan = {
  [day: string]: DayMeals;
};

export type DayMeals = {
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
  snacks?: Meal[];
};

export type Meal = {
  name: string;
  description?: string;
  calories?: number;
  portions?: string;
};
