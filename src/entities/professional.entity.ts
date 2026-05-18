import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './users.entity';

/* =========================
   ENUM TIPO PROFESIONAL
========================== */
export enum ProfessionalType {
  NUTRITIONIST = 'NUTRITIONIST',
  SPORTS_DOCTOR = 'SPORTS_DOCTOR',
}

/* =========================
   ENTITY PROFESSIONAL PROFILE
========================== */
@Entity({ name: 'professional_profiles' })
export class Professional {
  /* =========================
     IDENTIFICACIÓN
  ========================== */

  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  /* =========================
     RELACIÓN CON USUARIO
  ========================== */

  @OneToOne(() => User, (user) => user.professionalProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  /* =========================
     DATOS PROFESIONALES
  ========================== */

  @Column({
    type: 'enum',
    enum: ProfessionalType,
    nullable: false,
    comment: 'Tipo de profesional de la salud',
  })
  type: ProfessionalType;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: false,
    comment: 'Título profesional',
  })
  professionalTitle: string;

 @Column({
  type: 'varchar',
  length: 50,
  nullable: true,
})
licenseNumber: string | null;

  @Column({
    type: 'int',
    default: 0,
    comment: 'Años de experiencia profesional',
  })
  yearsOfExperience: number;

 @Column({
  type: 'text',
  nullable: true,
})
bio: string | null;

@Column({
  type: 'varchar',
  length: 255,
  nullable: true, // Siempre déjalo nullable por si el pro no sube foto al inicio
  comment: 'URL de la foto de perfil del profesional',
})
photoUrl: string | null;

  /* =========================
     CONTROL Y ESTADO
  ========================== */

  @Column({
    type: 'boolean',
    default: false,
    comment: 'Indica si el perfil fue aprobado por el sistema',
  })
  isApproved: boolean;

  @Column({
    type: 'boolean',
    default: true,
    comment: 'Indica si el profesional está activo',
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
