import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Model } from 'mongoose';
import { Queue } from 'bullmq';
import { WebhooksService } from '../webhooks/webhooks.service';
import { CreateEventDto } from './dto/create-event.dto';
import {
    DELIVERY_BACKOFF_BASE_DELAY_MS,
    DELIVERY_MAX_ATTEMPTS,
    WEBHOOK_DELIVERY_QUEUE,
} from './events.constants';
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
                this.deliveryQueue.add(
                    dto.event,
                    {
                        eventId: eventHistory.id,
                        webhookId: webhook._id,
                        targetUrl: webhook.targetUrl,
                        event: dto.event,
                        payload: dto.payload ?? null,
                        oId: userId,
                    },
                    {
                        attempts: DELIVERY_MAX_ATTEMPTS,
                        backoff: {
                            type: 'exponential',
                            delay: DELIVERY_BACKOFF_BASE_DELAY_MS,
                        },
                    },
                ),
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

    async getStatsToday(userId: string) {
        const startOfDay = new Date();
        startOfDay.setUTCHours(0, 0, 0, 0);

        const [result] = await this.eventHistoryModel.aggregate([
            {
                $match: {
                    oId: userId,
                    cAt: { $gte: startOfDay },
                },
            },
            {
                $facet: {
                    received: [{ $count: 'count' }],
                    success: [
                        { $match: { status: EventHistoryStatus.Success } },
                        { $count: 'count' },
                    ],
                    failed: [
                        { $match: { status: EventHistoryStatus.Failed } },
                        { $count: 'count' },
                    ],
                    noSubscribers: [
                        {
                            $match: {
                                status: EventHistoryStatus.NoSubscribers,
                            },
                        },
                        { $count: 'count' },
                    ],
                },
            },
        ]);

        const pick = (bucket?: Array<{ count: number }>) =>
            bucket?.[0]?.count ?? 0;

        return {
            received: pick(result?.received),
            success: pick(result?.success),
            failed: pick(result?.failed),
            noSubscribers: pick(result?.noSubscribers),
        };
    }
}
