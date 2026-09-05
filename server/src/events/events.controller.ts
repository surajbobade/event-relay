import {
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiKeyGuard } from '../api-keys/guards/api-key.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateEventDto } from './dto/create-event.dto';
import { GetEventsQueryDto } from './dto/get-events-query.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    @UseGuards(ApiKeyGuard)
    ingest(@Body() dto: CreateEventDto, @Req() req) {
        return this.eventsService.ingest(req.user._id, dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getEvents(@Query() query: GetEventsQueryDto, @Req() req) {
        return this.eventsService.getMyEvents(
            req.user._id,
            query.page ?? 1,
            query.limit ?? 20,
        );
    }
}
