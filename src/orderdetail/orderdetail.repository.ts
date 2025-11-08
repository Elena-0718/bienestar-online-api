import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderDetail } from 'src/entities/order_detail.entity';
import { CreateOrdersDto } from "./Dtos/createOrders.dto";

@Injectable()
export class OrderDetailRepository {
  constructor(
    @InjectRepository(OrderDetail)
    private readonly orderDetailDatabase: Repository<OrderDetail>,
  ) {}

  //  Metodo para Obtener una orden por UUID
  async getOrderDetailByIdRepository(uuid: string) {
    const orderExisting = await this.orderDetailDatabase.findOne({ where: { uuid } });

    if (!orderExisting) {
      return {
        success: false,
        message: `El detalle de orden con UUID ${uuid} no existe.`,
      };
    }

    return {
      success: true,
      data: orderExisting,
    };
  }

  // Metodo para Crear una orden
  async createOrderDetailRepository(createOrdersDto: CreateOrdersDto) {
    const newOrderDetail = this.orderDetailDatabase.create({
      cant: createOrdersDto.cant,
      subTotal: createOrdersDto.subTotal,
      iva: createOrdersDto.iva,
      discount: createOrdersDto.discount,
    });

    const savedOrder = await this.orderDetailDatabase.save(newOrderDetail);

    console.log(`Orden creada: ${savedOrder.uuid}`);

    return {
      success: true,
      message: `Orden registrada correctamente.`,
      data: savedOrder,
    };
  }

  // Metodo para Actualizar una orden
  async updateOrderDetailRepository(uuid: string, updateOrdersDto: CreateOrdersDto) {
    const orderExisting = await this.orderDetailDatabase.findOne({ where: { uuid } });

    if (!orderExisting) {
      return {
        success: false,
        message: `El detalle de orden con UUID ${uuid} no existe.`,
      };
    }

    orderExisting.cant = updateOrdersDto.cant;
    orderExisting.subTotal = updateOrdersDto.subTotal;
    orderExisting.iva = updateOrdersDto.iva;
    orderExisting.discount = updateOrdersDto.discount;

    const updatedOrder = await this.orderDetailDatabase.save(orderExisting);

    return {
      success: true,
      message: `Detalle de orden actualizado correctamente.`,
      data: updatedOrder,
    };
  }

  //  Metodo para Eliminar una orden
  async deleteOrderDetailRepository(uuid: string) {
    const orderExisting = await this.orderDetailDatabase.findOne({ where: { uuid } });

    if (!orderExisting) {
      return {
        success: false,
        message: `El detalle de orden con UUID ${uuid} no existe.`,
      };
    }

    await this.orderDetailDatabase.remove(orderExisting);

    return {
      success: true,
      message: `El detalle de orden con UUID ${uuid} fue eliminado correctamente.`,
    };
  }
}
