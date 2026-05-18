import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSubscriptionDto } from './dtos/createSubscription.dto';
import { UpdateSubscriptionStatusDto } from './dtos/updateSubscription.dto';
import { UpdateSubscriptionDatesDto } from './dtos/UpdateSubscriptionDates.dto';

@ApiTags('Suscripciones')
@ApiBearerAuth()
@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  // CREATE
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una suscripción' })
  create(@Body() dto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(dto);
  }

  // READ
  @Get()
  @ApiOperation({ summary: 'Obtener todas las suscripciones' })
  getAll() {
    return this.subscriptionService.getAllSubscriptions();
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Obtener una suscripción por UUID' })
  getById(@Param('uuid') uuid: string) {
    return this.subscriptionService.getSubscriptionById(uuid);
  }

  // UPDATE
  @Put('status/:uuid')
  @ApiOperation({ summary: 'Actualizar estado de la suscripción' })
  updateStatus(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateSubscriptionStatusDto,
  ) {
    return this.subscriptionService.updateSubscriptionStatus(uuid, dto);
  }

  @Put('dates/:uuid')
  @ApiOperation({ summary: 'Actualizar fechas de la suscripción' })
  updateDates(
    @Param('uuid') uuid: string,
    @Body() dto: UpdateSubscriptionDatesDto,
  ) {
    return this.subscriptionService.updateSubscriptionDates(uuid, dto);
  }
}

