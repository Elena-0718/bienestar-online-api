import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CartRepository } from 'src/cart/cart.repository';
import { AddProductDto } from './dtos/add-product.dto';
import { CartDetail } from 'src/entities/cartDetail.entity';

@Injectable()
export class CartDetailRepository {
  constructor(
    @InjectRepository(CartDetail)
    private readonly cartDetailRepository: Repository<CartDetail>,
    private readonly cartRepository: CartRepository,
  ) {}

  async postAddProductRepository(
    cartUuid: string,
    addProductDto: AddProductDto,
    unitPrice: number,
  ) {
    // Usamos 'unitPrice' que es el que TypeScript reconoce en tu entidad
    // Si 'cart' da error, lo forzamos como any para que TypeORM lo maneje internamente
    const newDetail = this.cartDetailRepository.create({
      quantity: addProductDto.quantity,
      unitPrice: unitPrice, 
      subtotal: addProductDto.quantity * unitPrice,
      product: { uuid: addProductDto.product_uuid } as any,
    } as any); 

    // Asignamos el cart manualmente si el create falla por tipos
    (newDetail as any).cart = { uuid: cartUuid };

    const savedDetail = await this.cartDetailRepository.save(newDetail);

    await this.cartRepository.updateCartSubtotal(cartUuid);

    return {
      message: 'Producto añadido al carrito correctamente.',
      detail: savedDetail,
    };
  }

  async putUpdateProductQuantityRepository(
    detailUuid: string,
    quantity: number,
  ) {
    const detail = await this.cartDetailRepository.findOne({
      where: { uuid: detailUuid },
      relations: ['cart'],
    });

    if (!detail) return null;

    detail.quantity = quantity;
    // Volvemos a usar 'unitPrice' para el cálculo
    detail.subtotal = quantity * Number((detail as any).unitPrice || 0);

    const saved = await this.cartDetailRepository.save(detail);
    
    // Usamos (detail as any).cart.uuid para evitar el error de propiedad inexistente en el tipado
    const cartUuid = (detail as any).cart?.uuid;
    if (cartUuid) {
        await this.cartRepository.updateCartSubtotal(cartUuid);
    }

    return {
      message: `Cantidad del producto actualizada a ${quantity}.`,
      detail: saved,
    };
  }

  async deleteProductCartRepository(
    detailUuid: string,
    cartUuid: string,
  ) {
    const detail = await this.cartDetailRepository.findOne({
      where: {
        uuid: detailUuid,
        cart: { uuid: cartUuid } as any,
      },
      relations: ['cart'],
    });

    if (!detail) return null;

    await this.cartDetailRepository.remove(detail);
    await this.cartRepository.updateCartSubtotal(cartUuid);

    return {
      message: 'Producto eliminado del carrito correctamente.',
    };
  }
}