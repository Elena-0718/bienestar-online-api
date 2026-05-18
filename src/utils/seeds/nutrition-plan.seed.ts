import { DataSource } from 'typeorm';
import { NutritionPlan } from '../../entities/nutrition-plan.entity';
import { Subscription } from '../../entities/subscription.entity';
import { Professional } from '../../entities/professional.entity';
import { User } from '../../entities/users.entity';
import { SubscriptionStatus } from '../../enum/subscription-status.enum';

// Importamos los datos que definiste (Asegúrate de que la ruta sea correcta)
import {
  nataliaWeeklyPlan,
  lauraWeeklyPlan,
} from '../data/nutrition-plans.data';

export async function nutritionPlanSeed(
  dataSource: DataSource,
): Promise<void> {
  const nutritionRepo = dataSource.getRepository(NutritionPlan);
  const subscriptionRepo = dataSource.getRepository(Subscription);
  const professionalRepo = dataSource.getRepository(Professional);
  const userRepo = dataSource.getRepository(User);

  // 1. Buscamos al profesional que asignará los planes
  const professional = await professionalRepo.findOne({
    where: { isActive: true },
  });

  if (!professional) {
    console.error('❌ No se pudo ejecutar el seed de nutrición: No hay profesional activo.');
    return;
  }

  // 2. Definimos los usuarios a los que les inyectaremos el plan
  const usersToSeed = [
    {
      email: 'natalia.rios@gmail.com',
      weeklyPlan: nataliaWeeklyPlan,
      objective: 'Pérdida de peso y tonificación',
    },
    {
      email: 'laura.gomez@gmail.com',
      weeklyPlan: lauraWeeklyPlan,
      objective: 'Mantenimiento y hábitos saludables',
    },
  ];

  for (const u of usersToSeed) {
    // Buscar el usuario por email
    const user = await userRepo.findOne({ where: { email: u.email } });
    if (!user) {
      console.warn(`⚠️ Usuario no encontrado: ${u.email}`);
      continue;
    }

    // Buscar su suscripción activa (Debe ser NUTRITION o BIENESTAR)
    const subscription = await subscriptionRepo.findOne({
      where: {
        user: { uuid: user.uuid },
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['user'],
    });

    if (!subscription) {
      console.warn(`⚠️ El usuario ${u.email} no tiene una suscripción activa para asignarle nutrición.`);
      continue;
    }

    // Verificar si ya tiene un plan nutricional para no duplicar
    const exists = await nutritionRepo.findOne({
      where: { 
        subscription: { uuid: subscription.uuid },
        isActive: true 
      },
    });

    if (exists) {
      console.log(`✅ El usuario ${u.email} ya tiene un plan nutricional activo.`);
      continue;
    }

    // 3. Guardar el plan con la estructura JSON completa
    await nutritionRepo.save({
      subscription,
      professional,
      weeklyPlan: u.weeklyPlan, // Aquí se guarda el objeto WeeklyNutritionPlan completo
      objective: u.objective,
      notes: 'Plan generado automáticamente por el sistema de entrenamiento.',
      isActive: true,
    });

    console.log(`🚀 Plan nutricional inyectado con éxito para: ${u.email}`);
  }
}