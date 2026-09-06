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
    bId!: string;

    @Prop({
        required: true,
        trim: true,
    })
    n!: string;

    @Prop({
        required: true,
        trim: true,
    })
    tUrl!: string;

    @Prop({
        type: [String],
        required: true,
    })
    evts!: string[];

    @Prop({
        default: true,
    })
    act!: boolean;

    // Gets added by mongoose timestamps
    cAt!: Date;
    uAt!: Date;
}

export const WebhookSchema = SchemaFactory.createForClass(Webhook);
