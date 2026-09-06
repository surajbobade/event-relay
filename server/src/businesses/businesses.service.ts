import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Business, BusinessDocument } from './schemas/business.schema';

@Injectable()
export class BusinessesService {
    constructor(
        @InjectModel(Business.name)
        private readonly businessModel: Model<BusinessDocument>,
    ) {}

    create(ownerId: string) {
        return this.businessModel.create({
            oId: ownerId,
        });
    }

    findById(businessId: string) {
        return this.businessModel.findById(businessId).lean();
    }

    async updateName(businessId: string, name: string) {
        const business = await this.businessModel.findByIdAndUpdate(
            businessId,
            {
                n: name.trim(),
            },
            {
                new: true,
            },
        );

        if (!business) {
            throw new NotFoundException('Business not found.');
        }

        return business;
    }
}
