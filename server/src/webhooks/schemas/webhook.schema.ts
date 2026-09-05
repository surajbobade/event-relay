import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';

export type WebhookDocument = HydratedDocument<Webhook>;

@Schema({
    timestamps: {
        createdAt: 'cAt',
        updatedAt: 'uAt',
    },
    versionKey: false,
})
export class Webhook {
    @Prop({
        type: String,
        default: () => nanoid(),
    })
    _id!: string;

    @Prop({
        required: true,
    })
    oId!: string;

    @Prop({
        required: true,
        trim: true,
    })
    name!: string;

    @Prop({
        required: true,
        trim: true,
    })
    targetUrl!: string;

    @Prop({
        type: [String],
        required: true,
    })
    events!: string[];

    @Prop({
        default: true,
    })
    active!: boolean;

    // Gets added by mongoose timestamps
    cAt!: Date;
    uAt!: Date;
}

export const WebhookSchema = SchemaFactory.createForClass(Webhook);
