import { Body, Controller, Post, Request, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body(ValidationPipe) user: User) {
        return this.authService.register(user);
    }

    @Post('login')
    async login(@Body(ValidationPipe) user: User) {
        return this.authService.login(user);
    }
}
