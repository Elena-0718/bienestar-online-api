import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ProductRepository } from "./products.repository";
import { CreateProductDto } from "./Dtos/createProduct.dto";

@Injectable()
export class ProductService {
  
  constructor(
    private readonly productRepository: ProductRepository,
  ) {}

  //  Servicio para obtener un producto por UUID
  async getProductByIdService(uuid: string) {
    const result = await this.productRepository.getProductByIdRepository(uuid);

    if (!result.success) {
      throw new NotFoundException(result.message);
    }

    return {
      message: "Producto encontrado correctamente",
      product: result.data,
    };
  }

  // Servicio para Crear producto
  async createProductService(createProductDto: CreateProductDto) {
    const result = await this.productRepository.createProductRepository(createProductDto);

    return {
      message: result.message,
      product: result.data,
    };
  }
async updateProductService(uuid: string, updateProductDto: CreateProductDto) {
  const result = await this.productRepository.updateProductRepository(uuid, updateProductDto);

  if (!result.success) {
    throw new NotFoundException(result.message);
  }

  return {
    message: result.message,
    data: result.data,
  };
}

// Servicio para eliminar un producto
async deleteProductService(uuid: string) {
  const result = await this.productRepository.deleteProductRepository(uuid);

  if (!result.success) {
    throw new NotFoundException(result.message);
  }

  return {
    message: result.message,
    data: result.data,
  };
}

}