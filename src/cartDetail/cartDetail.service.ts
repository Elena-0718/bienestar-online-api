import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { CartRepository } from 'src/cart/cart.repository';
import { ProductsRepository } from 'src/products/products.repository';
import { CartDetailRepository } from './cartDetail.repository';
import { AddProductDto } from './dtos/add-product.dto';
import { UpdateProductQuantityDto } from './dtos/update-cartdetail.dto';


@Injectable()
export class CartDetailService {
  constructor(
    private readonly cartDetailRepository: CartDetailRepository,
    private readonly cartRepository: CartRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  // =========================
  // AGREGAR PRODUCTO
  // =========================
  async postAddProductService(
    req: any,
    addProductDto: AddProductDto,
  ) {
    // AJUSTE: Buscamos el UUID en diferentes propiedades comunes del token para evitar el null en DB
    const userUuid = req.user.user_uuid || req.user.uuid || req.user.id;

    if (!userUuid) {
      throw new BadRequestException('No se pudo identificar al usuario desde el token.');
    }

    // Intentamos buscar el carrito activo
    let cart = await this.cartRepository.getCartByUserIdRepository(userUuid);

    // AJUSTE: Si no existe el carrito, lo creamos automáticamente usando el método de tu Repo
    if (!cart) {
      cart = await this.cartRepository.createCart(userUuid);
    }

    // Validación extra para evitar el error "cart is possibly null" en TS
    if (!cart) {
      throw new BadRequestException('No se pudo inicializar el carrito activo.');
    }

    const product = await this.productsRepository.getProductByIdRepository(
      addProductDto.product_uuid,
    );

    if (!product) {
      throw new NotFoundException('Producto no encontrado.');
    }

    // Validar stock
    if (addProductDto.quantity > product.stock) {
      throw new BadRequestException(
        `Solo hay ${product.stock} unidades disponibles de ${product.name}.`,
      );
    }

    const unitPrice = Number(product.price);

    // Verificar si ya existe en el carrito
    const existingDetail = cart.cartDetails?.find(
      (d) => d.product?.uuid === addProductDto.product_uuid,
    );

    if (existingDetail) {
      const newQuantity = existingDetail.quantity + addProductDto.quantity;

      if (newQuantity > product.stock) {
        throw new BadRequestException(
          `No puedes agregar ${addProductDto.quantity} unidades más. Solo hay ${product.stock} disponibles.`,
        );
      }

      return this.cartDetailRepository.putUpdateProductQuantityRepository(
        existingDetail.uuid,
        newQuantity,
      );
    }

    // Crear nuevo detalle
    return this.cartDetailRepository.postAddProductRepository(
      cart.uuid,
      addProductDto,
      unitPrice,
    );
  }

  // =========================
  // ACTUALIZAR CANTIDAD
  // =========================
  async putUpdateProductQuantityService(
    req: any,
    uuid: string,
    dto: UpdateProductQuantityDto,
  ) {
    const userUuid = req.user.user_uuid || req.user.uuid || req.user.id;

    const cart = await this.cartRepository.getCartByUserIdRepository(userUuid);

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado.');
    }

    const detail = cart.cartDetails?.find(
      (d) => d.uuid === uuid,
    );

    if (!detail) {
      throw new NotFoundException(
        'Producto no encontrado en el carrito.',
      );
    }

    const product = await this.productsRepository.getProductByIdRepository(
      detail.product.uuid,
    );

    if (!product) {
      throw new NotFoundException('Producto no encontrado.');
    }

    if (dto.quantity > product.stock) {
      throw new BadRequestException(
        `Solo hay ${product.stock} unidades disponibles de ${product.name}.`,
      );
    }

    return this.cartDetailRepository.putUpdateProductQuantityRepository(
      uuid,
      dto.quantity,
    );
  }

  // =========================
  // ELIMINAR PRODUCTO
  // =========================
  async deleteProductCartService(
    req: any,
    uuid: string,
  ) {
    const userUuid = req.user.user_uuid || req.user.uuid || req.user.id;

    const cart = await this.cartRepository.getCartByUserIdRepository(userUuid);

    if (!cart) {
      throw new NotFoundException('Carrito no encontrado.');
    }

    const result = await this.cartDetailRepository.deleteProductCartRepository(
      uuid,
      cart.uuid,
    );

    if (!result) {
      throw new NotFoundException(
        'Producto no encontrado en el carrito.',
      );
    }

    return result;
  }
}