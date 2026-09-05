import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
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

    async findActiveForEvent(userId: string, event: string) {
        return this.webhookModel
            .find({
                oId: userId,
                active: true,
                events: event,
            })
            .lean();
    }

    async updateWebhook(
        userId: string,
        webhookId: string,
        dto: UpdateWebhookDto,
    ) {
        const webhook = await this.webhookModel.findOneAndUpdate(
            {
                _id: webhookId,
                oId: userId,
            },
            {
                ...(dto.name !== undefined && { name: dto.name.trim() }),
                ...(dto.targetUrl !== undefined && {
                    targetUrl: dto.targetUrl.trim(),
                }),
                ...(dto.events !== undefined && { events: dto.events }),
                ...(dto.active !== undefined && { active: dto.active }),
            },
            {
                new: true,
            },
        );

        if (!webhook) {
            throw new NotFoundException('Webhook not found.');
        }

        return webhook;
    }

    async deleteWebhook(userId: string, webhookId: string) {
        const result = await this.webhookModel.deleteOne({
            _id: webhookId,
            oId: userId,
        });

        if (result.deletedCount === 0) {
            throw new NotFoundException('Webhook not found.');
        }
    }
}
