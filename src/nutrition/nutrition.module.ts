import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NutritionPlan } from 'src/entities/nutrition-plan.entity';

import { SubscriptionModule } from 'src/subscription/subscription.module';
import { ProfessionalModule } from 'src/professional/professional.module'; // 👈 CLAVE

import { NutritionRepository } from './nutrition.repository';
import { NutritionService } from './nutrition.service';
import { NutritionController } from './nutrition.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([NutritionPlan]),
    SubscriptionModule,
    ProfessionalModule, // ✅ ESTO RESUELVE EL ERROR
  ],
  providers: [
    NutritionRepository,
    NutritionService,
  ],
  controllers: [NutritionController],
})
export class NutritionModule {}
