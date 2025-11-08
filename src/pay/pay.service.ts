import { Injectable, NotFoundException } from '@nestjs/common';
import { PayRepository } from './pay.repository';
import { CreatePayDto } from './Dtos/createPay.dto';


@Injectable()
export class PayService {
  constructor(private readonly payRepository: PayRepository) {}

  // Servicio para obtener un pago por UUID
  async getPayByIdService(uuid: string) {
    const result = await this.payRepository.getPayByIdRepository(uuid);

    if (!result.success) {
      throw new NotFoundException(result.message);
    }

    return {
      message: 'Pago encontrado correctamente',
      pay: result.data,
    };
  }

  // Crear pago
  async createPayService(createPayDto: CreatePayDto) {
    const result = await this.payRepository.createPayRepository(createPayDto);
    return {
      message: result.message,
      pay: result.data,
    };
  }

// Servicio para Actualizar pago
  async updatePayService(uuid: string, updatePayDto: CreatePayDto) {
    const result = await this.payRepository.updatePayRepository(uuid, updatePayDto);

    if (!result.success) {
      throw new NotFoundException(result.message);
    }

    return {
      message: result.message,
      pay: result.data,
    };
  }

  // Servicio para eliminar pago
  async deletePayService(uuid: string) {
    const result = await this.payRepository.deletePayRepository(uuid);
    if (!result.success) throw new NotFoundException(result.message);
    return result;
  }

} 
