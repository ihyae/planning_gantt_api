import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtPayload } from '../../jwt/jwt-payload.interface';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    // Check for a Bearer token in the Authorization header
    const authHeader = request.headers['authorization'];
    const cookieToken = request.cookies.token;
    if (!authHeader && !cookieToken) return false;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7); // Remove 'Bearer ' prefix
      if (!token) return false;
      try {
        const decoded = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        }) as JwtPayload;
        request.user = decoded as JwtPayload;
        return true;
      } catch (error) {
        return false;
      }
    }

    if (cookieToken) {
      try {
        const decoded = this.jwtService.verify(cookieToken, {
          secret: process.env.JWT_SECRET,
        }) as JwtPayload;
        request.user = decoded;
        return true;
      } catch (error) {
        return false;
      }
    }

    // If neither Bearer token nor cookie is present, deny access
    return false;
  }
}
