import { All, Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('requests')
export class RequestsController {
    constructor(private readonly requestsService: RequestsService) {}

    @UseGuards(JwtAuthGuard)
    @Get('endpoint/:endpointId')
    async getRequests(@Req() req, @Param('endpointId') endpointId: string) {
        return this.requestsService.findAll(req.user._id, endpointId);
    }
}
