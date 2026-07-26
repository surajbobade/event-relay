import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';

export type EndpointDocument = HydratedDocument<Endpoint>;

@Schema({
    timestamps: {
        createdAt: 'cAt',
        updatedAt: 'uAt',
    },
    versionKey: false,
})
export class Endpoint {
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
        unique: true,
        lowercase: true,
        trim: true,
    })
    domain!: string;

    @Prop({
        trim: true,
        maxLength: 2000,
    })
    desc?: string;

    ia?: boolean;

    // Gets added by mongoose timestamps
    cAt!: Date;
    uAt!: Date;
}

export const EndpointSchema = SchemaFactory.createForClass(Endpoint);
