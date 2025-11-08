import { Injectable, NotFoundException } from "@nestjs/common";
import { OrderDetailRepository } from "./orderdetail.repository";
import { CreateOrdersDto } from "./Dtos/createOrders.dto";

@Injectable()
export class OrderDetailService {
  constructor(private readonly orderDetailRepository: OrderDetailRepository) {}
 
//Servicio para obtener una orden por uuid

  async getOrderDetailByIdService(uuid: string) {
    const result = await this.orderDetailRepository.getOrderDetailByIdRepository(uuid);
    if (!result.success) throw new NotFoundException(result.message);
    return result;
  }

 // Servicio para crear una orden

  async createOrderDetailService(createOrdersDto: CreateOrdersDto) {
    return await this.orderDetailRepository.createOrderDetailRepository(createOrdersDto);
  }

//Servicio para actualizar una orden

  async updateOrderDetailService(uuid: string, updateOrdersDto: CreateOrdersDto) {
    const result = await this.orderDetailRepository.updateOrderDetailRepository(uuid, updateOrdersDto);
    if (!result.success) throw new NotFoundException(result.message);
    return result;
  }

//Servicio para eliminar una orden

  async deleteOrderDetailService(uuid: string) {
    const result = await this.orderDetailRepository.deleteOrderDetailRepository(uuid);
    if (!result.success) throw new NotFoundException(result.message);
    return result;
  }
}

