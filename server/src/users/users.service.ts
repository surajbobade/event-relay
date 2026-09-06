import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { resolvePermissions } from './permissions.constants';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<User>,
    ) {}

    findByEmail(email: string) {
        return this.userModel.findOne({
            'email.address': email.toLowerCase(),
        });
    }

    findById(id: string) {
        return this.userModel.findById(id);
    }

    create(user: Partial<User>) {
        return this.userModel.create(user);
    }

    async createBusinessMember(businessId: string, dto: CreateUserDto) {
        const existingUser = await this.findByEmail(dto.email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 12);

        const user = await this.userModel.create({
            bId: businessId,
            role: UserRole.Member,
            profile: {
                name: dto.name,
            },
            email: {
                address: dto.email.toLowerCase(),
            },
            auth: {
                password: hashedPassword,
            },
        });

        return {
            _id: user.id,
            profile: user.profile,
            email: {
                address: user.email.address,
            },
            role: user.role,
            p: user.p,
            cAt: user.cAt,
        };
    }

    findByBusiness(businessId: string) {
        return this.userModel
            .find({
                bId: businessId,
                role: UserRole.Member,
            })
            .select('-auth')
            .sort({
                cAt: -1,
            })
            .lean();
    }

    async updateMemberPermissions(
        businessId: string,
        memberId: string,
        permissions: string[],
    ) {
        const member = await this.userModel
            .findOneAndUpdate(
                {
                    _id: memberId,
                    bId: businessId,
                    role: UserRole.Member,
                },
                {
                    p: resolvePermissions(permissions),
                },
                {
                    returnDocument: 'after',
                },
            )
            .select('-auth');

        if (!member) {
            throw new NotFoundException('Member not found.');
        }

        return member;
    }

    updateRefreshToken(userId: string, refreshToken?: string) {
        return this.userModel.findByIdAndUpdate(userId, {
            'auth.refreshTokenHash': refreshToken,
        });
    }
}
