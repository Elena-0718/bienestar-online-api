import { DataSource } from 'typeorm';
import { Progress } from '../../entities/progress.entity';
import { User } from '../../entities/users.entity';
import { Subscription } from '../../entities/subscription.entity';
import { SubscriptionStatus } from '../../enum/subscription-status.enum';
import { progressData } from '../data/progress.data';

export class ProgressSeed {
  static async run(dataSource: DataSource): Promise<void> {
    const progressRepo = dataSource.getRepository(Progress);
    const userRepo = dataSource.getRepository(User);
    const subscriptionRepo = dataSource.getRepository(Subscription);

    console.log('📊 Ejecutando seed de progress...');

    for (const item of progressData) {
      const user = await userRepo.findOne({
        where: { email: item.userEmail },
      });

      if (!user) {
        console.warn(`⚠️ Usuario no encontrado: ${item.userEmail}`);
        continue;
      }

      const subscription = await subscriptionRepo.findOne({
        where: {
          user: { uuid: user.uuid },
          status: SubscriptionStatus.ACTIVE, // ✅ CORRECTO
        },
        relations: ['user'],
      });

      if (!subscription) {
        console.warn(`⚠️ Suscripción activa no encontrada para ${item.userEmail}`);
        continue;
      }

      const exists = await progressRepo.findOne({
        where: {
          subscription: { uuid: subscription.uuid },
          recordDate: new Date(item.recordDate),
        },
      });

      if (exists) continue;

      const progress = progressRepo.create({
        subscription,
        user,

        recordDate: new Date(item.recordDate),
        isActive: true,

        weightKg: item.weightKg,
        bodyFatPercentage: item.bodyFatPercentage,
        muscleMassKg: item.muscleMassKg,
        waistCm: item.waistCm,
        hipCm: item.hipCm,
        chestCm: item.chestCm,

        energyLevel: item.energyLevel,
        adherenceLevel: item.adherenceLevel,

        professionalNotes: item.professionalNotes,
        userNotes: item.userNotes,
      });

      await progressRepo.save(progress);

      console.log(`✅ Progress creado: ${item.userEmail} | ${item.recordDate}`);
    }

    console.log('🏁 Seed de progress finalizado');
  }
}

