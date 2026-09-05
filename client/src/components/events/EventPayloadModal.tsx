import { useState } from 'react';
import { Check, CircleCheck, CircleX, Clock, Copy } from 'lucide-react';
import { Modal } from '../modal/Modal';
import { EventStatusBadge } from './EventStatusBadge';
import type { EventDelivery, EventHistoryItem } from '../../types/Event';

const DELIVERY_STATUS_STYLES: Record<EventDelivery['status'], string> = {
    pending: 'bg-gray-100 text-gray-600',
    success: 'bg-green-50 text-green-700',
    failed: 'bg-red-50 text-red-700',
};

type EventPayloadModalProps = {
    event: EventHistoryItem;
    onClose: () => void;
};

export function EventPayloadModal({ event, onClose }: EventPayloadModalProps) {
    const [copied, setCopied] = useState(false);

    const formatted = event.payload
        ? JSON.stringify(event.payload, null, 2)
        : 'No payload';

    const handleCopy = () => {
        navigator.clipboard.writeText(formatted);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Modal title='Event Details' subtitle={event.event} onClose={onClose}>
            <div className="mb-4 flex items-center gap-3">
                <EventStatusBadge
                    status={event.status}
                    webhookCount={event.webhookIds.length}
                />

                <span className="text-xs text-gray-500">
                    {new Date(event.cAt).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                    })}
                </span>
            </div>

            <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Payload
                </p>

                <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50">
                    {copied ? (
                        <Check className="h-3.5 w-3.5" />
                    ) : (
                        <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied ? 'Copied' : 'Copy'}
                </button>
            </div>

            <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs text-gray-100">
                {formatted}
            </pre>

            {event.deliveries.length > 0 && (
                <div className="mt-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                        Delivery Attempts
                    </p>

                    <div className="space-y-3">
                        {event.deliveries.map((delivery) => (
                            <div
                                key={delivery.webhookId}
                                className="overflow-hidden rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-3 py-2">
                                    <code className="truncate text-xs text-gray-600">
                                        {delivery.webhookId}
                                    </code>

                                    <div className="flex shrink-0 items-center gap-2">
                                        {delivery.status === 'failed' &&
                                            delivery.nextAttemptAt && (
                                                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                                    <Clock className="h-3 w-3" />
                                                    Next attempt{' '}
                                                    {new Date(
                                                        delivery.nextAttemptAt,
                                                    ).toLocaleTimeString(
                                                        'en-US',
                                                        {
                                                            hour: 'numeric',
                                                            minute: '2-digit',
                                                            second: '2-digit',
                                                        },
                                                    )}
                                                </span>
                                            )}

                                        <span
                                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${DELIVERY_STATUS_STYLES[delivery.status]}`}>
                                            {delivery.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {delivery.attempts.map((attempt, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between gap-3 px-3 py-2 text-xs">
                                            <div className="flex min-w-0 items-center gap-2">
                                                {attempt.s === 'success' ? (
                                                    <CircleCheck className="h-3.5 w-3.5 shrink-0 text-green-600" />
                                                ) : (
                                                    <CircleX className="h-3.5 w-3.5 shrink-0 text-red-600" />
                                                )}

                                                <span className="shrink-0 text-gray-700">
                                                    Attempt {index + 1}
                                                </span>

                                                {attempt.eM && (
                                                    <span className="truncate text-gray-500">
                                                        — {attempt.eM}
                                                    </span>
                                                )}
                                            </div>

                                            <span className="shrink-0 text-gray-400">
                                                {new Date(
                                                    attempt.aAt,
                                                ).toLocaleTimeString('en-US', {
                                                    hour: 'numeric',
                                                    minute: '2-digit',
                                                    second: '2-digit',
                                                })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </Modal>
    );
}
