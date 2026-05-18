import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Cart, CartStatus } from 'src/entities/cart.entity';
import { User } from 'src/entities/users.entity';
import { CartDetail } from 'src/entities/cartDetail.entity';


@Injectable()
export class CartRepository {
  
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,

    @InjectRepository(CartDetail)
    private readonly cartDetailRepository: Repository<CartDetail>,
  ) {}

  /* =========================
     OBTENER CARRITO ACTIVO POR USUARIO
     (USADO POR CART Y CART DETAIL)
  ========================== */
  async getCartByUserIdRepository(userUuid: string): Promise<Cart | null> {
    return await this.cartRepository.findOne({
      where: {
        user: { uuid: userUuid },
        status: CartStatus.ACTIVE,
      },
      relations: [
        'cartDetails',
        'cartDetails.product',
      ],
    });
  }

  /* =========================
     CREAR NUEVO CARRITO
  ========================== */
  async createCart(userUuid: string): Promise<Cart> {
    // AJUSTE: Creamos el objeto asegurando que user_uuid se pueble a través de la relación
    const newCart = this.cartRepository.create({
      status: CartStatus.ACTIVE,
      subtotal: 0,
      tax: 0,
      discount: 0,
      total: 0,
      currency: 'COP',
      // Vinculamos el usuario. TypeORM mapeará esto a 'user_uuid' automáticamente
      user: { uuid: userUuid } as User,
    });

    return await this.cartRepository.save(newCart);
  }

  /* =========================
     RECALCULAR SUBTOTAL
  ========================== */
  async updateCartSubtotal(cartUuid: string): Promise<number> {
    const items = await this.cartDetailRepository.find({
      where: { cart: { uuid: cartUuid } },
    });

    const subtotal = items.reduce(
      (acc, item) => acc + Number(item.subtotal || 0),
      0,
    );

    await this.cartRepository.update(
      { uuid: cartUuid },
      { subtotal },
    );

    return subtotal;
  }

  /* =========================
     COMPLETAR / CERRAR CARRITO
  ========================== */
  async completeCart(cart: Cart): Promise<Cart> {
    cart.status = CartStatus.INACTIVE;
    cart.closedAt = new Date();

    return await this.cartRepository.save(cart);
  }

  /* =========================
     VACIAR CARRITO
  ========================== */
  async clearCart(cart: Cart) {
    await this.cartDetailRepository.delete({
      cart: { uuid: cart.uuid },
    });

    cart.cartDetails = [];
    cart.subtotal = 0;
    cart.tax = 0;
    cart.discount = 0;
    cart.total = 0;

    await this.cartRepository.save(cart);

    return {
      message: 'Carrito vacío correctamente.',
      cart,
    };
  }

  /* =========================
     ADMIN
  ========================== */
  async getAllCarts(): Promise<Cart[]> {
    return await this.cartRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async getCartByUuid(uuid: string): Promise<Cart | null> {
    return await this.cartRepository.findOne({
      where: { uuid },
      relations: [
        'user',
        'cartDetails',
        'cartDetails.product',
      ],
    });
  }
}