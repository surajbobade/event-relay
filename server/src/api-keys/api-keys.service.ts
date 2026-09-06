import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { ApiKey, ApiKeyDocument } from './schemas/api-key.schema';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

const KEY_PREFIX = 'erk';

@Injectable()
export class ApiKeysService {
    constructor(
        @InjectModel(ApiKey.name)
        private readonly apiKeyModel: Model<ApiKeyDocument>,
    ) {}

    async create(businessId: string, dto: CreateApiKeyDto) {
        const secret = nanoid(32);

        const apiKey = await this.apiKeyModel.create({
            bId: businessId,
            n: dto.name?.trim(),
            kH: await bcrypt.hash(secret, 10),
        });

        return {
            _id: apiKey.id,
            name: apiKey.n,
            key: `${KEY_PREFIX}_${apiKey.id}.${secret}`,
            cAt: apiKey.cAt,
        };
    }

    async getMyApiKeys(businessId: string) {
        return this.apiKeyModel
            .find({
                bId: businessId,
            })
            .select('-kH')
            .sort({
                cAt: -1,
            })
            .lean();
    }

    async deleteApiKey(businessId: string, apiKeyId: string) {
        const result = await this.apiKeyModel.deleteOne({
            _id: apiKeyId,
            bId: businessId,
        });

        if (result.deletedCount === 0) {
            throw new NotFoundException('API key not found.');
        }
    }

    async validate(rawKey: string): Promise<string | null> {
        const withoutPrefix = rawKey.startsWith(`${KEY_PREFIX}_`)
            ? rawKey.slice(KEY_PREFIX.length + 1)
            : rawKey;

        const [id, secret] = withoutPrefix.split('.');
        if (!id || !secret) {
            return null;
        }

        const apiKey = await this.apiKeyModel.findById(id);
        if (!apiKey) {
            return null;
        }

        const matches = await bcrypt.compare(secret, apiKey.kH);
        if (!matches) {
            return null;
        }

        void this.apiKeyModel
            .updateOne(
                { _id: id },
                {
                    lUAt: new Date(),
                },
            )
            .exec();

        return apiKey.bId;
    }
}
