import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pay } from 'src/entities/pay.entity';
import { CreatePayDto } from './Dtos/createPay.dto';

@Injectable()
export class PayRepository {
  constructor(
    @InjectRepository(Pay)
    private readonly payDatabase: Repository<Pay>,
  ) {}

  // Metodo para obtener un pago por UUID
  async getPayByIdRepository(uuid: string) {
    const payExisting = await this.payDatabase.findOne({
      where: { uuid },
    });

    if (!payExisting) {
      console.log(`Pago con UUID ${uuid} no encontrado.`);
      return {
        success: false,
        message: `El pago con UUID ${uuid} no existe.`,
      };
    }

    console.log(`Pago encontrado con UUID: ${uuid}`);
    return {
      success: true,
      data: payExisting,
    };
  }


// Metodo para crear un nuevo pago  

 async createPayRepository(createPayDto: CreatePayDto) {
    const newPay = this.payDatabase.create({
      date: createPayDto.date,
    });

    const savedPay = await this.payDatabase.save(newPay);

    console.log(`Pago creado con UUID: ${savedPay.uuid}`);
    return {
      success: true,
      message: "Pago registrado correctamente.",
      data: savedPay,
    };
  }



// Metodo para actualizar pago
 
  async updatePayRepository(uuid: string, updatePayDto: CreatePayDto) {
    const payExisting = await this.payDatabase.findOne({ where: { uuid } });

    if (!payExisting) {
      return {
        success: false,
        message: `El pago con UUID ${uuid} no existe.`,
      };
    }

    Object.assign(payExisting, updatePayDto);

    const updatedPay = await this.payDatabase.save(payExisting);

    return {
      success: true,
      message: "Pago actualizado correctamente.",
      data: updatedPay,
    };
  }
// Metodo para Eliminar un pago por UUID
async deletePayRepository(uuid: string) {
  const payExisting = await this.payDatabase.findOne({ where: { uuid } });

  if (!payExisting) {
    return {
      success: false,
      message: `El pago con UUID ${uuid} no existe.`,
    };
  }

  await this.payDatabase.remove(payExisting);

  return {
    success: true,
    message: `El pago con UUID ${uuid} fue eliminado correctamente.`,
  };
}
}