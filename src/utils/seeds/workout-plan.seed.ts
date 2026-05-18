import { DataSource } from 'typeorm';
import { WorkoutPlan } from '../../entities/workout.entity';
import { Subscription } from '../../entities/subscription.entity';
import { Professional } from '../../entities/professional.entity';
import { User } from '../../entities/users.entity';
import {
  andresWorkoutPlan,
  lauraWorkoutPlan,
} from '../data/workout-plans.data';
import { WorkoutPlanSeedData } from '../interfaces/workout-plan-seed.interface';
import { SubscriptionStatus } from '../../enum/subscription-status.enum';

export async function workoutPlanSeed(
  dataSource: DataSource,
): Promise<void> {
  const workoutRepo = dataSource.getRepository(WorkoutPlan);
  const subscriptionRepo = dataSource.getRepository(Subscription);
  const professionalRepo = dataSource.getRepository(Professional);
  const userRepo = dataSource.getRepository(User);

  console.log('🏋️ Ejecutando seed de workout plans...');

  const professional = await professionalRepo.findOne({
    where: { isActive: true },
  });

  if (!professional) {
    throw new Error('❌ No hay profesional activo');
  }

  const plans: WorkoutPlanSeedData[] = [
    {
      email: 'andres.morales@gmail.com',
      objective: 'Ganancia de masa muscular',
      notes: 'Plan inicial de fuerza para principiante',
      weeklyRoutine: andresWorkoutPlan,
    },
    {
      email: 'laura.gomez@gmail.com',
      objective: 'Mejorar condición física y hábitos',
      notes: 'Rutina balanceada orientada a salud general',
      weeklyRoutine: lauraWorkoutPlan,
    },
  ];

  for (const plan of plans) {
    const user = await userRepo.findOne({
      where: { email: plan.email },
    });

    if (!user) continue;

    const subscription = await subscriptionRepo.findOne({
      where: {
        user: { uuid: user.uuid },
        status: SubscriptionStatus.ACTIVE,
      },
      relations: ['user'],
    });

    if (!subscription) continue;

    const exists = await workoutRepo.findOne({
      where: {
        subscription: { uuid: subscription.uuid },
        isActive: true,
      },
    });

    if (exists) {
      console.log(`⚠️ Workout plan ya existe para ${plan.email}`);
      continue;
    }

    const workoutPlan = workoutRepo.create({
      subscription,
      professional,
      objective: plan.objective,
      notes: plan.notes,
      weeklyRoutine: plan.weeklyRoutine,
      isActive: true,
    });

    await workoutRepo.save(workoutPlan);
    console.log(`✅ Workout plan creado para ${plan.email}`);
  }

  console.log('🏁 Seed de workout plans finalizado');
}

