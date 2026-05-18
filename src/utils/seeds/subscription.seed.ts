import { DataSource } from 'typeorm';
import { Subscription } from '../../entities/subscription.entity';
import { User } from '../../entities/users.entity';
import { Plan } from '../../entities/plan.entity';
import { subscriptionSeedData } from '../data/subscription.seed.data';

export async function subscriptionSeed(
  dataSource: DataSource,
): Promise<void> {
  const subscriptionRepo = dataSource.getRepository(Subscription);
  const userRepo = dataSource.getRepository(User);
  const planRepo = dataSource.getRepository(Plan);

  console.log('🌱 Iniciando seed de suscripciones...');

  for (const item of subscriptionSeedData) {

    /* =========================
       VALIDAR USUARIO
    ========================== */
    const user = await userRepo.findOne({
      where: { email: item.userEmail },
      relations: {
        credential: true,
        subscriptions: true,
      },
    });

    if (!user) {
      console.warn(`⚠️ Usuario no encontrado: ${item.userEmail}`);
      continue;
    }

    if (!user.credential || user.credential.role !== 'USER') {
      console.warn(
        `⚠️ El usuario ${user.email} no es USER. No puede tener suscripción.`,
      );
      continue;
    }

    /* =========================
       VALIDAR PLAN
    ========================== */
    const plan = await planRepo.findOne({
      where: { type: item.planType },
    });

    if (!plan) {
      console.warn(`⚠️ Plan no encontrado: ${item.planType}`);
      continue;
    }

    /* =========================
       EVITAR DUPLICADOS (ACTIVE)
    ========================== */
    const activeSubscription = user.subscriptions?.find(
      (sub) => sub.status === item.status,
    );

    if (activeSubscription) {
      console.log(`ℹ️ Suscripción ya existe para ${user.email}`);
      continue;
    }

    /* =========================
       CREAR SUSCRIPCIÓN
    ========================== */
    const subscription = subscriptionRepo.create({
      user,
      plan,
      billingCycle: item.billingCycle,
      status: item.status,
      startDate: new Date(item.startDate),
      endDate: item.endDate ? new Date(item.endDate) : null,
    });

    await subscriptionRepo.save(subscription);

    console.log(`✅ Suscripción creada: ${user.email} → ${plan.type}`);
  }

  console.log('🌱 Seed de suscripciones finalizado');
}
