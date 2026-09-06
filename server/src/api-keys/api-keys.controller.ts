import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Controller('api-keys')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ApiKeysController {
    constructor(private readonly apiKeysService: ApiKeysService) {}

    @Post()
    @RequirePermission('api_keys:manage')
    create(@Body() dto: CreateApiKeyDto, @Req() req) {
        return this.apiKeysService.create(req.user.bId, dto);
    }

    @Get()
    @RequirePermission('api_keys:view')
    getApiKeys(@Req() req) {
        return this.apiKeysService.getMyApiKeys(req.user.bId);
    }

    @Delete(':apiKeyId')
    @RequirePermission('api_keys:manage')
    @HttpCode(204)
    deleteApiKey(@Req() req, @Param('apiKeyId') apiKeyId: string) {
        return this.apiKeysService.deleteApiKey(req.user.bId, apiKeyId);
    }
}
