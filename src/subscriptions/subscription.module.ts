import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from 'src/entities/subscription.entity';
import { User } from 'src/entities/users.entity';
import { Plan } from 'src/entities/plan.entity';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionRepository } from './subscription.repository';
import { SubscriptionGuard } from 'src/auth/Guards/subscription.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, User, Plan])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, SubscriptionRepository, SubscriptionGuard],
  exports: [SubscriptionRepository, SubscriptionService, SubscriptionGuard],
})
export class SubscriptionModule {}
