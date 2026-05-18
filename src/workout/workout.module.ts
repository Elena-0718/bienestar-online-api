// workout.module.ts
import { Module } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { WorkoutRepository } from './workout.repository';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { ProfessionalModule } from 'src/professional/professional.module';

@Module({
  imports: [SubscriptionModule, ProfessionalModule],
  controllers: [WorkoutController],
  providers: [WorkoutService, WorkoutRepository],
  exports: [WorkoutService, WorkoutRepository],
})
export class WorkoutModule {}
