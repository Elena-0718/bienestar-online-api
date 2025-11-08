import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Products } from "src/entities/products.entity"; 
import { CreateProductDto } from "./Dtos/createProduct.dto";

@Injectable()
export class ProductRepository {
    productRepository: any;
  
  constructor(
    @InjectRepository(Products)
    private readonly productDataBase: Repository<Products>,
  ) {}

  //  Método para obtener un producto por su UUID
  async getProductByIdRepository(uuid: string) {
    const productExisting = await this.productDataBase.findOne({
      where: { uuid },
    });

    if (!productExisting) {
      console.log(`Producto con UUID ${uuid} no encontrado.`);
      return {
        success: false,
        message: `El producto con UUID ${uuid} no existe.`,
      };
    }

    console.log(` Producto encontrado: ${productExisting.name}`);
    return {
      success: true,
      data: productExisting,
    };
  }

  // Metodo para Crear producto
   async createProductRepository(createProductDto: CreateProductDto) {
    console.log('Creando nuevo producto...');

    const newProduct = this.productDataBase.create({
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      stock: createProductDto.stock,
    });

    const savedProduct = await this.productDataBase.save(newProduct);

    console.log(`Producto creado: ${savedProduct.uuid}`);

    return {
      success: true,
      message: "Producto registrado correctamente.",
      data: savedProduct,
    };
  }

  // Metodo para actualizar
 async updateProductRepository(uuid: string, updateProductDto: CreateProductDto) {
  const productExisting = await this.productDataBase.findOne({ where: { uuid } });

  if (!productExisting) {
    return {
      success: false,
      message: `El producto con UUID ${uuid} no existe.`,
    };
  }

  productExisting.name = updateProductDto.name;
  productExisting.description = updateProductDto.description;
  productExisting.price = updateProductDto.price;
  productExisting.stock = updateProductDto.stock;

  const updatedProduct = await this.productDataBase.save(productExisting);

  console.log(`Producto actualizado: ${updatedProduct.uuid}`);

  return {
    success: true,
    message: `Producto actualizado correctamente.`,
    data: updatedProduct,
  };
}

// Método para eliminar producto
async deleteProductRepository(uuid: string) {
  const product = await this.productDataBase.findOne({ where: { uuid } });

  if (!product) {
    return {
      success: false,
      message: `El producto con UUID ${uuid} no existe.`,
    };
  }

  await this.productDataBase.remove(product);

  return {
    success: true,
    message: `Producto eliminado correctamente.`,
    data: product,
  };
}

}
