import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Purchase } from 'src/entities/purchase.entity';
import { CreatePurchaseDto } from './Dtos/createPurchase.dto';

@Injectable()
export class PurchaseRepository {
    purchaseDataBase: any;
  constructor(
    @InjectRepository(Purchase)
    private readonly purchaseDatabase: Repository<Purchase>,
  ) {}

  // Método para obtener una compra por UUID
  async getPurchaseByIdRepository(uuid: string) {
    return await this.purchaseDatabase.findOne({ where: { uuid } });
  }
  //  Método para crear una compra
  async createPurchaseRepository(createPurchaseDto: CreatePurchaseDto) {
    const newPurchase = this.purchaseDatabase.create({
      addressDelivery: createPurchaseDto.addressDelivery,
      dateCreated: createPurchaseDto.dateCreated,
      deliveryDate: createPurchaseDto.deliveryDate,
    });

    const savedPurchase = await this.purchaseDatabase.save(newPurchase);

    console.log(`Compra creada: ${savedPurchase.uuid}`);

    return {
      message: `Compra registrada correctamente.`,
      data: savedPurchase,
    };
  }

  //  Método para actualizar una compra

async updatePurchaseRepository(uuid: string, updatePurchaseDto: any) {

  const purchaseExisting = await this.purchaseDataBase.findOne({ where: { uuid } });

 
  if (!purchaseExisting) {
    console.log(` No existe la compra con UUID: ${uuid}`);
    return {
      success: false,
      message: `No existe la compra con UUID: ${uuid}`,
    };
  }

  if (updatePurchaseDto.addressDelivery) {
    purchaseExisting.addressDelivery = updatePurchaseDto.addressDelivery;
  }

  if (updatePurchaseDto.dateCreated) {
    purchaseExisting.dateCreated = updatePurchaseDto.dateCreated;
  }

  if (updatePurchaseDto.deliveryDate) {
    purchaseExisting.deliveryDate = updatePurchaseDto.deliveryDate;
  }

  await this.purchaseDataBase.save(purchaseExisting);

  console.log(` Compra actualizada: ${purchaseExisting.uuid}`);

  return {
    success: true,
    message: `La compra "${purchaseExisting.uuid}" fue actualizada correctamente.`,
    data: purchaseExisting,
  };

}
//  Método para eliminar una compra
async deletePurchaseRepository(uuid: string) {
 
  const purchaseExisting = await this.purchaseDataBase.findOne({ where: { uuid } });

  if (!purchaseExisting) {
    console.log(` No existe la compra con UUID: ${uuid}`);
    return {
      success: false,
      message: `No existe la compra con UUID: ${uuid}`,
    };
  }

  
  await this.purchaseDataBase.remove(purchaseExisting);

  console.log(`Compra eliminada: ${purchaseExisting.uuid}`);

  return {
    success: true,
    message: `La compra con UUID "${purchaseExisting.uuid}" fue eliminada correctamente.`,
  };
}

}
