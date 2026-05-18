import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';

import { User } from './users.entity';
import { Subscription } from './subscription.entity';

@Entity({ name: 'progress' })
@Index(['subscription', 'recordDate'], { unique: true }) // ⛔ un registro por día y suscripción
export class Progress {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  /* =========================
     RELACIONES CLAVE
  ========================== */

  /**
   * Suscripción a la que pertenece el progreso
   */
  @ManyToOne(() => Subscription, (subscription) => subscription.progressRecords, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subscription_uuid' })
  subscription: Subscription;

  /**
   * Usuario (redundante para consultas rápidas)
   */
  @ManyToOne(() => User, (user) => user.progressRecords, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  /**
   * Profesional que registra el progreso
   */
  @ManyToOne(() => User, (user) => user.registeredProgressRecords, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'professional_uuid' })
  professional?: User;

  /* =========================
     DATOS DE CONTROL
  ========================== */

  @Column({ type: 'date', nullable: false })
  recordDate: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  /* =========================
     MÉTRICAS CORPORALES
  ========================== */

  @Column({ type: 'float', nullable: true })
  weightKg?: number;

  @Column({ type: 'float', nullable: true })
  bodyFatPercentage?: number;

  @Column({ type: 'float', nullable: true })
  muscleMassKg?: number;

  @Column({ type: 'float', nullable: true })
  waistCm?: number;

  @Column({ type: 'float', nullable: true })
  hipCm?: number;

  @Column({ type: 'float', nullable: true })
  chestCm?: number;

  /* =========================
     HÁBITOS / RENDIMIENTO
  ========================== */

  @Column({ type: 'varchar', length: 50, nullable: true })
  energyLevel?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  adherenceLevel?: string;

  /* =========================
     OBSERVACIONES
  ========================== */

  @Column({ type: 'text', nullable: true })
  professionalNotes?: string;

  @Column({ type: 'text', nullable: true })
  userNotes?: string;

  /* =========================
     AUDITORÍA
  ========================== */

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}


