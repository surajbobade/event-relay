import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Request, RequestDocument } from './schemas/request.schema';
import { Model } from 'mongoose';
import { Endpoint, EndpointDocument } from 'src/endpoints/schemas/endpoint.schema';

@Injectable()
export class RequestsService {
    constructor(
        @InjectModel(Request.name)
        private readonly requestModel: Model<RequestDocument>,

        @InjectModel(Endpoint.name)
        private readonly endpointModel: Model<EndpointDocument>,
    ) {}

    async findAll(
        userId: string,
        endpointId: string,
    ) {
        const endpoint =
            await this.endpointModel.findOne({
                _id: endpointId,
                oId: userId,
            });

        if (!endpoint) {
            throw new NotFoundException(
                'Endpoint not found.',
            );
        }

        return this.requestModel
            .find({
                endpointId,
            })
            .sort({
                cAt: -1,
            })
            .lean();
    }
}
