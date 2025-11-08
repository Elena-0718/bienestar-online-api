import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SubscriptionRepository } from './subscription.repository'; // importa tu repositorio
import { CreateSubscriptionDto } from './Dtos/createSubscription.dto';
import { UpdateSubscriptionDto } from './Dtos/updateSubscription.dto';

@Injectable()
export class SubscriptionService {
 

  
  
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
  ) {}
 // Servicio para obtener una suscripción por su ID

  async getSubscriptionByIdService(uuid: string) {
    const subscriptionExisting =
      await this.subscriptionRepository.getSubscriptionByIdRepository(uuid);

    if (!subscriptionExisting) {
      throw new NotFoundException('La suscripción no existe');
    }

    return subscriptionExisting;
  } 

 // Servicio para crear una nueva suscripción
async postCreateSubscriptionService(createSubscriptionDto: CreateSubscriptionDto) {
  
  const nameExisting = await this.subscriptionRepository.nameExisting(createSubscriptionDto.name);

  if (nameExisting) {
    throw new ConflictException('Esta suscripción ya se encuentra registrada');
  }

 
  const newSubscription = await this.subscriptionRepository.createSubscription(createSubscriptionDto);


 
  return {
    message: 'Suscripción creada correctamente',
    subscription: newSubscription,
  };

}

// servicio para actualizar ubna suscripcion
async UpdateSubscriptionService(
    uuid: string,
    updateSubscriptionDto: CreateSubscriptionDto,
  ) {
    const subscriptionExisting =
      await this.subscriptionRepository.getSubscriptionByIdRepository(uuid);

    if (!subscriptionExisting) {
      throw new NotFoundException('No se encontró la suscripción que intentas actualizar');
    }

    const updated = await this.subscriptionRepository.updateSubscription(
      uuid,
      updateSubscriptionDto,
    );

    return {
      message: 'Suscripción actualizada correctamente',
      updatedSubscription: updated,
    };
}
// servicio para eliminar una ruta
 
 async deleteSubscriptionService(uuid: string) {
    const subscription = await this.subscriptionRepository.getSubscriptionByIdRepository(uuid);
    if (!subscription) {
      throw new NotFoundException(`No se encontró la suscripción con UUID ${uuid}`);
    }

    await this.subscriptionRepository.deleteSubscriptionRepository(uuid);

    return { message: `La suscripción "${subscription.name}" fue eliminada correctamente.` };
  }
  }
