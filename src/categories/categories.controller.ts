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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { Roles } from 'src/enum/roles.enum';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { RolesDecorator } from 'src/decorators/roles.decorator';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@ApiTags('Categorías')
@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
  ) {}

  // ============================
  // OBTENER TODAS LAS CATEGORÍAS
  // ============================
  @Get()
  @ApiOperation({
    summary: 'Obtener todas las categorías | Público',
    description:
      'Permite obtener la lista completa de categorías disponibles en Bienestar Online.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías obtenida correctamente.',
  })
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.categoriesService.findAll();
  }

  // ============================
  // OBTENER CATEGORÍA POR UUID
  // ============================
  @Get(':uuid')
  @ApiOperation({
    summary: 'Obtener categoría por UUID | Público',
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID de la categoría',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría encontrada.',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada.',
  })
  @HttpCode(HttpStatus.OK)
  findOne(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.categoriesService.findOne(uuid);
  }

  // ============================
  // CREAR CATEGORÍA (ADMIN)
  // ============================
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @ApiOperation({
    summary: 'Crear categoría | ADMIN',
  })
  @ApiBody({ type: CreateCategoryDto })
  @ApiResponse({
    status: 201,
    description: 'Categoría creada correctamente.',
  })
  @ApiResponse({
    status: 409,
    description: 'La categoría ya existe.',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  // ============================
  // ACTUALIZAR CATEGORÍA (ADMIN)
  // ============================
  @Patch(':uuid')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @ApiOperation({
    summary: 'Actualizar categoría | ADMIN',
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID de la categoría a actualizar',
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Categoría actualizada correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada.',
  })
  @HttpCode(HttpStatus.OK)
  update(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(uuid, dto);
  }

  // ============================
  // ELIMINAR CATEGORÍA (ADMIN)
  // ============================
  @Delete(':uuid')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @ApiOperation({
    summary: 'Eliminar categoría | ADMIN',
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID de la categoría a eliminar',
  })
  @ApiResponse({
    status: 200,
    description: 'Categoría eliminada correctamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada.',
  })
  @HttpCode(HttpStatus.OK)
  delete(
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.categoriesService.delete(uuid);
  }
}
