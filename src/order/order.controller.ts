import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { OrderService } from './order.service';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { RolesDecorator } from 'src/decorators/roles.decorator';
import { Roles } from 'src/enum/roles.enum';
import { UpdateOrderDto } from './dtos/update-order.dto';
import { CreateOrderDto } from './dtos/create-order.dto'; // Importación añadida


@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /* =========================
      ADMIN
  ========================== */

  @Get()
  @RolesDecorator(Roles.ADMIN)
  @ApiOperation({ summary: 'Obtener todas las órdenes (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Listado de órdenes' })
  getAllOrders() {
    return this.orderService.getAllOrdersService();
  }

  @Patch(':uuid/status')
  @RolesDecorator(Roles.ADMIN)
  @ApiOperation({ summary: 'Actualizar estado de una orden (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  updateOrderStatus(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateOrderDto,
  ) {
    return this.orderService.putOrderStatusService(uuid, dto);
  }

  @Delete(':uuid')
  @RolesDecorator(Roles.ADMIN)
  @ApiOperation({ summary: 'Cancelar una orden (ADMIN)' })
  @ApiResponse({ status: 200, description: 'Orden cancelada' })
  deleteOrder(@Param('uuid') uuid: string) {
    return this.orderService.deleteOrderService(uuid);
  }

  /* =========================
      USER
  ========================== */

  @Post()
  @ApiOperation({ summary: 'Crear orden desde el carrito activo' })
  @ApiResponse({ status: 201, description: 'Orden creada' })
  // 🔧 Ajustado para recibir el DTO con los datos de envío
  createOrder(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.orderService.postCreateOrderService(req, dto);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Historial de órdenes del usuario' })
  @ApiResponse({ status: 200, description: 'Historial de órdenes' })
  getMyOrders(@Req() req: any) {
    return this.orderService.getOrdersHistoryService(req);
  }

  @Patch(':uuid/cancel')
  @ApiOperation({ summary: 'Cancelar una orden del usuario' })
  @ApiResponse({ status: 200, description: 'Orden cancelada' })
  cancelOrder(
    @Req() req: any,
    @Param('uuid') uuid: string,
  ) {
    return this.orderService.putCancelOrderService(req, uuid);
  }

  /* =========================
      SHARED
  ========================== */

  @Get(':uuid')
  @ApiOperation({
    summary: 'Obtener detalle de una orden (ADMIN o dueño)',
  })
  @ApiResponse({ status: 200, description: 'Detalle de la orden' })
  getOrderById(
    @Req() req: any,
    @Param('uuid') uuid: string,
  ) {
    return this.orderService.getOrderByIdService(uuid, req);
  }
}