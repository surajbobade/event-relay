import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BusinessesService } from './businesses.service';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Controller('businesses')
@UseGuards(JwtAuthGuard)
export class BusinessesController {
    constructor(private readonly businessesService: BusinessesService) {}

    @Get('me')
    getMyBusiness(@Req() req) {
        return this.businessesService.findById(req.user.bId);
    }

    @Patch('me')
    updateMyBusiness(@Req() req, @Body() dto: UpdateBusinessDto) {
        return this.businessesService.updateName(req.user.bId, dto.name);
    }
}
