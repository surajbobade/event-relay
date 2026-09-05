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
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Controller('api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
    constructor(private readonly apiKeysService: ApiKeysService) {}

    @Post()
    create(@Body() dto: CreateApiKeyDto, @Req() req) {
        return this.apiKeysService.create(req.user._id, dto);
    }

    @Get()
    getApiKeys(@Req() req) {
        return this.apiKeysService.getMyApiKeys(req.user._id);
    }

    @Delete(':apiKeyId')
    @HttpCode(204)
    deleteApiKey(@Req() req, @Param('apiKeyId') apiKeyId: string) {
        return this.apiKeysService.deleteApiKey(req.user._id, apiKeyId);
    }
}
