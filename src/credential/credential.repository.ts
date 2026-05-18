import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Credential } from '../entities/credential.entity';
import { User } from '../entities/users.entity';
import { ChangeRoleDto } from './dtos/change-role.dto';
import { CartStatus } from 'src/entities/cart.entity';

@Injectable()
export class CredentialRepository {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepo: Repository<Credential>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /* =========================
     BÚSQUEDAS
  ========================== */

  /**
   * 🔐 LOGIN
   * IMPORTANTE:
   * - password tiene select:false
   * - por eso usamos QueryBuilder + addSelect
   */
  async getCredentialByEmailRepository(
  email: string,
): Promise<Credential | null> {
  return this.credentialRepo
    .createQueryBuilder('credential')
    .addSelect('credential.password')
    .where('credential.email = :email', { email })
    .leftJoinAndSelect('credential.user', 'user')
    .leftJoinAndSelect('user.subscriptions', 'subscription')
    .leftJoinAndSelect('subscription.plan', 'plan')
    .getOne();
}


  async getCredentialByIdRepository(
    uuid: string,
  ): Promise<Credential | null> {
    return this.credentialRepo.findOne({
      where: { uuid },
      relations: ['user'],
    });
  }

  // ✅ SOLO ADMIN
  async getAllCredentialsRepository(): Promise<Credential[]> {
    return this.credentialRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  /* =========================
     CREACIÓN
  ========================== */

  async postCreateCredentialRepository(
    data: Partial<Credential>,
  ): Promise<Credential> {
    const credential = this.credentialRepo.create(data);
    return this.credentialRepo.save(credential);
  }

  /* =========================
     ACTUALIZACIONES
  ========================== */

  async patchChangePasswordRepository(
    credential: Credential,
    hashedPassword: string,
  ): Promise<{ message: string }> {
    credential.password = hashedPassword;
    await this.credentialRepo.save(credential);

    return { message: 'Contraseña actualizada correctamente.' };
  }

  async putChangeUserRoleRepository(
    credential: Credential,
    dto: ChangeRoleDto,
  ): Promise<{ message: string }> {
    credential.role = dto.role;
    await this.credentialRepo.save(credential);

    return { message: 'Rol actualizado correctamente.' };
  }

  /* =========================
     ACTIVAR / DESACTIVAR
  ========================== */

  async desactivateCredAndUserProfRepository(
    credential: Credential,
  ): Promise<{ message: string }> {
    credential.isActive = false;
    await this.credentialRepo.save(credential);

    if (credential.user) {
      credential.user.isActive = false;
      await this.userRepo.save(credential.user);

      // 🔄 Cargar carts SOLO cuando se necesitan
      const userWithCarts = await this.userRepo.findOne({
        where: { uuid: credential.user.uuid },
        relations: ['carts'],
      });

      const activeCart = userWithCarts?.carts?.find(
        (cart) => cart.status === CartStatus.ACTIVE,
      );

      if (activeCart) {
        activeCart.status = CartStatus.INACTIVE;
        await this.userRepo.manager.save(activeCart);
      }
    }

    return { message: 'Cuenta desactivada correctamente.' };
  }

  async activateCredAndUserProfRepository(
    credential: Credential,
  ): Promise<{ message: string }> {
    credential.isActive = true;
    await this.credentialRepo.save(credential);

    if (credential.user) {
      credential.user.isActive = true;
      await this.userRepo.save(credential.user);
    }

    return { message: 'Cuenta activada correctamente.' };
  }

  /* =========================
    RECUPERACIÓN (FORGOT PASSWORD)
========================== */

async saveResetTokenRepository(
  credential: Credential,
  token: string
): Promise<void> {
  
  
  (credential as any).resetToken = token; 
  await this.credentialRepo.save(credential);
}

async getCredentialByTokenRepository(token: string): Promise<Credential | null> {
  // ⚠️ IMPORTANTE: Buscar por la columna 'resetToken', NO por 'uuid'
  return this.credentialRepo.findOne({
    where: { resetToken: token } // Cambia 'uuid' por 'resetToken'
  });
}
}
