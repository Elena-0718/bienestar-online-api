import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Request, // 👈 Agregado
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { NutritionService } from './nutrition.service';
import { CreateNutritionPlanDto } from './dtos/create-nutrition-plan.dto';
import { UpdateNutritionPlanDto } from './dtos/update-nutrition-plan.dto';

import { Roles } from '../enum/roles.enum';
import { PlanType } from 'src/entities/plan.entity';

import { JwtAuthGuard } from '../auth/Guards/jwt-auth.guard';
import { RolesGuard } from '../auth/Guards/roles.guard';
import { SubscriptionGuard } from '../auth/Guards/subscription.guard';

import { RolesDecorator } from '../decorators/roles.decorator';
import { PlansAllowed } from 'src/decorators/plans-allowed.decorator';

@ApiTags('Nutrition Plans')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('nutrition-plans')
export class NutritionController {
  constructor(private readonly service: NutritionService) {}

  /* =========================
      FIND MY PLAN (NUEVO)
      USER LOGUEADO OBTIENE SU PROPIO PLAN
  ========================== */
  @Get('my-nutrition')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Usuario obtiene su propio plan nutricional basado en su token' })
  getMyNutrition(@Request() req) {
    // req.user.userId viene del JwtStrategy
    return this.service.findByUser(req.user.userId);
  }

  /* =========================
      CREATE
      SOLO PROFESIONAL
  ========================== */
  @Post(':professionalId')
  @RolesDecorator(Roles.PROFESSIONAL)
  @ApiOperation({ summary: 'Crear plan nutricional' })
  create(
    @Param('professionalId') professionalId: string,
    @Body() dto: CreateNutritionPlanDto,
  ) {
    return this.service.create(dto, professionalId);
  }

  /* =========================
      FIND BY USER
      USER + PROFESIONAL
      🔒 PLAN: NUTRITION | BIENESTAR
  ========================== */
  @Get('user/:userUuid')
  @UseGuards(SubscriptionGuard)
  @PlansAllowed(PlanType.NUTRITION, PlanType.BIENESTAR)
  @RolesDecorator(Roles.USER, Roles.PROFESSIONAL)
  @ApiOperation({ summary: 'Obtener planes nutricionales de un usuario' })
  findByUser(@Param('userUuid') userUuid: string) {
    return this.service.findByUser(userUuid);
  }

  /* =========================
      FIND ONE
      USER + PROFESIONAL
      🔒 PLAN: NUTRITION | BIENESTAR
  ========================== */
  @Get(':uuid')
  @UseGuards(SubscriptionGuard)
  @PlansAllowed(PlanType.NUTRITION, PlanType.BIENESTAR)
  @RolesDecorator(Roles.USER, Roles.PROFESSIONAL)
  @ApiOperation({ summary: 'Obtener plan nutricional por ID' })
  findOne(@Param('uuid') uuid: string) {
    return this.service.findOne(uuid);
  }

  /* =========================
      UPDATE
      SOLO PROFESIONAL
  ========================== */
  @Patch(':uuid')
  @RolesDecorator(Roles.PROFESSIONAL)
  @ApiOperation({ summary: 'Actualizar plan nutricional' })
  update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateNutritionPlanDto,
  ) {
    return this.service.update(uuid, dto);
  }

  /* =========================
      DELETE (SOFT)
      SOLO PROFESIONAL
  ========================== */
  @Delete(':uuid')
  @RolesDecorator(Roles.PROFESSIONAL)
  @ApiOperation({ summary: 'Desactivar plan nutricional' })
  deactivate(@Param('uuid') uuid: string) {
    return this.service.deactivate(uuid);
  }
}