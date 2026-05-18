// workout.repository.ts

import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { WorkoutPlan } from 'src/entities/workout.entity';

@Injectable()
export class WorkoutRepository extends Repository<WorkoutPlan> {
  constructor(private readonly dataSource: DataSource) {
    super(WorkoutPlan, dataSource.createEntityManager());
  }

  /* =========================
     CREATE
  ========================== */
  async createWorkoutPlan(data: Partial<WorkoutPlan>): Promise<WorkoutPlan> {
    const workout = this.create(data);
    return this.save(workout);
  }

  /* =========================
     FIND ALL BY SUBSCRIPTION
     (solo activos)
  ========================== */
  async findBySubscription(subscriptionUuid: string): Promise<WorkoutPlan[]> {
    return this.find({
      where: {
        subscription: {
          uuid: subscriptionUuid,
        },
        isActive: true,
      },
      relations: [
        'subscription',
        'subscription.user',
        'professional',
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  /* =========================
     FIND ACTIVE (UNO)
  ========================== */
  async findActiveBySubscription(
    subscriptionUuid: string,
  ): Promise<WorkoutPlan | null> {
    return this.findOne({
      where: {
        subscription: {
          uuid: subscriptionUuid,
        },
        isActive: true,
      },
      relations: [
        'subscription',
        'subscription.user',
        'professional',
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }
}