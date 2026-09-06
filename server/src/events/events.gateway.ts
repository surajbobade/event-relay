import { Inject, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
    OnGatewayConnection,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import type Redis from 'ioredis';
import type { Server, Socket } from 'socket.io';
import { REDIS_SUBSCRIBER_CLIENT } from '../redis/redis.constants';
import { EVENT_HISTORY_CHANNEL } from './events.constants';

@WebSocketGateway({
    namespace: 'events',
    cors: {
        origin: ['http://localhost:5173', 'https://app.eventrelay.in',],
        credentials: true,
    },
})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection {
    private readonly logger = new Logger(EventsGateway.name);

    @WebSocketServer()
    server!: Server;

    constructor(
        private readonly jwtService: JwtService,

        @Inject(REDIS_SUBSCRIBER_CLIENT)
        private readonly subscriber: Redis,
    ) {}

    afterInit() {
        this.subscriber.subscribe(EVENT_HISTORY_CHANNEL);

        this.subscriber.on('message', (channel: string, message: string) => {
            if (channel !== EVENT_HISTORY_CHANNEL) {
                return;
            }

            try {
                const event = JSON.parse(message);
                this.server
                    .to(`business:${event.bId}`)
                    .emit('event:new', event);
            } catch {
                this.logger.error('Failed to parse event from redis channel');
            }
        });
    }

    handleConnection(client: Socket) {
        const token = client.handshake.auth?.token as string | undefined;

        if (!token) {
            client.disconnect();
            return;
        }

        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_ACCESS_SECRET,
            });

            client.join(`business:${payload.bId}`);
        } catch {
            client.disconnect();
        }
    }
}
