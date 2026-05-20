import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { WorkoutRepository } from './workout.repository';
import { SubscriptionRepository } from 'src/subscriptions/subscription.repository';
import { ProfessionalRepository } from 'src/professional/professional.repository';

import { WorkoutPlan } from 'src/entities/workout.entity';
import { CreateWorkoutPlanDto } from './dtos/create-workout-plan.dto';
import { UpdateWorkoutPlanDto } from './dtos/update-workout-plan.dto';
import { Roles } from 'src/enum/roles.enum';

@Injectable()
export class WorkoutService {
  constructor(
    private readonly workoutRepo: WorkoutRepository,
    private readonly subscriptionRepo: SubscriptionRepository,
    private readonly professionalRepo: ProfessionalRepository,
  ) {}

  /* =========================
     CREATE - SOLO PROFESIONAL
  ========================== */
  async create(
    dto: CreateWorkoutPlanDto,
    professionalId: string,
  ): Promise<WorkoutPlan> {
    const subscription =
      await this.subscriptionRepo.getActiveSubscriptionByUser(dto.userId);

    if (!subscription) {
      throw new BadRequestException(
        'El usuario no tiene una suscripción activa',
      );
    }

    const professional = await this.professionalRepo.findOne({
      where: { uuid: professionalId },
    });

    if (!professional) {
      throw new NotFoundException('Profesional no encontrado');
    }

    return this.workoutRepo.createWorkoutPlan({
      subscription,
      professional,
      objective: dto.objective,
      notes: dto.notes,
      weeklyRoutine: dto.weeklyRoutine,
      isActive: true,
    });
  }

  /* =========================
     🔐 USER - MIS WORKOUTS
  ========================== */
  async findMyWorkouts(currentUser: any): Promise<WorkoutPlan[]> {

    const subscription =
      await this.subscriptionRepo.getActiveSubscriptionByUser(
        currentUser.userId, // ✅ CORREGIDO
      );

    if (!subscription) {
      return [];
    }

    return this.workoutRepo.findBySubscription(subscription.uuid);
  }

  /* =========================
     👨‍⚕️ PROFESIONAL O USER
  ========================== */
  async findByUser(
    userUuid: string,
    currentUser: any,
  ): Promise<WorkoutPlan[]> {

    if (
      currentUser.role === Roles.USER &&
      currentUser.userId !== userUuid
    ) {
      throw new BadRequestException(
        'No puedes ver el plan de otro usuario',
      );
    }

    const subscription =
      await this.subscriptionRepo.getActiveSubscriptionByUser(
        userUuid, // ✅ CORREGIDO (ANTES ESTABA MAL)
      );

    if (!subscription) {
      return [];
    }

    return this.workoutRepo.findBySubscription(subscription.uuid);
  }

  /* =========================
     FIND ONE
  ========================== */
  async findOne(uuid: string): Promise<WorkoutPlan> {
    const workout = await this.workoutRepo.findOne({
      where: { uuid },
    });

    if (!workout) {
      throw new NotFoundException(
        'Plan de entrenamiento no encontrado',
      );
    }

    return workout;
  }

  /* =========================
     UPDATE - SOLO PROFESIONAL
  ========================== */
  async update(
    uuid: string,
    dto: UpdateWorkoutPlanDto,
  ): Promise<WorkoutPlan> {
    const workout = await this.findOne(uuid);

    Object.assign(workout, dto);

    return this.workoutRepo.save(workout);
  }

  /* =========================
     DELETE (SOFT)
  ========================== */
  async deactivate(uuid: string): Promise<WorkoutPlan> {
    const workout = await this.findOne(uuid);

    workout.isActive = false;

    return this.workoutRepo.save(workout);
  }
}