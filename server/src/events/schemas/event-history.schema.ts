import { HydratedDocument, Query, SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { nanoid } from 'nanoid';
import type Redis from 'ioredis';
import { EVENT_HISTORY_CHANNEL } from '../events.constants';

export type EventHistoryDocument = HydratedDocument<EventHistory>;

export enum EventHistoryStatus {
    Queued = 'q',
    NoSubscribers = 'ns',
    InProgress = 'ip',
    Success = 's',
    Failed = 'f',
}

// One row per delivery try (including retries).
@Schema({ _id: false })
export class AttemptLog {
    @Prop({
        type: String,
        enum: ['success', 'failed'],
        required: true,
    })
    s!: 'success' | 'failed';

    @Prop()
    eM?: string;

    @Prop({
        required: true,
    })
    aAt!: Date;
}

export const AttemptLogSchema = SchemaFactory.createForClass(AttemptLog);

// One document per (event, webhook) pair — an event that matches 3
// webhooks produces 3 EventHistory docs, each tracking that single
// webhook's delivery independently.
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
    bId!: string;

    @Prop({
        required: true,
        trim: true,
    })
    e!: string;

    @Prop({
        type: SchemaTypes.Mixed,
    })
    p?: Record<string, any>;

    // Absent only when status is NoSubscribers (no webhook to attach to).
    @Prop()
    wId?: string;

    @Prop({
        type: String,
        enum: EventHistoryStatus,
        required: true,
    })
    s!: EventHistoryStatus;

    @Prop({
        type: [AttemptLogSchema],
        default: [],
    })
    a!: AttemptLog[];

    // Only set while status is Failed and a retry is still scheduled;
    // cleared once the delivery succeeds or exhausts all attempts.
    @Prop()
    nAAt?: Date;

    // Gets added by mongoose timestamps
    cAt!: Date;
    uAt!: Date;
}

// `isNew` tells subscribers whether this is a brand-new event or a
// status update to one they may have already seen (e.g. the delivery
// worker moving it from queued -> success), so they know whether to
// prepend a row or patch an existing one in place.
function publishChange(
    redis: Redis,
    doc: EventHistoryDocument,
    isNew: boolean,
) {
    redis.publish(
        EVENT_HISTORY_CHANNEL,
        JSON.stringify({
            _id: doc._id,
            bId: doc.bId,
            e: doc.e,
            p: doc.p,
            wId: doc.wId,
            s: doc.s,
            a: doc.a,
            nAAt: doc.nAAt,
            cAt: doc.cAt,
            isNew,
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
        publishChange(redis, doc, true);
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
                publishChange(redis, doc, false);
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

        docs.forEach((doc) => publishChange(redis, doc, false));
    });

    return schema;
}
