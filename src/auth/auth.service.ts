import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { username }
    });

    if (user && user.password === password) {
      return user;
    }

    return null;

  }



  async login(user: User): Promise<{ accessToken: string }> {
    try {
      const validateUser = await this.validateUser(user.username, user.password)
      if (!validateUser) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload: JwtPayload = { id: validateUser.id, username: validateUser.username };
      const accessToken = this.jwtService.sign(payload);
      if (!accessToken) throw new UnauthorizedException('Unable to generate access token');
      return {
        accessToken,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
  async register(user: User): Promise<{ accessToken: string, createdUser: User }> {
    try {
      const createdUser = await this.prismaService.user.create({
        data: {
          username: user.username,
          password: user.password
        }
      });

      const payload = { id: createdUser.id, username: createdUser.username };
      const accessToken = this.jwtService.sign(payload);
      if (!accessToken) throw new UnauthorizedException('Unable to generate access token');
      return {
        accessToken,
        createdUser,
      };
    } catch (error) {
      // Handle database or other errors  
      throw new Error(error);
    }
  }
}