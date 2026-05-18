import {
  Controller,
  Get,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { CartService } from './cart.service';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { Roles } from 'src/enum/roles.enum';
import { RolesDecorator } from 'src/decoratos/roles.decorator';


@ApiTags('Carrito')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /* =========================
     RUTAS DEL USUARIO
  ========================== */

  // Obtener carrito activo (si no existe, lo crea)
  @Get()
  @ApiOperation({
    summary: 'Obtener carrito activo | USER',
    description:
      'Obtiene el carrito activo del usuario autenticado. Si no existe, se crea automáticamente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Carrito activo obtenido correctamente.',
  })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Roles.USER)
  getActiveCart(@Req() req) {
    const userUuid = req.user.user_uuid; // viene del JWT
    return this.cartService.getOrCreateActiveCart(userUuid);
  }

  // Vaciar carrito activo
  @Delete('empty')
  @ApiOperation({
    summary: 'Vaciar carrito activo | USER',
    description: 'Elimina todos los productos del carrito activo del usuario.',
  })
  @ApiResponse({
    status: 200,
    description: 'Carrito vaciado exitosamente.',
  })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Roles.USER)
  clearCart(@Req() req) {
    const userUuid = req.user.user_uuid;
    return this.cartService.clearCart(userUuid);
  }

  /* =========================
     RUTAS ADMIN
  ========================== */

  // Listar todos los carritos
  @Get('all')
  @ApiOperation({
    summary: 'Listar todos los carritos | ADMIN',
    description:
      'Permite al administrador obtener todos los carritos del sistema.',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de carritos obtenido correctamente.',
  })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Roles.ADMIN)
  getAllCarts() {
    return this.cartService.getAllCarts();
  }

  // Obtener carrito por UUID
  @Get(':uuid')
  @ApiOperation({
    summary: 'Obtener carrito por UUID | ADMIN',
    description:
      'Permite al administrador consultar un carrito específico por su UUID.',
  })
  @ApiParam({
    name: 'uuid',
    description: 'UUID del carrito',
    example: 'c31a34b7-8b9a-4e71-a29a-8c26f675a1c8',
  })
  @ApiResponse({
    status: 200,
    description: 'Carrito encontrado correctamente.',
  })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Roles.ADMIN)
  getCartByUuid(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.cartService.getCartByUuid(uuid);
  }
}
