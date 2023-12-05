import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.JWT_SECRET,
        // secret: configService.get<string>(process.env.JWT_SECRET),
        signOptions: { expiresIn: '3h' },
      }),
      inject: [ConfigService],
    }),

  ],
  controllers: [AuthController],
  providers: [PrismaService, AuthService, JwtStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule { }
