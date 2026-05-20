import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/Guards/roles.guard';
import { RolesDecorator } from 'src/decorators/roles.decorator';
import { Roles } from 'src/enum/roles.enum';
import { CreateDeliveryDto } from './dtos/create-delivery.dto';
import { UpdateDeliveryStatusDto } from './dtos/UpdateStatusDeliverydto';


@Controller('deliveries')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DeliveryController {
  constructor(private readonly service: DeliveryService) {}

  @Get('all')
  @RolesDecorator(Roles.ADMIN)
  getAll() {
    return this.service.getAll();
  }
  @Post()
  @RolesDecorator(Roles.ADMIN)
  create(@Body() dto: CreateDeliveryDto) {
    return this.service.create(dto);
  }

  @Put(':uuid/status')
  @RolesDecorator(Roles.ADMIN)
  updateStatus(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateDeliveryStatusDto,
  ) {
    return this.service.updateStatus(uuid, dto);
  }

  @Get(':uuid')
  @RolesDecorator(Roles.ADMIN, Roles.USER)
  getById(@Param('uuid') uuid: string, @Req() req) {
    return this.service.getById(uuid, req);
  }
}
