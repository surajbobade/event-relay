import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Model } from 'mongoose';
import { Job } from 'bullmq';
import {
    DELIVERY_BACKOFF_BASE_DELAY_MS,
    WEBHOOK_DELIVERY_QUEUE,
} from './events.constants';
import {
    EventHistory,
    EventHistoryDocument,
    EventHistoryStatus,
} from './schemas/event-history.schema';

type DeliveryJobData = {
    eventId: string;
    webhookId: string;
    targetUrl: string;
    event: string;
    payload: Record<string, unknown> | null;
    bId: string;
};

@Processor(WEBHOOK_DELIVERY_QUEUE)
export class EventsWorker extends WorkerHost {
    private readonly logger = new Logger(EventsWorker.name);

    constructor(
        @InjectModel(EventHistory.name)
        private readonly eventHistoryModel: Model<EventHistoryDocument>,
    ) {
        super();
    }

    async process(job: Job<DeliveryJobData>) {
        const { eventId, webhookId, targetUrl, event, payload } = job.data;

        await this.eventHistoryModel.updateOne(
            {
                _id: eventId,
                s: EventHistoryStatus.Queued,
            },
            {
                s: EventHistoryStatus.InProgress,
            },
        );

        let errorMessage: string | undefined;

        try {
            const res = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ event, payload }),
                signal: AbortSignal.timeout(10_000),
            });

            if (!res.ok) {
                errorMessage = `Webhook responded with ${res.status}`;
            }
        } catch (err) {
            errorMessage = (err as Error).message;
        }

        const succeeded = !errorMessage;

        // attemptsMade is only incremented after this attempt finishes,
        // so it currently holds how many attempts came *before* this one.
        const maxAttempts = job.opts.attempts ?? 1;
        const attemptNumber = job.attemptsMade + 1;
        const isLastAttempt = attemptNumber >= maxAttempts;

        const nextAttemptAt =
            !succeeded && !isLastAttempt
                ? new Date(
                      Date.now() +
                          this.calculateBackoffDelay(attemptNumber),
                  )
                : undefined;

        await this.recordAttempt(eventId, succeeded, errorMessage, nextAttemptAt);

        if (!succeeded) {
            this.logger.warn(
                `Delivery attempt ${attemptNumber}/${maxAttempts} to ${targetUrl} failed: ${errorMessage}`,
            );
            throw new Error(errorMessage);
        }
    }

    // Mirrors BullMQ's built-in 'exponential' backoff strategy (no
    // jitter) so the timestamp we store matches when it will actually
    // retry — kept here rather than queried from BullMQ because that
    // schedule isn't available to inspect from inside process().
    private calculateBackoffDelay(attemptNumber: number) {
        return Math.round(
            2 ** (attemptNumber - 1) * DELIVERY_BACKOFF_BASE_DELAY_MS,
        );
    }

    private async recordAttempt(
        eventId: string,
        succeeded: boolean,
        errorMessage?: string,
        nextAttemptAt?: Date,
    ) {
        // Log this attempt and immediately reflect its outcome as the
        // event's current status — a failure shows up right away instead
        // of waiting for retries to exhaust; a later retry that succeeds
        // will flip it back.
        await this.eventHistoryModel.updateOne(
            {
                _id: eventId,
            },
            {
                $push: {
                    a: {
                        s: succeeded ? 'success' : 'failed',
                        ...(errorMessage && { eM: errorMessage }),
                        aAt: new Date(),
                    },
                },
                $set: {
                    s: succeeded
                        ? EventHistoryStatus.Success
                        : EventHistoryStatus.Failed,
                    ...(nextAttemptAt && { nAAt: nextAttemptAt }),
                },
                ...(!nextAttemptAt && {
                    $unset: { nAAt: '' },
                }),
            },
        );
    }
}
