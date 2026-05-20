import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Consultation } from '../entities/consultation.entity';
import { Subscription } from '../entities/subscription.entity';
import { Plan } from '../entities/plan.entity';

import { ConsultationController } from './consultation.controller';
import { ConsultationService } from './consultation.service';
import { ConsultationRepository } from './consultation.repository';

import { UserModule } from 'src/users/users.module';
import { SubscriptionModule } from '../subscriptions/subscription.module';
import { ProfessionalModule } from 'src/professional/professional.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consultation, Subscription, Plan]),
    UserModule,
    SubscriptionModule,
    ProfessionalModule,
  ],
  controllers: [ConsultationController],
  providers: [ConsultationService, ConsultationRepository],
  exports: [ConsultationService, ConsultationRepository],
})
export class ConsultationModule {}