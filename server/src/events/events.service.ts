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

    async ingest(businessId: string, dto: CreateEventDto) {
        const webhooks = await this.webhooksService.findActiveForEvent(
            businessId,
            dto.event,
        );

        if (webhooks.length === 0) {
            const eventHistory = await this.eventHistoryModel.create({
                bId: businessId,
                e: dto.event,
                p: dto.payload,
                s: EventHistoryStatus.NoSubscribers,
            });

            return {
                eventIds: [eventHistory.id],
                queued: 0,
            };
        }

        // One document per matched webhook — created individually (not
        // insertMany) so each fires its own 'save' hook and gets its own
        // live-update publish.
        const eventHistories = await Promise.all(
            webhooks.map((webhook) =>
                this.eventHistoryModel.create({
                    bId: businessId,
                    e: dto.event,
                    p: dto.payload,
                    wId: webhook._id,
                    s: EventHistoryStatus.Queued,
                }),
            ),
        );

        await Promise.all(
            eventHistories.map((eventHistory, index) =>
                this.deliveryQueue.add(
                    dto.event,
                    {
                        eventId: eventHistory.id,
                        webhookId: webhooks[index]._id,
                        targetUrl: webhooks[index].tUrl,
                        event: dto.event,
                        payload: dto.payload ?? null,
                        bId: businessId,
                    },
                    {
                        attempts: DELIVERY_MAX_ATTEMPTS,
                        backoff: {
                            type: 'exponential',
                            delay: DELIVERY_BACKOFF_BASE_DELAY_MS,
                        },
                        removeOnComplete: true,
                        removeOnFail: true,
                    },
                ),
            ),
        );

        return {
            eventIds: eventHistories.map((eventHistory) => eventHistory.id),
            queued: eventHistories.length,
        };
    }

    async triggerTestEvent(businessId: string) {
        return this.ingest(businessId, {
            event: 'test.event',
            payload: {
                message: 'This is a test event triggered from the dashboard',
                triggeredAt: new Date().toISOString(),
            },
        });
    }

    async getMyEvents(businessId: string, page: number, limit: number) {
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            this.eventHistoryModel
                .find({
                    bId: businessId,
                })
                .sort({
                    cAt: -1,
                })
                .skip(skip)
                .limit(limit)
                .lean(),

            this.eventHistoryModel.countDocuments({
                bId: businessId,
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

    async getStatsToday(businessId: string) {
        const startOfDay = new Date();
        startOfDay.setUTCHours(0, 0, 0, 0);

        const [result] = await this.eventHistoryModel.aggregate([
            {
                $match: {
                    bId: businessId,
                    cAt: { $gte: startOfDay },
                },
            },
            {
                $facet: {
                    received: [{ $count: 'count' }],
                    success: [
                        { $match: { s: EventHistoryStatus.Success } },
                        { $count: 'count' },
                    ],
                    failed: [
                        { $match: { s: EventHistoryStatus.Failed } },
                        { $count: 'count' },
                    ],
                    noSubscribers: [
                        {
                            $match: {
                                s: EventHistoryStatus.NoSubscribers,
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
