import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/users.entity';
import { UpdateUserDto } from './dtos/updateUser.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ===============================
  // BÚSQUEDAS ESPECÍFICAS (PROFESIONAL)
  // ===============================

  /**
   * Obtiene los pacientes filtrados por los planes permitidos.
   * Navega de User -> Subscriptions -> Plan.
   */
  async findPatientsBySpecialtyRepository(plans: string[]): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.subscriptions', 'subscription')
      .innerJoin('subscription.plan', 'plan')
      .innerJoin('user.credential', 'credential') // ✅ JOIN CORRECTO
      .where('plan.type IN (:...plans)', { plans })
      .andWhere('credential.role = :role', { role: 'USER' }) // ✅ CORREGIDO
      .andWhere('user.isActive = :active', { active: true })
      .select([
        'user.uuid',
        'user.fullName',
        'user.email',
        'user.photoUrl',
        'user.document',
        'plan.name',
        'plan.type',
      ])
      .orderBy('user.fullName', 'ASC')
      .getMany();
  }

  // ===============================
  // BÚSQUEDAS GENERALES
  // ===============================

  async getUserByEmailRepository(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['credential', 'professionalProfile'],
    });
  }

  async getUserByDocumentRepository(document: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { document },
      relations: ['credential'],
    });
  }

  async getUserByIdRepository(uuid: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { uuid },
      relations: [
        'credential',
        'professionalProfile',
        'subscriptions',
        'subscriptions.plan',
      ],
    });
  }

  async getAllUsersRepository(): Promise<User[]> {
    return this.userRepository.find({
      order: { fullName: 'ASC' },
      relations: ['credential', 'professionalProfile'],
    });
  }

  // ===============================
  // CREACIÓN
  // ===============================

  async createUserRepository(newUser: Partial<User>): Promise<User> {
    const user = this.userRepository.create(newUser);
    return this.userRepository.save(user);
  }

  // ===============================
  // PERFIL DE USUARIO
  // ===============================

  async getUserProfileRepository(uuid: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { uuid },
      relations: [
        'credential',
        'subscriptions',
        'subscriptions.plan',
        'professionalProfile',
      ],
    });
  }

  async updateUserProfileRepository(
    userExists: User,
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string }> {
    Object.assign(userExists, updateUserDto);

    await this.userRepository.save(userExists);

    return {
      message: 'Perfil de usuario actualizado correctamente.',
    };
  }

  // ===============================
  // ELIMINACIÓN LÓGICA
  // ===============================

  async softDeleteUserRepository(
    user: User,
  ): Promise<{ message: string }> {
    user.isActive = false;

    await this.userRepository.save(user);

    return {
      message: 'Usuario desactivado correctamente.',
    };
  }
}