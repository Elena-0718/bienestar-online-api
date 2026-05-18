import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';



// Swagger
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { CreateProductDto } from './dtos/createProduct.dto';
import { UpdateProductDto } from './dtos/updateProduct.dto';
import { RolesDecorator } from 'src/decoratos/roles.decorator';
import { Roles } from 'src/enum/roles.enum';



@ApiTags('Productos')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ===============================
  // OBTENER TODOS LOS PRODUCTOS
  // ===============================
  @Get('all')
  @ApiOperation({
    summary: 'Obtener todos los productos activos | PÚBLICA',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de productos obtenida correctamente',
  })
  @HttpCode(HttpStatus.OK)
  getAll() {
    return this.productsService.getAllProducts();
  }

  // ===============================
  // OBTENER PRODUCTO POR UUID
  // ===============================
  @Get(':uuid')
  @ApiOperation({
    summary: 'Obtener producto por UUID | PÚBLICA',
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID del producto',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8',
  })
  @ApiResponse({ status: 200, description: 'Producto encontrado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @HttpCode(HttpStatus.OK)
  getById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.productsService.getProductById(uuid);
  }

  // ===============================
  // CREAR PRODUCTO (ADMIN)
  // ===============================
  @Post('create')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @ApiOperation({
    summary: 'Crear nuevo producto | ADMIN',
  })
  @ApiBody({
    description: 'Datos para crear un producto',
    type: CreateProductDto,
  })
  @ApiResponse({ status: 201, description: 'Producto creado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al crear producto' })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  // ===============================
  // ACTUALIZAR PRODUCTO (ADMIN)
  // ===============================
  @Patch('update/:uuid')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @ApiOperation({
    summary: 'Actualizar producto | ADMIN',
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID del producto a actualizar',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8',
  })
  @ApiBody({
    description: 'Datos a actualizar',
    type: UpdateProductDto,
  })
  @ApiResponse({ status: 200, description: 'Producto actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(uuid, dto);
  }

  // ===============================
  // ELIMINAR PRODUCTO (SOFT DELETE)
  // ===============================
  @Delete('delete/:uuid')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @ApiOperation({
    summary: 'Eliminar producto (borrado lógico) | ADMIN',
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID del producto a eliminar',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8',
  })
  @ApiResponse({ status: 200, description: 'Producto eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @HttpCode(HttpStatus.OK)
  delete(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.productsService.deleteProduct(uuid);
  }
}









