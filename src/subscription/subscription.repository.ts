import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subscription } from "src/entities/subscription.entity";
import { EntityManager, EntityTarget, QueryRunner, Repository } from "typeorm";
import { CreateSubscriptionDto } from "./Dtos/createSubscription.dto";


@Injectable()
export class SubscriptionRepository {
    
    
    
    constructor (
  @InjectRepository(Subscription)
    private readonly subscriptionDataBase: Repository<Subscription>,
  ) {}


  getSubscriptionByName(name: string) {
      throw new Error('Method not implemented.');
  }
 

  async nameExisting(name: string) {
  return await this.subscriptionDataBase.findOne({ where: { name } }); 
}


  // metodo para obtener una suscripcion por su ID

  async getSubscriptionByIdRepository(uuid: string) {
    return await this.subscriptionDataBase.findOne({
      where: { uuid },
    });
  }

  // metodo para crear una suscripcion

  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
  const newSubscription = this.subscriptionDataBase.create({
    name: createSubscriptionDto.name,
    date: createSubscriptionDto.date,
  });

  const savedSubscription = await this.subscriptionDataBase.save(newSubscription);

  console.log(`Suscripción creada: ${savedSubscription.name}`);

  return {
    message: `La suscripción "${savedSubscription.name}" fue creada exitosamente.`,
    data: savedSubscription,
  };
}
    async updateSubscription(
    uuid: string,
    updateSubscriptionDto: CreateSubscriptionDto,
  ) {
    const existingSubscription = await this.getSubscriptionByIdRepository(uuid);

    if (!existingSubscription) return null;

    const updatedSubscription = Object.assign(existingSubscription, updateSubscriptionDto);

    return await this.subscriptionDataBase.save(updatedSubscription);
  }
async deleteSubscriptionRepository(uuid: string) {
  const subscription = await this.subscriptionDataBase.findOne({ where: { uuid } });
  
  if (!subscription) {
    throw new Error('No se encontró la suscripción con ese UUID');
  }

  await this.subscriptionDataBase.remove(subscription);
}


}

