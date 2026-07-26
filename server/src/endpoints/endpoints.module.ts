import { Module } from '@nestjs/common';
import { EndpointsController } from './endpoints.controller';
import { EndpointsService } from './endpoints.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Endpoint, EndpointSchema } from './schemas/endpoint.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Endpoint.name,
                schema: EndpointSchema,
            },
        ]),
    ],
    controllers: [EndpointsController],
    providers: [EndpointsService],
    exports: [EndpointsService],
})
export class EndpointsModule {}
