import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { ProductService } from "./products.service";
import { CreateProductDto } from "./Dtos/createProduct.dto";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // Ruta obtener un producto por su UUID
  @Get("getProductById/:uuid")
  getProductById(@Param("uuid", ParseUUIDPipe) uuid: string) {
    console.log(` Buscando producto con UUID: ${uuid}`);
    return this.productService.getProductByIdService(uuid);
  }
// Ruta para Crear producto
  @Post("createProduct")
  createProduct(@Body() createProductDto: CreateProductDto) {
    console.log("Creando nuevo producto...");
    return this.productService.createProductService(createProductDto);
  }
// Ruta para actualizar un producto
@Put('updateProduct/:uuid')
  async updateProduct(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateProductDto: CreateProductDto,
  ) {
    return this.productService.updateProductService(uuid, updateProductDto);
  }
 @Delete('/deleteProduct/:uuid')
  async deleteProduct(@Param('uuid') uuid: string) {
    return await this.productService.deleteProductService(uuid);
  }
  
}








