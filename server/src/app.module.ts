import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import Redis from 'ioredis';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { RedisModule } from './redis/redis.module';
import { EventsModule } from './events/events.module';
import { ApiKeysModule } from './api-keys/api-keys.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                uri: config.get<string>('MONGODB_URI'),
            }),
        }),
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                connection: new Redis(
                    config.get<string>('REDIS_URL') as string,
                    {
                        maxRetriesPerRequest: null,
                    },
                ),
            }),
        }),
        RedisModule,
        AuthModule,
        UsersModule,
        WebhooksModule,
        ApiKeysModule,
        EventsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
