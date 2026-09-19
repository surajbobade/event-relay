import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EVENT_RELAY_SERVICE_URLS } from './constants';

@Injectable()
export class PingerService {
    private readonly logger = new Logger(PingerService.name);

    constructor(private readonly configService: ConfigService) {}

    // Ping services so that service do not go down
    // Reason: We are on free tier so service spins down due to inactivity
    @Cron(CronExpression.EVERY_5_MINUTES)
    async pingWebsite() {
        for (let i = 0; i < EVENT_RELAY_SERVICE_URLS.length; i++) {
            try {
                const response = await fetch(EVENT_RELAY_SERVICE_URLS[i]);
                this.logger.log(`Pinged ${EVENT_RELAY_SERVICE_URLS[i]} - status ${response.status}`);
            } catch (error) {
                this.logger.error(`Failed to ping ${EVENT_RELAY_SERVICE_URLS[i]}`, error);
            }
        }
    }
}
