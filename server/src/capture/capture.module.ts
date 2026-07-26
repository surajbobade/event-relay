import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CaptureController } from './capture.controller';
import { CaptureService } from './capture.service';

import {
    Endpoint,
    EndpointSchema,
} from '../endpoints/schemas/endpoint.schema';

import {
    Request,
    RequestSchema,
} from '../requests/schemas/request.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Endpoint.name,
                schema: EndpointSchema,
            },
            {
                name: Request.name,
                schema: RequestSchema,
            },
        ]),
    ],
    controllers: [CaptureController],
    providers: [CaptureService],
})
export class CaptureModule {}
