import { Body, Controller, Post, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { Response } from 'express'; // Import the `Response` type
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() user:User, @Res() res: Response) {
        const { accessToken, createdUser } = await this.authService.register(user);
        res.cookie('token', accessToken, {
            httpOnly: true,
            maxAge: 86400 * 7 * 1000, // Max-Age is set to 7 days in milliseconds
            path: '/',
        });
        res.send({
            success: true,
            createdUser
        });
    }

    @Post('login')
    async login(@Body() user:User, @Res() res:Response) {
        const { accessToken } = await this.authService.login(user);
        res.cookie('token', accessToken, {
            httpOnly: true,
            maxAge: 86400 * 7 * 1000, // Max-Age is set to 7 days in milliseconds
            path: '/',
        });

        res.send({ success: true });
    }
}
