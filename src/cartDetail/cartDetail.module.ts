// src/cart-detail/cart-detail.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartDetailService } from './cartDetail.service';
import { CartDetailController } from './cartDetail.controller';
import { CartDetailRepository } from './cartDetail.repository';
import { CartDetail } from 'src/entities/cartDetail.entity';
import { CartModule } from 'src/cart/cart.module';
import { ProductsModule } from 'src/products/products.module'; // Importa el módulo completo
import { CategoriesModule } from 'src/categories/categories.module'; // Importa el módulo completo

@Module({
  imports: [
    TypeOrmModule.forFeature([CartDetail]),
    CartModule,
    ProductsModule,   // Esto trae ProductsRepository y sus dependencias
    CategoriesModule, // Esto trae CategoryRepository
  ],
  controllers: [CartDetailController],
  providers: [CartDetailService, CartDetailRepository],
  exports: [CartDetailService, CartDetailRepository]
})
export class CartDetailModule {}