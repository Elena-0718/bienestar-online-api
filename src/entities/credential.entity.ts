import { Roles } from '../enum/roles.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './users.entity';

@Entity({ name: 'credentials' })
export class Credential {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ unique: true })
  email: string;

  // 🔐 Nunca se retorna
  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.USER,
  })
  role: Roles;

  // ✅ AQUÍ ESTABA EL ERROR
  @Column({
    type: 'text',      // 👈 OBLIGATORIO
    nullable: true,
    select: false,
  })
  refreshToken: string | null;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
resetToken: string; 

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.credential)
  user: User;
}
