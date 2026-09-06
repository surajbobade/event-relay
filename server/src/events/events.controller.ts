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
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermission } from '../auth/decorators/require-permission.decorator';
import { CreateEventDto } from './dto/create-event.dto';
import { GetEventsQueryDto } from './dto/get-events-query.dto';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    @UseGuards(ApiKeyGuard)
    ingest(@Body() dto: CreateEventDto, @Req() req) {
        return this.eventsService.ingest(req.user.bId, dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermission('events:view')
    getEvents(@Query() query: GetEventsQueryDto, @Req() req) {
        return this.eventsService.getMyEvents(
            req.user.bId,
            query.page ?? 1,
            query.limit ?? 20,
        );
    }

    @Get('stats')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermission('events:view')
    getStats(@Req() req) {
        return this.eventsService.getStatsToday(req.user.bId);
    }

    @Post('test')
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @RequirePermission('events:view')
    triggerTest(@Req() req) {
        return this.eventsService.triggerTestEvent(req.user.bId);
    }
}
