import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Model } from 'mongoose';
import { Queue } from 'bullmq';
import { WebhooksService } from '../webhooks/webhooks.service';
import { CreateEventDto } from './dto/create-event.dto';
import { WEBHOOK_DELIVERY_QUEUE } from './events.constants';
import {
    EventHistory,
    EventHistoryDocument,
    EventHistoryStatus,
} from './schemas/event-history.schema';

@Injectable()
export class EventsService {
    constructor(
        private readonly webhooksService: WebhooksService,

        @InjectModel(EventHistory.name)
        private readonly eventHistoryModel: Model<EventHistoryDocument>,

        @InjectQueue(WEBHOOK_DELIVERY_QUEUE)
        private readonly deliveryQueue: Queue,
    ) {}

    async ingest(userId: string, dto: CreateEventDto) {
        const webhooks = await this.webhooksService.findActiveForEvent(
            userId,
            dto.event,
        );

        const eventHistory = await this.eventHistoryModel.create({
            oId: userId,
            event: dto.event,
            payload: dto.payload,
            status:
                webhooks.length > 0
                    ? EventHistoryStatus.Queued
                    : EventHistoryStatus.NoSubscribers,
            webhookIds: webhooks.map((webhook) => webhook._id),
        });

        if (webhooks.length === 0) {
            return {
                eventId: eventHistory.id,
                queued: 0,
            };
        }

        await Promise.all(
            webhooks.map((webhook) =>
                this.deliveryQueue.add(dto.event, {
                    eventId: eventHistory.id,
                    webhookId: webhook._id,
                    targetUrl: webhook.targetUrl,
                    event: dto.event,
                    payload: dto.payload ?? null,
                    oId: userId,
                }),
            ),
        );

        return {
            eventId: eventHistory.id,
            queued: webhooks.length,
        };
    }

    async getMyEvents(userId: string, page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            this.eventHistoryModel
                .find({
                    oId: userId,
                })
                .sort({
                    cAt: -1,
                })
                .skip(skip)
                .limit(limit)
                .lean(),

            this.eventHistoryModel.countDocuments({
                oId: userId,
            }),
        ]);

        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.max(1, Math.ceil(total / limit)),
        };
    }
}
