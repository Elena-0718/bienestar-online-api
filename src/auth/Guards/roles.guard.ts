import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from 'src/enum/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as { role?: Roles };

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado.');
    }

    if (!user.role) {
      throw new ForbiddenException('No tienes un rol asignado.');
    }

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este recurso.',
      );
    }

    return true;
  }
}
