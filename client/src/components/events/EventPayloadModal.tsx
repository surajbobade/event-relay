import { useState } from 'react';
import { Check, CircleCheck, CircleX, Clock, Copy } from 'lucide-react';
import { Modal } from '../modal/Modal';
import { EventStatusBadge } from './EventStatusBadge';
import type { EventHistoryItem } from '../../types/Event';

type EventPayloadModalProps = {
    event: EventHistoryItem;
    onClose: () => void;
};

export function EventPayloadModal({ event, onClose }: EventPayloadModalProps) {
    const [copied, setCopied] = useState(false);

    const formatted = event.p ? JSON.stringify(event.p, null, 2) : 'No payload';

    const handleCopy = () => {
        navigator.clipboard.writeText(formatted);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Modal title='Event Details' subtitle={event.e} onClose={onClose}>
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <EventStatusBadge status={event.s} />

                {event.wId && (
                    <code className="truncate text-xs text-gray-500">
                        {event.wId}
                    </code>
                )}

                {event.s === 'f' && event.nAAt && (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        Next attempt{' '}
                        {new Date(event.nAAt).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            second: '2-digit',
                        })}
                    </span>
                )}

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

            {event.a.length > 0 && (
                <div className="mt-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                        Delivery Attempts
                    </p>

                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <div className="divide-y divide-gray-100">
                            {event.a.map((attempt, index) => (
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
                </div>
            )}
        </Modal>
    );
}
