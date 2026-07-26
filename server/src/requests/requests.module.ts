import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Request, RequestSchema } from './schemas/request.schema';
import {
    Endpoint,
    EndpointSchema,
} from 'src/endpoints/schemas/endpoint.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Request.name,
                schema: RequestSchema,
            },
        ]),

        MongooseModule.forFeature([
            {
                name: Endpoint.name,
                schema: EndpointSchema,
            },
        ]),
    ],

    controllers: [RequestsController],
    providers: [RequestsService],
})
export class RequestsModule {}
