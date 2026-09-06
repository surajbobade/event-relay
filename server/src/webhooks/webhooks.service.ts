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

    async create(businessId: string, dto: CreateWebhookDto) {
        const webhook = await this.webhookModel.create({
            bId: businessId,
            n: dto.name.trim(),
            tUrl: dto.targetUrl.trim(),
            evts: dto.events,
            act: dto.active ?? true,
        });

        return {
            webhookId: webhook.id,
        };
    }

    async getMyWebhooks(businessId: string) {
        return this.webhookModel
            .find({
                bId: businessId,
            })
            .sort({
                cAt: -1,
            })
            .lean();
    }

    async getWebhookDetails(businessId: string, webhookId: string) {
        const webhook = await this.webhookModel
            .findOne({
                _id: webhookId,
                bId: businessId,
            })
            .lean();

        if (!webhook) {
            throw new NotFoundException('Webhook not found.');
        }

        return webhook;
    }

    async findActiveForEvent(businessId: string, event: string) {
        return this.webhookModel
            .find({
                bId: businessId,
                act: true,
                evts: event,
            })
            .lean();
    }

    async updateWebhook(
        businessId: string,
        webhookId: string,
        dto: UpdateWebhookDto,
    ) {
        const webhook = await this.webhookModel.findOneAndUpdate(
            {
                _id: webhookId,
                bId: businessId,
            },
            {
                ...(dto.name !== undefined && { n: dto.name.trim() }),
                ...(dto.targetUrl !== undefined && {
                    tUrl: dto.targetUrl.trim(),
                }),
                ...(dto.events !== undefined && { evts: dto.events }),
                ...(dto.active !== undefined && { act: dto.active }),
            },
            {
                returnDocument: 'after',
            },
        );

        if (!webhook) {
            throw new NotFoundException('Webhook not found.');
        }

        return webhook;
    }

    async deleteWebhook(businessId: string, webhookId: string) {
        const result = await this.webhookModel.deleteOne({
            _id: webhookId,
            bId: businessId,
        });

        if (result.deletedCount === 0) {
            throw new NotFoundException('Webhook not found.');
        }
    }
}
