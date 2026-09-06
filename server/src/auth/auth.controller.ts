import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { REFRESH_TOKEN_AGE } from './constants';

import type { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from 'src/users/schemas/user.schema';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    async login(
        @Body() data: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tokens = await this.authService.login(data);

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: REFRESH_TOKEN_AGE,
        });

        return {
            accessToken: tokens.accessToken,
        };
    }

    @Post('refresh')
    async refresh(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            throw new UnauthorizedException();
        }

        const tokens = await this.authService.refresh(refreshToken);

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: REFRESH_TOKEN_AGE,
        });

        return {
            accessToken: tokens.accessToken,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async logout(@Req() req, @Res({ passthrough: true }) res) {
        await this.authService.logout(req.user._id);

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        });

        return {
            message: 'Logged out',
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    me(@Req() req) {
        const user = req.user as User;

        return {
            _id: user._id,
            profile: user.profile,
            email: {
                address: user.email.address,
            },
            role: user.role,
            p: user.p,
        };
    }
}
