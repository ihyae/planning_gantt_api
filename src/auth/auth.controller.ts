import { Body, Controller, Get, HttpStatus, NotFoundException, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';
import { Response, Request } from 'express'; // Import the `Response` type
import { JwtPayload } from './jwt-payload.interface';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() user: User, @Res() res: Response) {
        const { accessToken, createdUser } = await this.authService.register(user);
        res.cookie('token', accessToken, {
            httpOnly: true,
            maxAge: 86400 * 1 * 1000, 
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
                maxAge: 86400 * 1 * 1000, 
                path: '/',
                secure: process.env.NODE_ENV === 'production',
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
    
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async getProfile(@Req() req: Request, @Res() res: Response) {
        try {
            const { id } = req.user as JwtPayload; // Assuming the user object is set by your authentication guard
            const userProfile = await this.authService.getProfile(id);

            if (!userProfile) {
                throw new NotFoundException('User profile not found');
            }

            res.status(HttpStatus.OK).send(userProfile);
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
                success: false,
                message: 'Error retrieving user profile',
            });
        }
    }
}
