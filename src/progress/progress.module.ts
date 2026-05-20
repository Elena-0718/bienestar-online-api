import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Progress } from '../entities/progress.entity';
import { User } from '../entities/users.entity';

import { ProgressController } from './progress.controller';
import { ProgressService } from './progress.service';
import { ProgressRepository } from './progress.repository';

import { SubscriptionModule } from '../subscriptions/subscription.module'; // 👈 CLAVE

@Module({
  imports: [
    TypeOrmModule.forFeature([Progress, User]),
    SubscriptionModule, // 👈 AQUÍ
  ],
  controllers: [ProgressController],
  providers: [
    ProgressService,
    ProgressRepository,
  ],
  exports: [
    ProgressService,
  ],
})
export class ProgressModule {}
