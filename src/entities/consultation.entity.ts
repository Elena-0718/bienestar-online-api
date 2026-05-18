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

import { User } from './users.entity';
import { Subscription } from './subscription.entity';

/* =========================
   ENUMS
========================== */

export enum ConsultationType {
  NUTRITION = 'NUTRITION',
  FITNESS = 'FITNESS',
}

export enum ConsultationStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  NO_SHOW = 'NO_SHOW',
}

/* =========================
   ENTITY CONSULTATION
========================== */

@Entity({ name: 'consultations' })
@Index(['professional', 'scheduledAt'], { unique: true }) // ⛔ evita doble cita al mismo profesional
@Index(['subscription', 'scheduledAt'])
export class Consultation {
  /* =========================
     IDENTIFICACIÓN
  ========================== */

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  /* =========================
     RELACIONES CLAVE
  ========================== */

  /**
   * Usuario que recibe la consulta
   */
  @ManyToOne(() => User, (user) => user.consultations, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  /**
   * Profesional que atiende la consulta
   */
  @ManyToOne(() => User, (user) => user.professionalConsultations, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'professional_uuid' })
  professional: User;

  /**
   * Suscripción activa desde la cual se agenda la consulta
   */
  @ManyToOne(() => Subscription, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subscription_uuid' })
  subscription: Subscription;

  /* =========================
     DATOS DE LA CONSULTA
  ========================== */

  @Column({
    type: 'enum',
    enum: ConsultationType,
    comment: 'Tipo de consulta según el plan',
  })
  type: ConsultationType;

  @Column({
    type: 'timestamp',
    comment: 'Fecha y hora programada de la consulta',
  })
  scheduledAt: Date;

  @Column({
  type: 'int',
  default: 20, 
  comment: 'Duración de la consulta en minutos',
})
durationMinutes: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: 'Link de videollamada o lugar de la consulta',
  })
  meetingUrl?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: 'Notas u observaciones del profesional',
  })
  professionalNotes?: string;

  @Column({
    type: 'enum',
    enum: ConsultationStatus,
    default: ConsultationStatus.SCHEDULED,
    comment: 'Estado actual de la consulta',
  })
  status: ConsultationStatus;

  /* =========================
     FECHAS DE CONTROL
  ========================== */

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha de finalización de la consulta',
  })
  completedAt?: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha de cancelación de la consulta',
  })
  canceledAt?: Date;

  /* =========================
     CONTROL
  ========================== */

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Indica si el registro está activo',
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
