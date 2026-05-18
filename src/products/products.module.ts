import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { Product } from 'src/entities/products.entity';
import { Category } from 'src/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category, 
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
  exports: [ProductsService, ProductsRepository], // solo exportamos el servicio y el repositorio
})
export class ProductsModule {}


