import { HydratedDocument, Query, SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';
import type Redis from 'ioredis';
import { EVENT_HISTORY_CHANNEL } from '../events.constants';

export type EventHistoryDocument = HydratedDocument<EventHistory>;

export enum EventHistoryStatus {
    Queued = 'queued',
    NoSubscribers = 'no_subscribers',
}

@Schema({
    timestamps: {
        createdAt: 'cAt',
        updatedAt: 'uAt',
    },
    versionKey: false,
})
export class EventHistory {
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
    event!: string;

    @Prop({
        type: SchemaTypes.Mixed,
    })
    payload?: Record<string, any>;

    @Prop({
        type: String,
        enum: EventHistoryStatus,
        required: true,
    })
    status!: EventHistoryStatus;

    @Prop({
        type: [String],
        default: [],
    })
    webhookIds!: string[];

    // Gets added by mongoose timestamps
    cAt!: Date;
    uAt!: Date;
}

function publishChange(redis: Redis, doc: EventHistoryDocument) {
    redis.publish(
        EVENT_HISTORY_CHANNEL,
        JSON.stringify({
            _id: doc._id,
            oId: doc.oId,
            event: doc.event,
            payload: doc.payload,
            status: doc.status,
            webhookIds: doc.webhookIds,
            cAt: doc.cAt,
        }),
    );
}

type UpdateQuery = Query<unknown, EventHistoryDocument> & {
    _affectedIds?: string[];
};

// Publishes to Redis on every create/update, so callers never have to
// remember to publish manually when this document changes.
export function createEventHistorySchema(redis: Redis) {
    const schema = SchemaFactory.createForClass(EventHistory);

    schema.post('save', function (doc: EventHistoryDocument) {
        publishChange(redis, doc);
    });

    // findOneAndUpdate/findByIdAndUpdate return the pre-update doc unless
    // { new: true } is passed — force it so the hook below always has
    // fresh state, regardless of what the caller passed.
    schema.pre('findOneAndUpdate', function () {
        this.setOptions({ new: true });
    });

    schema.post(
        'findOneAndUpdate',
        function (doc: EventHistoryDocument | null) {
            if (doc) {
                publishChange(redis, doc);
            }
        },
    );

    // updateOne/updateMany only get the write result in their post hook,
    // never the document — capture the matching ids beforehand and
    // re-fetch their post-update state to publish.
    schema.pre(['updateOne', 'updateMany'], async function (
        this: UpdateQuery,
    ) {
        const docs = await this.model.find(this.getFilter()).select('_id');
        this._affectedIds = docs.map((doc) => doc._id);
    });

    schema.post(['updateOne', 'updateMany'], async function (
        this: UpdateQuery,
    ) {
        if (!this._affectedIds?.length) {
            return;
        }

        const docs = await this.model.find({
            _id: { $in: this._affectedIds },
        });

        docs.forEach((doc) => publishChange(redis, doc));
    });

    return schema;
}
