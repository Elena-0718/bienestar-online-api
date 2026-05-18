import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';

import { ConsultationService } from './consultation.service';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { CreateConsultationDto } from './dtos/create-consultation.dto';

// ✅ ADMIN
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { RolesDecorator } from 'src/decoratos/roles.decorator';
import { Roles } from 'src/enum/roles.enum';

@Controller('consultations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ConsultationController {
  constructor(private readonly service: ConsultationService) {}

  // =========================
  // ADMIN
  // =========================

  @Get('admin/all')
  @RolesDecorator(Roles.ADMIN)
  adminAll() {
    return this.service.adminListAll();
  }

  @Patch('admin/:uuid')
  @RolesDecorator(Roles.ADMIN)
  adminUpdate(
    @Param('uuid', ParseUUIDPipe) uuid: string,
    @Body() dto: any,
  ) {
    return this.service.adminUpdate(uuid, dto);
  }

  @Patch('admin/:uuid/cancel')
  @RolesDecorator(Roles.ADMIN)
  adminCancel(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.adminCancel(uuid);
  }

  // =========================
  // USER
  // =========================

  @Post()
  @RolesDecorator(Roles.USER)
  create(@Req() req, @Body() dto: CreateConsultationDto) {
    return this.service.create(req.user.uuid, dto);
  }

  @Get()
  @RolesDecorator(Roles.USER)
  getMineAlias(@Req() req) {
    return this.service.getMyConsultations(req.user.uuid);
  }

  @Get('me')
  @RolesDecorator(Roles.USER)
  getMine(@Req() req) {
    return this.service.getMyConsultations(req.user.uuid);
  }

  // ✅ UPCOMING (poner antes de :uuid)
  @Get('me/upcoming')
  @RolesDecorator(Roles.USER)
  upcoming(@Req() req, @Query('minutes') minutes?: string) {
    const m = minutes ? Number(minutes) : 30;
    return this.service.getMyUpcomingConsultations(req.user.uuid, m);
  }

  @Get('professional/:uuid')
  @RolesDecorator(Roles.PROFESSIONAL, Roles.ADMIN)
  getByProfessional(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.getProfessionalConsultations(uuid);
  }

  @Get(':uuid')
  @RolesDecorator(Roles.USER, Roles.PROFESSIONAL, Roles.ADMIN)
  getOne(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.findByUuid(uuid);
  }

  @Patch(':uuid')
  @RolesDecorator(Roles.USER)
  update(@Param('uuid', ParseUUIDPipe) uuid: string, @Body() dto: any) {
    return this.service.update(uuid, dto);
  }

  @Delete(':uuid')
  @RolesDecorator(Roles.USER)
  remove(@Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.delete(uuid);
  }

  // ✅ JOIN
  @Get(':uuid/join')
  @RolesDecorator(Roles.USER, Roles.PROFESSIONAL)
  join(@Req() req, @Param('uuid', ParseUUIDPipe) uuid: string) {
    return this.service.joinMeeting(req.user.uuid, uuid);
  }
}