import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserRepository } from './user.repository';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { User } from '../entities/users.entity';
import { ProfessionalType } from '../entities/professional.entity';
import { PlanType } from '../entities/plan.entity';

@Injectable()
export class UserService {

  constructor(
    private readonly userRepository: UserRepository,
  ) {}

  // ===============================
  // 🔥 MÉTODO PARA PROFESIONALES (MIS PACIENTES)
  // ===============================

  async getPatientsByProfessionalSpecialtyService(
    req: { user: { userId: string } }
  ): Promise<User[]> {

    const professionalUuid = req.user.userId;

    const professional =
      await this.userRepository.getUserProfileRepository(professionalUuid);

    if (!professional || !professional.professionalProfile) {
      throw new NotFoundException(
        'Perfil profesional no encontrado o tipo no asignado.',
      );
    }

    const professionalType =
      professional.professionalProfile.type;

    let allowedPlans: string[] = [];

    if (professionalType === ProfessionalType.NUTRITIONIST) {
      allowedPlans = [
        PlanType.NUTRITION,
        PlanType.BIENESTAR,
      ];
    }

    if (professionalType === ProfessionalType.SPORTS_DOCTOR) {
      allowedPlans = [
        PlanType.FITNESS,
        PlanType.BIENESTAR,
      ];
    }

    if (allowedPlans.length === 0) {
      return [];
    }

    return this.userRepository.findPatientsBySpecialtyRepository(
      allowedPlans,
    );
  }

  // ===============================
  // CONSULTATIONS
  // ===============================

  async findByUuid(userUuid: string): Promise<User> {
    const user =
      await this.userRepository.getUserByIdRepository(userUuid);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return user;
  }

  // ===============================
  // ADMIN
  // ===============================

  async getAllUsersService(): Promise<User[]> {
    return this.userRepository.getAllUsersRepository();
  }

  async getUserByIdService(userUuid: string): Promise<User> {
    const user =
      await this.userRepository.getUserByIdRepository(userUuid);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return user;
  }

  // ===============================
  // PERFIL PROPIO
  // ===============================

  async getUserProfileService(req: {
    user: { userId: string };
  }): Promise<any> {

    const userUuid = req.user.userId;

    const user =
      await this.userRepository.getUserProfileRepository(userUuid);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    if (!user.isActive) {
      throw new ConflictException(
        'Este perfil se encuentra desactivado.',
      );
    }

    const activeSubscription = user.subscriptions?.find(
      (sub) => sub.status === 'ACTIVE'
    );

    return {
      ...user,
      planType: activeSubscription
        ? activeSubscription.plan.type
        : 'FREE',
    };
  }

  async updateUserProfileService(
    req: { user: { userId: string } },
    updateUserDto: UpdateUserDto,
  ): Promise<{ message: string }> {

    const userUuid = req.user.userId;

    const user =
      await this.userRepository.getUserByIdRepository(userUuid);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    if (!user.isActive) {
      throw new ConflictException(
        'Este usuario se encuentra desactivado.',
      );
    }

    return this.userRepository.updateUserProfileRepository(
      user,
      updateUserDto,
    );
  }

  // ===============================
  // DESACTIVAR USUARIO
  // ===============================

  async deactivateUserService(
    userUuid: string,
  ): Promise<{ message: string }> {

    const user =
      await this.userRepository.getUserByIdRepository(userUuid);

    if (!user) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return this.userRepository.softDeleteUserRepository(user);
  }
}