import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CredentialRepository } from './credential.repository';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ChangeRoleDto } from './dtos/change-role.dto';
import { Roles } from 'src/enum/roles.enum';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { CredentialMailerService } from './mailer.service';
import { randomBytes } from 'crypto';

@Injectable()
export class CredentialService {
  constructor(
    private readonly credentialRepository: CredentialRepository,
    private readonly mailerService: CredentialMailerService,
  ) {}

  /* =========================
     CONSULTAS
  ========================== */

  async getAllCredentialsService() {
    return this.credentialRepository.getAllCredentialsRepository();
  }

  async getCredentialByIdService(uuid: string) {
    const credential =
      await this.credentialRepository.getCredentialByIdRepository(uuid);

    if (!credential) {
      throw new NotFoundException('Credencial no encontrada.');
    }

    return credential;
  }

  async getCredentialByEmailService(email: string) {
    const credential =
      await this.credentialRepository.getCredentialByEmailRepository(email);

    if (!credential) {
      throw new NotFoundException('Usuario no encontrado.');
    }

    return credential;
  }

  /* =========================
     CAMBIAR CONTRASEÑA
  ========================== */

  async patchChangePasswordService(
    uuid: string,
    dto: ChangePasswordDto,
    userLogged: any,
  ) {
    const credential =
      await this.credentialRepository.getCredentialByIdRepository(uuid);

    if (!credential) {
      throw new NotFoundException('Credencial no encontrada.');
    }

    if (!credential.isActive) {
      throw new ConflictException('La cuenta está desactivada.');
    }

    if (userLogged.credential_uuid !== uuid) {
      throw new UnauthorizedException('No autorizado.');
    }

    const isValidPassword = await bcrypt.compare(
      dto.currentPassword,
      credential.password,
    );

    if (!isValidPassword) {
      throw new BadRequestException('Contraseña actual incorrecta.');
    }

    if (dto.newPassword !== dto.confirmNewPassword) {
      throw new BadRequestException('Las contraseñas no coinciden.');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    return this.credentialRepository.patchChangePasswordRepository(
      credential,
      hashedPassword,
    );
  }

  /* =========================
     DESACTIVAR CUENTA
  ========================== */

  async deleteCredentialService(uuid: string, userLogged: any) {
    const credential =
      await this.credentialRepository.getCredentialByIdRepository(uuid);

    if (!credential) {
      throw new NotFoundException('Credencial no encontrada.');
    }

    if (
      userLogged.role !== Roles.ADMIN &&
      userLogged.credential_uuid !== uuid
    ) {
      throw new UnauthorizedException('No autorizado.');
    }

    return this.credentialRepository.desactivateCredAndUserProfRepository(
      credential,
    );
  }

  /* =========================
     ACTIVAR CUENTA
  ========================== */

  async activateCredentialService(uuid: string) {
    const credential =
      await this.credentialRepository.getCredentialByIdRepository(uuid);

    if (!credential) {
      throw new NotFoundException('Credencial no encontrada.');
    }

    return this.credentialRepository.activateCredAndUserProfRepository(
      credential,
    );
  }

  /* =========================
     CAMBIAR ROL (ADMIN)
  ========================== */

  async putChangeUserRole(uuid: string, dto: ChangeRoleDto) {
    const credential =
      await this.credentialRepository.getCredentialByIdRepository(uuid);

    if (!credential) {
      throw new NotFoundException('Credencial no encontrada.');
    }

    if (credential.role === dto.role) {
      throw new ConflictException('El usuario ya tiene ese rol.');
    }

    return this.credentialRepository.putChangeUserRoleRepository(
      credential,
      dto,
    );
  }

  /* =========================
    RECUPERACIÓN DE CONTRASEÑA
========================== */

async forgotPasswordService(dto: ForgotPasswordDto) {
  const { email } = dto;
  
  // 1. Verificar si el usuario existe
  const credential = await this.credentialRepository.getCredentialByEmailRepository(email);

  if (!credential) {
    // Seguridad: No revelamos si el correo existe o no
    return { message: 'Si el correo está registrado, recibirás un enlace en breve.' };
  }

  // 2. Generar un Token seguro y único
  const resetToken = randomBytes(20).toString('hex');

  // 3. Guardar el token en la base de datos
  // Asegúrate de tener este método en tu CredentialRepository
  await this.credentialRepository.saveResetTokenRepository(credential, resetToken);

  // 4. Enviar el correo electrónico real
  try {
    await this.mailerService.sendResetPasswordEmail(email, resetToken);
    return { message: 'Instrucciones enviadas. Revisa tu bandeja de entrada.' };
  } catch (error) {
    console.error('Error enviando mail:', error);
    throw new InternalServerErrorException('No se pudo enviar el correo.');
  }
}
async resetPasswordWithTokenService(dto: { token: string, newPassword: string }) {
  const credential = await this.credentialRepository.getCredentialByTokenRepository(dto.token);

  if (!credential) {
    throw new BadRequestException('El enlace ha expirado o es inválido.');
  }

  // Encriptamos la nueva contraseña con bcrypt
  const hashedPassword = await bcrypt.hash(dto.newPassword, 10);
  
  // Guardamos y limpiamos el token para que no se use dos veces
  return this.credentialRepository.patchChangePasswordRepository(credential, hashedPassword);
}

}
