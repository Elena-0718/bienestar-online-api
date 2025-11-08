import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from '@nestjs/common';
import { PayService } from './pay.service';
import { CreatePayDto } from './Dtos/createPay.dto';

@Controller('pay')
export class PayController {
  constructor(private readonly payService: PayService) {}

  // Ruta para obtener pago por UUID
  @Get('/getPayById/:uuid')
  async getPayById(@Param('uuid', ParseUUIDPipe) uuid: string) {
    console.log(
      `Ejecutando GET /pay/getPayById/${uuid} a las ${new Date().toLocaleString()}`,
    );
    return this.payService.getPayByIdService(uuid);
  }
// Ruta para crear un nuevo pago
  @Post("/createPay")
  async createPay(@Body() createPayDto: CreatePayDto) {
    console.log(
      `Creando pago... Fecha: ${createPayDto.date} — ${new Date().toLocaleString()}`
    );
    return this.payService.createPayService(createPayDto);
  }

  // Ruta para Actualizar pago
  @Put("/updatePay/:uuid")
  async updatePay(
    @Param("uuid", ParseUUIDPipe) uuid: string,
    @Body() updatePayDto: CreatePayDto,
  ) {
    console.log(`Actualizando pago ${uuid} — ${new Date().toLocaleString()}`);
    return this.payService.updatePayService(uuid, updatePayDto);
  }

  // Ruta para eliminar un Pago por UUID
  @Delete('delete/:uuid')
  deletePay(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.payService.deletePayService(uuid);
  }

}
