import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PlanService } from './plan.service';
import { CreatePlanDto } from './dtos/create-plan.dto';
import { UpdatePlanDto } from './dtos/update-plan.dto';

import { JwtAuthGuard } from '../auth/Guards/jwt-auth.guard';
import { RolesGuard } from '../auth/Guards/roles.guard';
import { RolesDecorator } from 'src/decorators/roles.decorator';
import { Roles} from 'src/enum/roles.enum';

@ApiTags('Plans')
@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  /* =========================
     USER / PÚBLICO
  ========================= */

  @Get('active')
  @ApiOperation({ summary: 'Obtener planes activos' })
  getActivePlans() {
    return this.planService.getActivePlans();
  }

  /* =========================
     ADMIN
  ========================= */

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Obtener todos los planes (ADMIN)' })
  getAllPlans() {
    return this.planService.getAllPlans();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @Get(':uuid')
  @ApiOperation({ summary: 'Obtener plan por ID (ADMIN)' })
  getPlanById(@Param('uuid') uuid: string) {
    return this.planService.getPlanById(uuid);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Crear plan (ADMIN)' })
  createPlan(@Body() dto: CreatePlanDto) {
    return this.planService.createPlan(dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @Patch(':uuid')
  @ApiOperation({ summary: 'Actualizar plan (ADMIN)' })
  updatePlan(
    @Param('uuid') uuid: string,
    @Body() dto: UpdatePlanDto,
  ) {
    return this.planService.updatePlan(uuid, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesDecorator(Roles.ADMIN)
  @Delete(':uuid')
  @ApiOperation({ summary: 'Desactivar plan (ADMIN)' })
  deletePlan(@Param('uuid') uuid: string) {
    return this.planService.deletePlan(uuid);
  }
}
