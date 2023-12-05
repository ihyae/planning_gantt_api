import { Body, Controller, Get, HttpStatus, Post, Request, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { Response } from 'express'; // Import the `Response` type
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() user: User, @Res() res: Response) {
        const { accessToken, createdUser } = await this.authService.register(user);
        res.cookie('token', accessToken, {
            httpOnly: true,
            maxAge: 86400 * 7 * 1000, // Max-Age is set to 7 days in milliseconds
            path: '/',
        });
        res.send({
            success: true,
            message: 'You have successfully registerd.',
            createdUser
        });
    }

    @Post('login')
    async login(@Body() user: User, @Res() res: Response) {
        try {
            const { accessToken } = await this.authService.login(user);

            res.cookie('token', accessToken, {
                httpOnly: true,
                maxAge:  86400 * 1 * 1000, // Use environment variable or default to 1 day
                path: '/',
                secure: process.env.NODE_ENV === 'production', // Set to true in production for HTTPS
            });

            res.status(HttpStatus.OK).send({
                success: true,
                message: 'You have successfully logged in.',
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(HttpStatus.UNAUTHORIZED).send({
                success: false,
                message: 'Invalid credentials. Please check your username and password.',
            });
        }
    }

    @Get('logout')
    async logout(@Res() res: Response) {
        // Clear the token cookie
        res.clearCookie('token', {
            httpOnly: true,
            path: '/',
        });

        res.send({
            success: true,
            message: 'You have successfully logged out.'
        });
    }

    @Get('profile')
    async profile(@Res() res: Response) {


        res.send({
            success: true,
            message: 'You have successfully logged out.'
        });
    }
}
