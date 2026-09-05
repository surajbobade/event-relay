import { useState } from 'react';
import { Check, CircleAlert, CircleCheck, Copy } from 'lucide-react';
import { Modal } from '../modal/Modal';
import type { EventHistoryItem } from '../../types/Event';

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
                {event.status === 'queued' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                        <CircleCheck className="h-3.5 w-3.5" />
                        Queued ({event.webhookIds.length})
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                        <CircleAlert className="h-3.5 w-3.5" />
                        No Subscribers
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
        </Modal>
    );
}
