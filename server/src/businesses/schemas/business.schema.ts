import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';

export type BusinessDocument = HydratedDocument<Business>;

@Schema({
    timestamps: {
        createdAt: 'cAt',
        updatedAt: 'uAt',
    },
    versionKey: false,
})
export class Business {
    @Prop({
        type: String,
        default: () => nanoid(),
    })
    _id!: string;

    // The user who created this business — the original owner, ahead of
    // future business-user roles (e.g. only the owner can invite/remove).
    @Prop({
        required: true,
    })
    oId!: string;

    // Absent until the new-user business-setup step is completed.
    @Prop({
        trim: true,
    })
    n?: string;

    // Gets added by mongoose timestamps
    cAt!: Date;
    uAt!: Date;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
