import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class WebhooksController {
    constructor(private readonly webhooksService: WebhooksService) {}

    @Post()
    @RequirePermission('webhooks:manage')
    create(@Body() dto: CreateWebhookDto, @Req() req) {
        return this.webhooksService.create(req.user.bId, dto);
    }

    @Get()
    @RequirePermission('webhooks:view')
    getWebhooks(@Req() req) {
        return this.webhooksService.getMyWebhooks(req.user.bId);
    }

    @Get(':webhookId')
    @RequirePermission('webhooks:view')
    getWebhook(@Req() req, @Param('webhookId') webhookId: string) {
        return this.webhooksService.getWebhookDetails(req.user.bId, webhookId);
    }

    @Patch(':webhookId')
    @RequirePermission('webhooks:manage')
    updateWebhook(
        @Req() req,
        @Param('webhookId') webhookId: string,
        @Body() dto: UpdateWebhookDto,
    ) {
        return this.webhooksService.updateWebhook(
            req.user.bId,
            webhookId,
            dto,
        );
    }

    @Delete(':webhookId')
    @RequirePermission('webhooks:manage')
    @HttpCode(204)
    deleteWebhook(@Req() req, @Param('webhookId') webhookId: string) {
        return this.webhooksService.deleteWebhook(req.user.bId, webhookId);
    }
}
