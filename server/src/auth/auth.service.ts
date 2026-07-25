import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}

    async register(body: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(body.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(body.password, 12);

        const user = await this.usersService.create({
            profile: {
                name: body.name,
            },
            email: {
                address: body.email.toLowerCase(),
            },
            auth: {
                password: hashedPassword,
            },
        });

        return {
            name: user.profile.name,
            email: user.email.address,
        };
    }

    async login(data: LoginDto) {
        const user = await this.usersService.findByEmail(data.email);
        if (!user) {
            throw new UnauthorizedException();
        }

        const isPasswordCorrect = await bcrypt.compare(
            data.password,
            user.auth.password,
        );
        if (!isPasswordCorrect) {
            throw new UnauthorizedException();
        }

        const tokens = await this.generateTokens(user.id, user.email.address);

        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async refresh(refreshToken: string) {
        const payload = await this.jwtService.verifyAsync(refreshToken, {
            secret: process.env.JWT_REFRESH_SECRET,
        });

        const user = await this.usersService.findById(payload.sub);
        if (!user?.auth.refreshTokenHash) {
            throw new UnauthorizedException();
        }

        const matches = await bcrypt.compare(
            refreshToken,
            user.auth.refreshTokenHash,
        );
        if (!matches) {
            throw new UnauthorizedException();
        }

        const tokens = await this.generateTokens(user.id, user.email.address);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    private async generateTokens(userId: string, email: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: process.env.JWT_ACCESS_SECRET,
                    expiresIn: '15m',
                },
            ),

            this.jwtService.signAsync(
                {
                    sub: userId,
                    email,
                },
                {
                    secret: process.env.JWT_REFRESH_SECRET,
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    private async updateRefreshToken(userId: string, refreshToken: string) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
    }

    async logout(userId: string) {
        await this.usersService.updateRefreshToken(userId);
    }
}
