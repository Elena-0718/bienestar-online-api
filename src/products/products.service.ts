import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dtos/createProduct.dto';
import { UpdateProductDto } from './dtos/updateProduct.dto';


@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
  ) {}

  // ===============================
  // OBTENER PRODUCTOS
  // ===============================

  async getAllProducts() {
    return await this.productsRepository.getAllProductsRepository();
  }

  async getProductById(uuid: string) {
    const product =
      await this.productsRepository.getProductByIdRepository(uuid);

    if (!product) {
      throw new NotFoundException(
        `Producto con ID ${uuid} no encontrado`,
      );
    }

    return product;
  }

  // ===============================
  // CREAR PRODUCTO
  // ===============================

  async createProduct(dto: CreateProductDto) {
    try {
      return await this.productsRepository.createProductRepository(dto);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Error al crear el producto',
      );
    }
  }

  // ===============================
  // ACTUALIZAR PRODUCTO
  // ===============================

  async updateProduct(uuid: string, dto: UpdateProductDto) {
    const product =
      await this.productsRepository.getProductByIdRepository(uuid);

    if (!product) {
      throw new NotFoundException(
        `Producto con ID ${uuid} no encontrado`,
      );
    }

    try {
      return await this.productsRepository.updateProductRepository(
        product,
        dto,
      );
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Error al actualizar el producto',
      );
    }
  }

  // ===============================
  // ELIMINAR PRODUCTO (SOFT DELETE)
  // ===============================

  async deleteProduct(uuid: string) {
    const product =
      await this.productsRepository.getProductByIdRepository(uuid);

    if (!product) {
      throw new NotFoundException(
        `Producto con ID ${uuid} no encontrado`,
      );
    }

    try {
      return await this.productsRepository.deleteProductRepository(product);
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Error al eliminar el producto',
      );
    }
  }
}
