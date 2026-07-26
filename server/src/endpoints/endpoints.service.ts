import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEndpointDto } from './dto/create-endpoint.dto';
import { Endpoint, EndpointDocument } from './schemas/endpoint.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class EndpointsService {
    constructor(
        @InjectModel(Endpoint.name)
        private readonly endpointModel: Model<EndpointDocument>,
    ) {}

    async create(userId: string, dto: CreateEndpointDto) {
        const domain = dto.domain.toLowerCase().trim();
        if (!domain) {
            throw new BadRequestException('Domain is required');
        }

        const existingEndpoint = await this.endpointModel.exists({
            domain,
        });
        if (existingEndpoint) {
            throw new BadRequestException(
                'Endpoint is unavailable, Please some other endpoint.',
            );
        }

        const endpoint = await this.endpointModel.create({
            oId: userId,
            name: dto.name.trim(),
            domain,
            desc: dto.description?.trim(),
        });

        return {
            endpointId: endpoint.id,
        };
    }

    async getMyEndpoints(userId: string) {
        const endpoints = await this.endpointModel
            .find({
                oId: userId,
            })
            .sort({
                ia: 1,
                cAt: -1,
            })
            .lean();

        return endpoints.map((endpoint) => ({
            _id: endpoint._id,
            name: endpoint.name,
            domain: endpoint.domain,
            desc: endpoint.desc,
            ia: endpoint.ia,
            cAt: endpoint.cAt,
            uAt: endpoint.uAt,
        }));
    }
}
