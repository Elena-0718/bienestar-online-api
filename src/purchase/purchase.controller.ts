import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { PurchaseService } from './purchase.service';
import { CreatePurchaseDto } from './Dtos/createPurchase.dto';
import { UpdatePurchaseDto } from './Dtos/updatePurchase.dto';

@Controller('purchase')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  // Ruta para obtener una compra por uuid
  @Get(':uuid')
  getPurchaseById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.purchaseService.getPurchaseByIdService(uuid);
  }
  //Ruta para crear una compra
  @Post('createPurchase')
  createPurchase(@Body() createPurchaseDto: CreatePurchaseDto) {
    return this.purchaseService.createPurchaseService(createPurchaseDto);
  }
  // Ruta para actualizar una compra
    @Put('updatePurchase/:uuid')
  updatePurchase(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updatePurchaseDto: UpdatePurchaseDto,
  ) {
    return this.purchaseService.updatePurchaseService(uuid, updatePurchaseDto);
  }
  // Ruta para eliminar una compra
  @Delete('deletePurchase/:uuid')
  deletePurchase(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.purchaseService.deletePurchaseService(uuid);
  }
}

