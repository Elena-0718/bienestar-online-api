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


@Entity({ name: 'workout_plans' })
@Index(['subscription', 'isActive'])
export class WorkoutPlan {
  /* =========================
     IDENTIFICACIÓN
  ========================== */

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  /* =========================
     RELACIONES
  ========================== */

  /**
   * Suscripción del usuario
   * Define el contexto del plan
   */
  @ManyToOne(() => Subscription, (subscription) => subscription.workoutPlans, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subscription_uuid' })
  subscription: Subscription;

  /**
   * Profesional que crea el plan
   * (entrenador / especialista)
   */
  @ManyToOne(() => Professional, {
    nullable: false,
    onDelete: 'RESTRICT',
    eager: true,
  })
  @JoinColumn({ name: 'professional_uuid' })
  professional: Professional;

  /* =========================
     DATOS GENERALES
  ========================== */

  @Column({
    type: 'varchar',
    length: 120,
    comment: 'Objetivo del plan de entrenamiento',
  })
  objective: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Indicaciones generales del profesional',
  })
  notes?: string;

  /* =========================
     PLAN DE ENTRENAMIENTO
  ========================== */

  @Column({
    type: 'jsonb',
    comment: 'Rutina semanal estructurada por días',
  })
  weeklyRoutine: WeeklyWorkoutPlan;

  /* =========================
     CONTROL
  ========================== */

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Indica si el plan está vigente',
  })
  isActive: boolean;

  /* =========================
     AUDITORÍA
  ========================== */

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}


/* =========================
   TIPOS AUXILIARES
========================== */

export type WeeklyWorkoutPlan = {
  monday?: WorkoutDay;
  tuesday?: WorkoutDay;
  wednesday?: WorkoutDay;
  thursday?: WorkoutDay;
  friday?: WorkoutDay;
  saturday?: WorkoutDay;
  sunday?: WorkoutDay;
};

export type WorkoutDay = {
  focus: string; // Ej: "Tren superior"
  warmUp?: string;
  exercises: Exercise[];
  coolDown?: string;
};

export type Exercise = {
  name: string;              // Ej: "Flexiones"
  description?: string;     // Cómo hacerlo
  sets: number;              // Rondas
  reps?: number;             // Repeticiones
  time?: string;             // Tiempo si es isométrico
  rest: string;              // Descanso entre sets
};
