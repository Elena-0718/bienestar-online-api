import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProfessionalRepository } from './professional.repository';
import { CreateProfessionalDto } from './dtos/create-professional.dto';
import { UpdateProfessionalDto } from './dtos/update-professional.dto';
import { ApproveProfessionalDto } from './dtos/approve-professional.dto';
import { AdminCreateProfessionalDto } from './dtos/admin-create-professional.dto';
import { User } from 'src/entities/users.entity';
import { Roles } from 'src/enum/roles.enum';

@Injectable()
export class ProfessionalService {
  constructor(private readonly professionalRepo: ProfessionalRepository) {}

  /* =========================================================
      ACTUALIZAR FOTO DE PERFIL
  ========================================================= */
  async updateProfessionalPhoto(userId: string, photoUrl: string) {
    const professional = await this.professionalRepo.findByUserId(userId);

    if (!professional) {
      throw new NotFoundException(
        'Perfil profesional no encontrado para este usuario',
      );
    }

    professional.photoUrl = photoUrl;
    await this.professionalRepo.save(professional);

    return {
      success: true,
      message: 'Foto de perfil profesional actualizada correctamente',
      photoUrl,
    };
  }

  /* =========================================================
      CREAR PERFIL (PROFESSIONAL)
      userId viene del JWT (NO del body)
  ========================================================= */
  async create(userId: string, dto: CreateProfessionalDto) {
    const existing = await this.professionalRepo.findByUserId(userId);
    if (existing) {
      throw new BadRequestException(
        'El usuario ya cuenta con un perfil profesional registrado',
      );
    }

    const professional = this.professionalRepo.create({
      ...dto,
      user: { uuid: userId } as User,
      isApproved: false,
      isActive: true,
    });

    return await this.professionalRepo.save(professional);
  }

  /* =========================================================
      ✅ CREAR PERFIL (ADMIN)
      Admin envía userUuid en el body
  ========================================================= */
  async createByAdmin(dto: AdminCreateProfessionalDto) {
    const existing = await this.professionalRepo.findByUserId(dto.userUuid);
    if (existing) {
      throw new BadRequestException(
        'El usuario ya cuenta con un perfil profesional registrado',
      );
    }

    const professional = this.professionalRepo.create({
      type: dto.type,
      professionalTitle: dto.professionalTitle,
      licenseNumber: dto.licenseNumber ?? null,
      yearsOfExperience: dto.yearsOfExperience ?? 0,
      bio: dto.bio ?? null,
      photoUrl: dto.photoUrl ?? null,
      isApproved: false,
      isActive: true,
      user: { uuid: dto.userUuid } as User,
    });

    return await this.professionalRepo.save(professional);
  }

  /* =========================================================
      ✅ LISTAR (Admin ve todo | User ve solo aprobados + activos)
  ========================================================= */
  async findAll(role?: string) {
    if (role === Roles.ADMIN) {
      return this.professionalRepo.getAllProfessionals();
    }
    return this.professionalRepo.getPublicProfessionals();
  }

  /* =========================================================
      ✅ OBTENER UNO (Admin ve todo | User solo si aprobado + activo)
  ========================================================= */
  async findOne(uuid: string, role?: string) {
    const professional =
      role === Roles.ADMIN
        ? await this.professionalRepo.findByProfessionalId(uuid)
        : await this.professionalRepo.getPublicProfessionalById(uuid);

    if (!professional) {
      throw new NotFoundException(
        `Profesional con UUID ${uuid} no encontrado`,
      );
    }

    return professional;
  }

  /* =========================================================
      ACTUALIZAR DATOS
  ========================================================= */
  async update(uuid: string, dto: UpdateProfessionalDto) {
    const professional = await this.findOne(uuid, Roles.ADMIN); // interno
    Object.assign(professional, dto);
    return await this.professionalRepo.save(professional);
  }

  /* =========================================================
      APROBAR / DESAPROBAR (ADMIN)
  ========================================================= */
  async approve(uuid: string, dto: ApproveProfessionalDto) {
    const professional = await this.findOne(uuid, Roles.ADMIN); // interno
    professional.isApproved = dto.isApproved;
    return await this.professionalRepo.save(professional);
  }

  /* =========================================================
      DESACTIVAR (ADMIN)
  ========================================================= */
  async deactivate(uuid: string) {
    const professional = await this.findOne(uuid, Roles.ADMIN); // interno
    professional.isActive = false;
    return await this.professionalRepo.save(professional);
  }

  /* =========================================================
      ELIMINAR (ADMIN)
  ========================================================= */
  async remove(uuid: string) {
    const professional = await this.findOne(uuid, Roles.ADMIN); // interno
    await this.professionalRepo.remove(professional);

    return {
      success: true,
      message: 'Perfil profesional eliminado permanentemente',
    };
  }
}