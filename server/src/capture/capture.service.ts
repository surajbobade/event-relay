import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
    Endpoint,
    EndpointDocument,
} from '../endpoints/schemas/endpoint.schema';

import { Request, RequestDocument } from '../requests/schemas/request.schema';

type CaptureDto = {
    host: string;
    method: string;
    url: string;
    path: string;
    headers: Record<string, string>;
    query: Record<string, unknown>;
    body: unknown;
    ip?: string;
    userAgent?: string;
    contentType?: string;
    contentLength?: number;
};

@Injectable()
export class CaptureService {
    constructor(
        @InjectModel(Endpoint.name)
        private readonly endpointModel: Model<EndpointDocument>,

        @InjectModel(Request.name)
        private readonly requestModel: Model<RequestDocument>,
    ) {}

    async capture(dto: CaptureDto) {
        const domain = this.extractSubdomain(dto.host);

        if (!domain) {
            throw new NotFoundException('Invalid endpoint.');
        }

        const endpoint = await this.endpointModel.findOne({
            domain,
            ia: { $ne: true },
        });

        if (!endpoint) {
            throw new NotFoundException('No active endpoint found.');
        }

        // TODO:
        // Later this will come from endpoint configuration
        const response = {
            status: 200,
            headers: {
                'content-type': 'application/json',
            },
            body: {
                success: true,
                message: 'Request captured successfully.',
            },
        };

        await this.requestModel.create({
            endpointId: endpoint._id,
            method: dto.method,
            url: dto.url,
            path: dto.path,
            headers: dto.headers,
            body: dto.body,
            ip: dto.ip,
            userAgent: dto.userAgent,
            contentType: dto.contentType,
            contentLength: dto.contentLength,
            res: {
                status: response.status,
                headers: response.headers,
                body: response.body,
            }
        });

        return response;
    }

    private extractSubdomain(host: string): string | null {
        // remove port when running locally
        const hostname = host.split(':')[0];

        const parts = hostname.split('.');

        // stripe.requeststudio.com
        if (parts.length >= 3) {
            return parts[0];
        }

        // localhost or requeststudio.com
        return null;
    }
}
