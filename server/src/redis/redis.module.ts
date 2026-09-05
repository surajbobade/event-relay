import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS_CLIENT, REDIS_SUBSCRIBER_CLIENT } from './redis.constants';

@Global()
@Module({
    imports: [ConfigModule],
    providers: [
        {
            provide: REDIS_CLIENT,
            inject: [ConfigService],
            useFactory: (config: ConfigService) =>
                new Redis(config.get<string>('REDIS_URL') as string),
        },
        {
            provide: REDIS_SUBSCRIBER_CLIENT,
            inject: [REDIS_CLIENT],
            useFactory: (redis: Redis) => redis.duplicate(),
        },
    ],
    exports: [REDIS_CLIENT, REDIS_SUBSCRIBER_CLIENT],
})
export class RedisModule {}
