import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
  Request,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { WorkoutService } from './workout.service';
import { CreateWorkoutPlanDto } from './dtos/create-workout-plan.dto';
import { UpdateWorkoutPlanDto } from './dtos/update-workout-plan.dto';

import { JwtAuthGuard } from '../auth/Guards/jwt-auth.guard';
import { RolesGuard } from '../auth/Guards/roles.guard';
import { SubscriptionGuard } from '../auth/Guards/subscription.guard';
import { RolesDecorator } from '../decorators/roles.decorator';
import { Roles } from '../enum/roles.enum';
import { PlansAllowed } from '../decorators/plans-allowed.decorator';
import { PlanType } from '../entities/plan.entity';

@ApiTags('Workout Plans')
@ApiBearerAuth() // 🔥 CORREGIDO AQUÍ (SIN 'access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  /* =========================
     CREATE
     SOLO PROFESIONAL
  ========================== */
  @Post(':professionalId')
  @RolesDecorator(Roles.PROFESSIONAL)
  @ApiOperation({ summary: 'Crear plan de entrenamiento' })
  create(
    @Param('professionalId') professionalId: string,
    @Body() dto: CreateWorkoutPlanDto,
  ) {
    return this.workoutService.create(dto, professionalId);
  }

  /* =========================
     FIND MY WORKOUTS
     USER (SOLO VE SU PLAN)
  ========================== */
 @Get('my-workouts')
@UseGuards(JwtAuthGuard)
getMyWorkouts(@Request() req) {
  return this.workoutService.findMyWorkouts(req.user);
}
  /* =========================
     FIND BY USER
     SOLO PROFESIONAL
  ========================== */
  @Get('user/:userUuid')
  @UseGuards(SubscriptionGuard)
  @PlansAllowed(PlanType.FITNESS, PlanType.BIENESTAR)
  @RolesDecorator(Roles.PROFESSIONAL)
  @ApiOperation({ summary: 'Profesional obtiene planes de un usuario' })
  findByUser(
    @Param('userUuid') userUuid: string,
    @Request() req,
  ) {
    return this.workoutService.findByUser(
      userUuid,
      req.user,
    );
  }

  /* =========================
     FIND ONE
     USER + PROFESIONAL
  ========================== */
  @Get(':uuid')
  @UseGuards(SubscriptionGuard)
  @PlansAllowed(PlanType.FITNESS, PlanType.BIENESTAR)
  @RolesDecorator(Roles.USER, Roles.PROFESSIONAL)
  @ApiOperation({ summary: 'Obtener plan de entrenamiento por ID' })
  findOne(@Param('uuid') uuid: string) {
    return this.workoutService.findOne(uuid);
  }

  /* =========================
     UPDATE
     SOLO PROFESIONAL
  ========================== */
  @Patch(':uuid')
  @RolesDecorator(Roles.PROFESSIONAL)
  @ApiOperation({ summary: 'Actualizar plan de entrenamiento' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateWorkoutPlanDto,
  ) {
    return this.workoutService.update(uuid, dto);
  }

  /* =========================
     DELETE (SOFT)
     SOLO PROFESIONAL
  ========================== */
  @Delete(':uuid')
  @RolesDecorator(Roles.PROFESSIONAL)
  @ApiOperation({ summary: 'Desactivar plan de entrenamiento' })
  deactivate(@Param('uuid') uuid: string) {
    return this.workoutService.deactivate(uuid);
  }
}