import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

import { Subscription } from './subscription.entity';

/* =========================
   ENUM TIPO DE PLAN
========================== */
export enum PlanType {
  FREE = 'FREE',
  NUTRITION = 'NUTRITION',
  FITNESS = 'FITNESS',
  BIENESTAR = 'BIENESTAR',
}

@Entity({ name: 'plans' })
@Index(['type'], { unique: true })
@Index(['isActive'])
export class Plan {
  /* =========================
     IDENTIFICACIÓN
  ========================== */

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  /* =========================
     DATOS BÁSICOS
  ========================== */

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    comment: 'Nombre comercial del plan',
  })
  name: string;

  @Column({
    type: 'enum',
    enum: PlanType,
    nullable: false,
    comment: 'Tipo de plan (define reglas de negocio)',
  })
  type: PlanType;

  /* =========================
     CONFIGURACIÓN DEL PLAN
  ========================== */

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    comment: 'Precio del plan (0 = gratuito)',
  })
  price: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Cantidad de consultas nutricionales incluidas',
  })
  nutritionConsultations: number;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Cantidad de consultas fitness incluidas',
  })
  fitnessConsultations: number;

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Acceso a biblioteca de contenidos',
  })
  hasLibraryAccess: boolean;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Indica si el plan está disponible para contratación',
  })
  isActive: boolean;

  /* =========================
     RELACIONES
  ========================== */

  /**
   * Suscripciones asociadas a este plan
   */
  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];

  /* =========================
     AUDITORÍA
  ========================== */

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
