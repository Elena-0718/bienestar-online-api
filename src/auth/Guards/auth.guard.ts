import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
console.log('Esta es la request:', request.headers);
    const token = request.headers.authorization?.split(' ')[1];
console.log('Este es el token enviado:', token);
    if (!token) {
      throw new UnauthorizedException('El token es requerido');
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new BadRequestException('Configuracion del servidor incorrecta');
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET, });
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      payload.exp = new Date(payload.exp * 1000);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      payload.iat = new Date(payload.iat * 1000);
      if (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        !payload.role
      ) {
        throw new UnauthorizedException('No tienes los permisos necesarios');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('El token ha expirado');
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Token Invalido');
      }
      throw new UnauthorizedException('Error de autenticacion');
    }
  }
}