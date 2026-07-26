import { HydratedDocument, SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';

export type RequestDocument = HydratedDocument<Request>;

@Schema({
    _id: false,
})
export class ResponseData {
    /**
     * HTTP response status
     * Example: 200, 404, 500
     */
    @Prop({
        required: true,
    })
    status!: number;

    /**
     * Response headers
     */
    @Prop({
        type: Map,
        of: String,
        default: {},
    })
    headers!: Map<string, string>;

    /**
     * Response body
     */
    @Prop({
        type: SchemaTypes.Mixed,
    })
    body?: unknown;
}

const ResponseDataSchema =
    SchemaFactory.createForClass(ResponseData);

@Schema({
    timestamps: {
        createdAt: 'cAt',
        updatedAt: 'uAt',
    },
    versionKey: false,
})
export class Request {
    @Prop({
        type: String,
        default: () => nanoid(),
    })
    _id!: string;

    @Prop({
        required: true,
        index: true,
    })
    endpointId!: string;

    @Prop({
        required: true,
        uppercase: true,
        trim: true,
    })
    method!: string;

    @Prop({
        required: true,
    })
    url!: string;

    @Prop({
        required: true,
    })
    path!: string;

    @Prop({
        type: Map,
        of: String,
        default: {},
    })
    headers!: Map<string, string>;

    @Prop({
        type: SchemaTypes.Mixed,
    })
    body?: unknown;

    @Prop()
    rawBody?: string;

    @Prop()
    ip?: string;

    @Prop()
    userAgent?: string;

    @Prop()
    contentType?: string;

    @Prop()
    contentLength?: number;

    /**
     * Response returned to the client
     */
    @Prop({
        type: ResponseDataSchema,
        required: true,
    })
    res!: ResponseData;

    // Added automatically by mongoose timestamps
    cAt!: Date;
    uAt!: Date;
}

export const RequestSchema =
    SchemaFactory.createForClass(Request);
