import { Body, Controller, Delete, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { CartDetailService } from './cartDetail.service';
import { AddProductDto } from './dtos/add-product.dto';
import { RolesDecorator } from 'src/decoratos/roles.decorator';
import { Roles } from 'src/enum/roles.enum';
import { UpdateProductQuantityDto } from './dtos/update-cartdetail.dto';

@ApiTags('Detalles del carrito')
@ApiBearerAuth()
@Controller('cart-details') // Se mantiene este para que coincida con tus servicios de Angular
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartDetailController {
  constructor(private readonly cartDetailService: CartDetailService) {}

  @Post('add-product')
  @ApiOperation({ summary: 'Agregar producto al carrito activo | USER' })
  @ApiBody({ type: AddProductDto })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Roles.USER)
  postAddProduct(
    @Req() req,
    @Body() addProductDto: AddProductDto,
  ) {
    return this.cartDetailService.postAddProductService(req, addProductDto);
  }

  @Put('update-product-quantity/:uuid')
  @ApiOperation({ summary: 'Actualizar cantidad de producto | USER' })
  @ApiBody({ type: UpdateProductQuantityDto })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Roles.USER)
  putUpdateProductQuantity(
    @Req() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: UpdateProductQuantityDto,
  ) {
    return this.cartDetailService.putUpdateProductQuantityService(req, uuid, dto);
  }

  @Delete('delete-product/:uuid')
  @ApiOperation({ summary: 'Eliminar producto del carrito | USER' })
  @HttpCode(HttpStatus.OK)
  @RolesDecorator(Roles.USER)
  deleteProductCart(
    @Req() req,
    @Param('uuid', ParseUUIDPipe) uuid: string,
  ) {
    return this.cartDetailService.deleteProductCartService(req, uuid);
  }
}