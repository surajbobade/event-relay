import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Modal } from '../modal/Modal';

type HowToTriggerModalProps = {
    onClose: () => void;
};

export function HowToTriggerModal({ onClose }: HowToTriggerModalProps) {
    const [copied, setCopied] = useState(false);

    const curl = `curl -X POST ${import.meta.env.VITE_SERVER_URL}/events \\
  -H "Authorization: Bearer erk_xxxxxxxxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "order.created",
    "payload": {
      "orderId": "12345",
      "amount": 49.99
    }
  }'`;

    const handleCopy = () => {
        navigator.clipboard.writeText(curl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Modal
            title="How to trigger an event"
            subtitle="Send events to Event Relay from your backend"
            onClose={onClose}>
            <ol className="mb-4 list-decimal space-y-2 pl-4 text-sm text-gray-700">
                <li>
                    Create an API key from the{' '}
                    <Link
                        to="/api-keys"
                        onClick={onClose}
                        className="font-medium text-[var(--primary)] underline">
                        API Keys
                    </Link>{' '}
                    page — you'll only see the full key once.
                </li>

                <li>
                    Make sure a{' '}
                    <Link
                        to="/webhooks"
                        onClick={onClose}
                        className="font-medium text-[var(--primary)] underline">
                        webhook
                    </Link>{' '}
                    is subscribed to the event name you're sending, or it'll
                    show up as "No Subscribers".
                </li>

                <li>
                    From your backend, send a{' '}
                    <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">
                        POST
                    </code>{' '}
                    request to{' '}
                    <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">
                        /events
                    </code>{' '}
                    with your API key and a JSON body of{' '}
                    <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">
                        {'{ event, payload }'}
                    </code>
                    .
                </li>
            </ol>

            <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Example
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

            <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-xs whitespace-pre text-gray-100">
                {curl}
            </pre>
        </Modal>
    );
}
