import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
@UseGuards(JwtAuthGuard)
export class WebhooksController {
    constructor(private readonly webhooksService: WebhooksService) {}

    @Post()
    create(@Body() dto: CreateWebhookDto, @Req() req) {
        return this.webhooksService.create(req.user._id, dto);
    }

    @Get()
    getWebhooks(@Req() req) {
        return this.webhooksService.getMyWebhooks(req.user._id);
    }

    @Get(':webhookId')
    getWebhook(@Req() req, @Param('webhookId') webhookId: string) {
        return this.webhooksService.getWebhookDetails(req.user._id, webhookId);
    }
}
