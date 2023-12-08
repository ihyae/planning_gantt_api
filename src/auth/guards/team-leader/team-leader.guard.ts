import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtPayload } from '../../jwt/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserType } from '@prisma/client';

@Injectable()
export class TeamLeaderGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const cookieToken = request.cookies.token;
    if (!cookieToken) return false;

    try {
      const decoded = this.jwtService.verify(cookieToken, {
        secret: process.env.JWT_SECRET,
      }) as JwtPayload;
      request.user = decoded;
      return decoded.userType === UserType.teamLeader ||
        decoded.userType === UserType.admin
        ? true
        : false;
    } catch (error) {
      return false;
    }
  }
}
