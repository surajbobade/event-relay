import { Module } from '@nestjs/common';
import { PingerService } from './pinger.service';

@Module({
    providers: [PingerService],
})
export class CronsModule {}
