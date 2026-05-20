import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { SubscriptionRepository } from 'src/subscriptions/subscription.repository';
import { PLANS_KEY } from 'src/decorators/plans-allowed.decorator';
import { PlanType } from 'src/entities/plan.entity';
import { Roles } from 'src/enum/roles.enum';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly subscriptionRepo: SubscriptionRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const allowedPlans = this.reflector.getAllAndOverride<PlanType[]>(
      PLANS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si la ruta no requiere plan específico, dejamos pasar
    if (!allowedPlans || allowedPlans.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // ✅ EL ID REAL VIENE EN sub (según tu JWT)
   const userUuid = user.userId; // Cambia a userId para mantener consistencia con JwtAuthGuard

    if (!userUuid) {
      throw new ForbiddenException('No se pudo identificar al usuario');
    }

    // Si es profesional, permitimos acceso directo
    if (user.role === Roles.PROFESSIONAL) {
      return true;
    }

    // Buscar suscripción activa
    const subscription =
      await this.subscriptionRepo.getActiveSubscriptionByUser(userUuid);

    if (!subscription) {
      throw new ForbiddenException('No tienes una suscripción activa');
    }

    const userPlan: PlanType =
      subscription.plan?.type ?? PlanType.FREE;

    if (!allowedPlans.includes(userPlan)) {
      throw new ForbiddenException(
        `Tu plan (${userPlan}) no tiene acceso. Requiere: ${allowedPlans.join(', ')}`,
      );
    }

    return true;
  }
}