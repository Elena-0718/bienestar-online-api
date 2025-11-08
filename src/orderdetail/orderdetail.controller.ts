import { Controller, Get, Post, Put, Delete, Param, Body, ParseUUIDPipe } from "@nestjs/common";
import { OrderDetailService } from "./orderdetail.service";
import { CreateOrdersDto } from "./Dtos/createOrders.dto";

@Controller('orderdetail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

//Ruta para obtener una oprden por uuid

  @Get(':uuid')
  getOrderDetail(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.orderDetailService.getOrderDetailByIdService(uuid);
  }
//Rota para crear una orden

  @Post('create')
  createOrderDetail(@Body() createOrdersDto: CreateOrdersDto) {
    return this.orderDetailService.createOrderDetailService(createOrdersDto);
  }

//Ruta para actualizar una orden

  @Put('update/:uuid')
  updateOrderDetail(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() updateOrdersDto: CreateOrdersDto,
  ) {
    return this.orderDetailService.updateOrderDetailService(uuid, updateOrdersDto);
  }

//Ruta para eliminar una orden

  @Delete('delete/:uuid')
  deleteOrderDetail(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.orderDetailService.deleteOrderDetailService(uuid);
  }
}

