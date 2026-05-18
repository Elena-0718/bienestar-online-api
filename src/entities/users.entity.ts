import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Credential } from './credential.entity';
import { Professional } from './professional.entity';
import { Progress } from './progress.entity';
import { Objective } from '../enum/objective.enum';
import { Sex } from '../enum/sex.enum';
import { Order } from './order.entity';
import { Subscription } from './subscription.entity';
import { Consultation } from './consultation.entity';
import { Cart } from './cart.entity';

@Entity({ name: 'users' })
export class User {
  /* =========================
     IDENTIFICACIÓN
  ========================== */

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  /* =========================
     DATOS PERSONALES
  ========================== */

  @Column({ length: 150 })
  fullName: string;

  @Index()
  @Column({ length: 20, unique: true })
  document: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'enum', enum: Sex })
  sex: Sex;

  @Column({ length: 20 })
  phone: string;

  @Column({
  type: 'varchar',
  length: 255,
  nullable: false,
})
address: string;


  @Index()
  @Column({ length: 150, unique: true })
  email: string;

  /* =========================
     PERFIL DE BIENESTAR
  ========================== */

  @Column({ type: 'enum', enum: Objective })
  objective: Objective;

@Column({ type: 'numeric', precision: 5, scale: 2, nullable: true })
weight: number | null;

@Column({ type: 'int', nullable: true })
height: number | null;



@Column({ type: 'text', nullable: true })
observations: string | null;

@Column({ type: 'varchar', nullable: true })
photoUrl: string | null;



  /* =========================
     ESTADO
  ========================== */

  @Column({ default: true })
  isActive: boolean;

  /* =========================
     AUDITORÍA
  ========================== */

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /* =========================
     RELACIONES
  ========================== */

  /**
   * Credenciales de autenticación
   */
  @OneToOne(() => Credential, (credential) => credential.user, {
    cascade: true,
    eager: false, // 🔐 seguridad
  })
  @JoinColumn()
  credential: Credential;

  /**
   * Órdenes de productos
   */
  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  /**
   * Suscripciones a planes
   */
  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  /**
   * Consultas como paciente
   */
  @OneToMany(() => Consultation, (consultation) => consultation.user)
  consultations: Consultation[];

  /**
   * Consultas como profesional
   */
  @OneToMany(() => Consultation, (consultation) => consultation.professional)
  professionalConsultations: Consultation[];

  /**
   * Perfil profesional
   */
  @OneToOne(() => Professional, (profile) => profile.user)
  professionalProfile: Professional;

  /**
   * Seguimientos del usuario
   */
  @OneToMany(() => Progress, (progress) => progress.user)
  progressRecords: Progress[];

  /**
   * Seguimientos registrados como profesional
   */
  @OneToMany(() => Progress, (progress) => progress.professional)
  registeredProgressRecords: Progress[];

  @OneToMany(() => Cart, (cart) => cart.user)
carts: Cart[];
  

}
