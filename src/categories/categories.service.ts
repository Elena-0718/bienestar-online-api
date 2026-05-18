import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { Category } from 'src/entities/category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';


@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  // ============================
  // OBTENER TODAS LAS CATEGORÍAS
  // ============================
  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.findAll();
  }

  // ============================
  // OBTENER CATEGORÍA POR UUID
  // ============================
  async findOne(uuid: string): Promise<Category> {
    const category = await this.categoriesRepository.findById(uuid);

    if (!category) {
      throw new NotFoundException(
        `No se encontró ninguna categoría con el ID ${uuid}.`,
      );
    }

    return category;
  }

  // ============================
  // CREAR CATEGORÍA
  // ============================
  async create(dto: CreateCategoryDto): Promise<Category> {
    // Validar nombre duplicado
    const existing =
      await this.categoriesRepository.findByName(dto.name);

    if (existing) {
      throw new ConflictException(
        'Ya existe una categoría con ese nombre.',
      );
    }

    try {
      return await this.categoriesRepository.createCategory(dto);
    } catch (error) {
      throw new BadRequestException(
        'Ocurrió un error al crear la categoría.',
      );
    }
  }

  // ============================
  // ACTUALIZAR CATEGORÍA
  // ============================
  async update(
    uuid: string,
    dto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(uuid);

    // Si cambia el nombre, validar duplicado
    if (dto.name && dto.name !== category.name) {
      const existing =
        await this.categoriesRepository.findByName(dto.name);

      if (existing) {
        throw new ConflictException(
          'Ya existe una categoría con ese nombre.',
        );
      }
    }

    try {
      return await this.categoriesRepository.updateCategory(
        category,
        dto,
      );
    } catch (error) {
      throw new BadRequestException(
        'Ocurrió un error al actualizar la categoría.',
      );
    }
  }

  // ============================
  // ELIMINAR CATEGORÍA
  // ============================
  async delete(uuid: string): Promise<{ message: string }> {
    await this.findOne(uuid); // valida existencia

    await this.categoriesRepository.deleteCategory(uuid);

    return {
      message: 'Categoría eliminada correctamente.',
    };
  }
}

