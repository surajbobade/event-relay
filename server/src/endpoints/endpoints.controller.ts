import { Body, Controller, Post, UseGuards, Req, Get, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { EndpointsService } from './endpoints.service';

@Controller('endpoints')
@UseGuards(JwtAuthGuard)
export class EndpointsController {
    constructor(
        private readonly endpointsService: EndpointsService,
    ) {}

    @Post()
    create(
        @Body() dto: CreateEndpointDto,
        @Req() req,
    ) {
        return this.endpointsService.create(req.user._id, dto);
    }

    @Get()
    getEndpoints(@Req() req) {
        return this.endpointsService.getMyEndpoints(req.user._id);
    }

    @Get(':endpointId')
    async getEndpoint(
        @Req() req,
        @Param('endpointId') endpointId: string,
    ) {
        return this.endpointsService.getEndpointDetails(
            req.user._id,
            endpointId,
        );
    }
}
