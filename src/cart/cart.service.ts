import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from 'src/entities/cart.entity';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
  ) {}

  /* =========================
     RUTAS DEL USUARIO
  ========================== */

  // Obtener o crear carrito activo
  async getOrCreateActiveCart(userUuid: string): Promise<Cart> {
    let cart = await this.cartRepository.getCartByUserIdRepository(userUuid);

    if (!cart) {
      cart = await this.cartRepository.createCart(userUuid);
    }

    return cart;
  }

  // Vaciar carrito
  async clearCart(userUuid: string) {
    const cart = await this.cartRepository.getCartByUserIdRepository(userUuid);

    if (!cart) {
      throw new NotFoundException('Carrito activo no encontrado.');
    }

    return await this.cartRepository.clearCart(cart);
  }

  /* =========================
     RUTAS ADMIN
  ========================== */

  async getAllCarts(): Promise<Cart[]> {
    return await this.cartRepository.getAllCarts();
  }

  async getCartByUuid(uuid: string): Promise<Cart> {
    const cart = await this.cartRepository.getCartByUuid(uuid);

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado.');
    }

    return cart;
  }
}

