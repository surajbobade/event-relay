import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import type Redis from 'ioredis';
import { REDIS_CLIENT } from '../redis/redis.constants';
import { WebhooksModule } from '../webhooks/webhooks.module';
import { ApiKeysModule } from '../api-keys/api-keys.module';
import { AuthModule } from '../auth/auth.module';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventsGateway } from './events.gateway';
import { WEBHOOK_DELIVERY_QUEUE } from './events.constants';
import {
    EventHistory,
    createEventHistorySchema,
} from './schemas/event-history.schema';

@Module({
    imports: [
        WebhooksModule,
        ApiKeysModule,
        AuthModule,
        BullModule.registerQueue({
            name: WEBHOOK_DELIVERY_QUEUE,
        }),
        MongooseModule.forFeatureAsync([
            {
                name: EventHistory.name,
                inject: [REDIS_CLIENT],
                useFactory: (redis: Redis) => createEventHistorySchema(redis),
            },
        ]),
    ],
    controllers: [EventsController],
    providers: [EventsService, EventsGateway],
})
export class EventsModule {}
