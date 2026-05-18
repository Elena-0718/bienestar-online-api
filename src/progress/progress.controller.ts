import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ProgressService } from './progress.service';

import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { RolesDecorator } from 'src/decoratos/roles.decorator';
import { Roles } from 'src/enum/roles.enum';

import { CreateProgressDto } from './dtos/create-progress.dto';
import { UpdateProgressDto } from './dtos/update-progress.dto';

@Controller('progress')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgressController {
  constructor(
    private readonly progressService: ProgressService,
  ) {}

  /* =========================
      STATS & MOTIVATION (Para Gráficos)
  ========================== */
  @Get('stats/:userUuid')
  @RolesDecorator(Roles.ADMIN, Roles.PROFESSIONAL, Roles.USER)
  async getStats(
    @Param('userUuid') userUuid: string,
    @Req() req: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    // Seguridad: Un usuario común solo puede ver sus propios stats
    if (req.user.role === Roles.USER && req.user.uuid !== userUuid) {
      throw new ForbiddenException('No tienes permiso para ver el progreso de otro usuario');
    }

    return this.progressService.getStatsByUser(userUuid, from, to);
  }

  /* =========================
      CREATE
  ========================== */
  @Post(':userUuid')
  @RolesDecorator(Roles.ADMIN, Roles.PROFESSIONAL)
  async create(
    @Param('userUuid') userUuid: string,
    @Req() req: any,
    @Body() dto: CreateProgressDto,
  ) {
    const professionalUuid = req.user.uuid;
    return this.progressService.create(
      userUuid,
      professionalUuid,
      dto,
    );
  }

  /* =========================
      FIND ONE
  ========================== */
  @Get(':uuid')
  @RolesDecorator(Roles.ADMIN, Roles.PROFESSIONAL, Roles.USER)
  async findByUuid(
    @Param('uuid') uuid: string,
  ) {
    return this.progressService.findByUuid(uuid);
  }

  /* =========================
      HISTORY BY USER (Lista plana)
  ========================== */
  @Get('user/:userUuid')
  @RolesDecorator(Roles.ADMIN, Roles.PROFESSIONAL, Roles.USER)
  async findByUser(
    @Param('userUuid') userUuid: string,
    @Req() req: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    // Seguridad: Evitar que usuarios vean historiales ajenos
    if (req.user.role === Roles.USER && req.user.uuid !== userUuid) {
      throw new ForbiddenException('Acceso denegado al historial');
    }

    return this.progressService.findByUser(
      userUuid,
      from,
      to,
    );
  }

  /* =========================
      UPDATE
  ========================== */
  @Patch(':uuid')
  @RolesDecorator(Roles.ADMIN, Roles.PROFESSIONAL)
  async update(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateProgressDto,
  ) {
    return this.progressService.update(uuid, dto);
  }

  /* =========================
      DELETE (SOFT)
  ========================== */
  @Delete(':uuid')
  @RolesDecorator(Roles.ADMIN, Roles.PROFESSIONAL)
  async delete(
    @Param('uuid') uuid: string,
  ) {
    return this.progressService.delete(uuid);
  }
}