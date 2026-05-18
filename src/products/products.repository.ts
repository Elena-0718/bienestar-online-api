// src/products/products.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from 'src/entities/products.entity';
import { Category } from 'src/entities/category.entity';
import { CreateProductDto } from './dtos/createProduct.dto';
import { UpdateProductDto } from './dtos/updateProduct.dto';

@Injectable()
export class ProductsRepository {
  getProductById(product_uuid: string) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Product)
    private readonly productsDB: Repository<Product>,

    @InjectRepository(Category)
    private readonly categoriesDB: Repository<Category>,
  ) {}

  // ===============================
  // OBTENER PRODUCTOS
  // ===============================

  async getAllProductsRepository(): Promise<Product[]> {
    return this.productsDB.find({
      where: { isActive: true },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }

  async getProductByIdRepository(uuid: string): Promise<Product | null> {
    return this.productsDB.findOne({
      where: { uuid, isActive: true },
      relations: ['category'],
    });
  }

  async getProductByNameRepository(name: string): Promise<Product | null> {
    return this.productsDB.findOne({
      where: { name, isActive: true },
    });
  }

  // ===============================
  // CREAR PRODUCTO
  // ===============================

  async createProductRepository(
    dto: CreateProductDto,
  ): Promise<Product> {
    // Validar categoría
    const category = await this.categoriesDB.findOne({
      where: { uuid: dto.categoryUuid },
    });

    if (!category) {
      throw new Error('La categoría no existe.');
    }

    // Validar producto duplicado
    const existingProduct = await this.getProductByNameRepository(dto.name);

    if (existingProduct) {
      throw new Error('Ya existe un producto con ese nombre.');
    }

    const newProduct = this.productsDB.create({
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock,
      category,
    });

    return await this.productsDB.save(newProduct);
  }

  // ===============================
  // ACTUALIZAR PRODUCTO
  // ===============================

  async updateProductRepository(
    product: Product,
    dto: UpdateProductDto,
  ): Promise<Product> {
    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined)
      product.description = dto.description;
    if (dto.price !== undefined) product.price = dto.price;
    if (dto.stock !== undefined) product.stock = dto.stock;

    if (dto.categoryUuid) {
      const category = await this.categoriesDB.findOne({
        where: { uuid: dto.categoryUuid },
      });

      if (!category) {
        throw new Error('La categoría no existe.');
      }

      product.category = category;
    }

    return await this.productsDB.save(product);
  }

  // ===============================
  // BORRADO LÓGICO
  // ===============================

  async deleteProductRepository(product: Product) {
    product.isActive = false;
    await this.productsDB.save(product);

    return {
      message: `El producto "${product.name}" fue desactivado correctamente.`,
    };
  }
}
