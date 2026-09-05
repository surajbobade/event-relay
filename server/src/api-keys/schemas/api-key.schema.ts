import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';

export type ApiKeyDocument = HydratedDocument<ApiKey>;

@Schema({
    timestamps: {
        createdAt: 'cAt',
        updatedAt: 'uAt',
    },
    versionKey: false,
})
export class ApiKey {
    @Prop({
        type: String,
        default: () => nanoid(12),
    })
    _id!: string;

    @Prop({
        required: true,
    })
    oId!: string;

    @Prop({
        trim: true,
    })
    name?: string;

    @Prop({
        required: true,
    })
    keyHash!: string;

    @Prop()
    lastUsedAt?: Date;

    // Gets added by mongoose timestamps
    cAt!: Date;
    uAt!: Date;
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey);
