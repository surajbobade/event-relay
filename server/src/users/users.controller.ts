import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePermissionsDto } from './dto/update-permissions.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, AdminGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() dto: CreateUserDto, @Req() req) {
        return this.usersService.createBusinessMember(req.user.bId, dto);
    }

    @Get()
    getMembers(@Req() req) {
        return this.usersService.findByBusiness(req.user.bId);
    }

    @Patch(':memberId/permissions')
    updatePermissions(
        @Req() req,
        @Param('memberId') memberId: string,
        @Body() dto: UpdatePermissionsDto,
    ) {
        return this.usersService.updateMemberPermissions(
            req.user.bId,
            memberId,
            dto.permissions,
        );
    }
}
