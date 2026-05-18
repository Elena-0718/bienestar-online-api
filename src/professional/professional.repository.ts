import { Injectable } from '@nestjs/common';
import { Professional } from 'src/entities/professional.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProfessionalRepository extends Repository<Professional> {
  constructor(private readonly dataSource: DataSource) {
    super(Professional, dataSource.createEntityManager());
  }

  /* =========================================================
      BÚSQUEDAS
  ========================================================= */

  /**
   * Buscar perfil profesional por UUID del usuario
   */
  async findByUserId(userUuid: string): Promise<Professional | null> {
    return this.findOne({
      where: { user: { uuid: userUuid } },
      relations: ['user'],
    });
  }

  /**
   * Buscar profesional por su UUID (admin / interno)
   */
  async findByProfessionalId(uuid: string): Promise<Professional | null> {
    return this.findOne({
      where: { uuid },
      relations: ['user'],
    });
  }

  /**
   * Listar todos los profesionales (Admin)
   */
  async getAllProfessionals(): Promise<Professional[]> {
    return this.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * ✅ Listar profesionales "públicos" (USER)
   * Solo aprobados y activos
   */
  async getPublicProfessionals(): Promise<Professional[]> {
    return this.find({
      where: { isApproved: true, isActive: true } as any,
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * ✅ Obtener profesional "público" por uuid (USER)
   * Solo si está aprobado y activo
   */
  async getPublicProfessionalById(uuid: string): Promise<Professional | null> {
    return this.findOne({
      where: { uuid, isApproved: true, isActive: true } as any,
      relations: ['user'],
    });
  }

  /* =========================================================
      ACCIONES
  ========================================================= */

  /**
   * Crear perfil profesional
   */
  async createProfessional(data: Partial<Professional>): Promise<Professional> {
    const professional = this.create(data);
    return this.save(professional);
  }

  /**
   * Actualizar foto de perfil
   */
  async updatePhoto(uuid: string, photoUrl: string): Promise<void> {
    await this.update(uuid, { photoUrl });
  }

  /**
   * Actualización general
   */
  async updateProfessional(
    uuid: string,
    data: Partial<Professional>,
  ): Promise<Professional> {
    await this.update(uuid, data);
    return this.findByProfessionalId(uuid) as Promise<Professional>;
  }
}