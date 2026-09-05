import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { Webhook, WebhookDocument } from './schemas/webhook.schema';

@Injectable()
export class WebhooksService {
    constructor(
        @InjectModel(Webhook.name)
        private readonly webhookModel: Model<WebhookDocument>,
    ) {}

    async create(userId: string, dto: CreateWebhookDto) {
        const webhook = await this.webhookModel.create({
            oId: userId,
            name: dto.name.trim(),
            targetUrl: dto.targetUrl.trim(),
            events: dto.events,
            active: dto.active ?? true,
        });

        return {
            webhookId: webhook.id,
        };
    }

    async getMyWebhooks(userId: string) {
        return this.webhookModel
            .find({
                oId: userId,
            })
            .sort({
                cAt: -1,
            })
            .lean();
    }

    async getWebhookDetails(userId: string, webhookId: string) {
        const webhook = await this.webhookModel
            .findOne({
                _id: webhookId,
                oId: userId,
            })
            .lean();

        if (!webhook) {
            throw new NotFoundException('Webhook not found.');
        }

        return webhook;
    }
}
