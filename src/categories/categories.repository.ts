import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';


@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // ============================
  // OBTENER TODAS LAS CATEGORÍAS
  // ============================
  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find({
      order: { name: 'ASC' },
    });
  }

  // ============================
  // OBTENER CATEGORÍA POR UUID
  // ============================
  async findById(uuid: string): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { uuid },
    });
  }

  // ============================
  // OBTENER CATEGORÍA POR NOMBRE
  // ============================
  async findByName(name: string): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { name },
    });
  }

  // ============================
  // CREAR CATEGORÍA
  // ============================
  async createCategory(data: Partial<Category>): Promise<Category> {
    const category = this.categoryRepository.create(data);
    return this.categoryRepository.save(category);
  }

  // ============================
  // ACTUALIZAR CATEGORÍA
  // ============================
  async updateCategory(
    category: Category,
    data: Partial<Category>,
  ): Promise<Category> {
    Object.assign(category, data);
    return this.categoryRepository.save(category);
  }

  // ============================
  // ELIMINAR CATEGORÍA (hard delete)
  // 👉 luego puedes migrar a soft delete
  // ============================
  async deleteCategory(uuid: string): Promise<void> {
    await this.categoryRepository.delete(uuid);
  }
}
