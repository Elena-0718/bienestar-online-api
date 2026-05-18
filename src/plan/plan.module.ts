import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Plan } from 'src/entities/plan.entity';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { PlanRepository } from './plan.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Plan])],
  controllers: [PlanController],
  providers: [PlanService, PlanRepository],
  exports: [PlanService],
})
export class PlanModule {}

