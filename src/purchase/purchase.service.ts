import { Injectable, NotFoundException } from '@nestjs/common';
import { PurchaseRepository } from './purchase.repository';
import { CreatePurchaseDto } from './Dtos/createPurchase.dto';

@Injectable()
export class PurchaseService {
  constructor(private readonly purchaseRepository: PurchaseRepository) {}

  // Servicio para obtener una compra por UUID
  async getPurchaseByIdService(uuid: string) {
    const purchase = await this.purchaseRepository.getPurchaseByIdRepository(uuid);

    if (!purchase) {
      throw new NotFoundException(`No se encontró la compra con UUID: ${uuid}`);
    }

    return {
      message: 'Compra encontrada exitosamente',
      data: purchase,
    };
  }
  // Servicio para crear una compra
  async createPurchaseService(createPurchaseDto: CreatePurchaseDto) {
    const newPurchase = await this.purchaseRepository.createPurchaseRepository(
      createPurchaseDto,
    );

    return {
      message: 'Compra creada exitosamente',
      purchase: newPurchase.data,
    };

  }

// Servicio para actualizar una compra
async updatePurchaseService(uuid: string, updatePurchaseDto: any) {
  const purchaseUpdated = await this.purchaseRepository.updatePurchaseRepository(
    uuid,
    updatePurchaseDto,
  );

  if (!purchaseUpdated) {
    throw new NotFoundException(`No se encontró la compra con UUID: ${uuid}`);
  }

  return {
    message: 'Compra actualizada correctamente',
    purchase: purchaseUpdated.data,
  };
}
// servicio para eliminar una compra
async deletePurchaseService(uuid: string) {
  const result = await this.purchaseRepository.deletePurchaseRepository(uuid);

  if (!result.success) {
    throw new NotFoundException(result.message);
  }

  return {
    message: result.message,
  };
}


}

