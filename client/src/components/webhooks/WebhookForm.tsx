import { useState } from 'react';
import { Plus, type LucideIcon } from 'lucide-react';
import { Button } from '../../forms/auth/Button';

interface WebhookFormValues {
    name: string;
    targetUrl: string;
    events: string[];
    active: boolean;
}

interface WebhookFormProps {
    initialValues?: WebhookFormValues;
    submitLabel?: string;
    submitIcon?: LucideIcon;
    onSubmit?: (data: WebhookFormValues) => void;
    onCancel?: () => void;
}

const availableEvents = [
    'order.created',
    'order.updated',
    'order.cancelled',
    'payment.completed',
    'payment.failed',
];

export function WebhookForm({
    initialValues,
    submitLabel = 'Create Webhook',
    submitIcon: SubmitIcon = Plus,
    onSubmit,
    onCancel,
}: WebhookFormProps) {
    const [name, setName] = useState(initialValues?.name ?? '');
    const [targetUrl, setTargetUrl] = useState(initialValues?.targetUrl ?? '');
    const [events, setEvents] = useState<string[]>(
        initialValues?.events ?? [],
    );
    const [active, setActive] = useState(initialValues?.active ?? true);

    const [errors, setErrors] = useState<{
        name?: string;
        targetUrl?: string;
        events?: string;
    }>({});

    const toggleEvent = (event: string) => {
        setEvents((current) =>
            current.includes(event)
                ? current.filter((item) => item !== event)
                : [...current, event],
        );
    };

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!name.trim()) {
            newErrors.name = 'Webhook name is required';
        }

        if (!targetUrl.trim()) {
            newErrors.targetUrl = 'Endpoint URL is required';
        } else {
            try {
                new URL(targetUrl);
            } catch {
                newErrors.targetUrl = 'Enter a valid URL';
            }
        }

        if (events.length === 0) {
            newErrors.events = 'Select at least one event';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        onSubmit?.({
            name: name.trim(),
            targetUrl: targetUrl.trim(),
            events,
            active,
        });
    };

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div className="space-y-5 px-6 py-6">
                    {/* Name */}
                    <div>
                        <label
                            htmlFor="webhook-name"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>

                        <input
                            id="webhook-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Order Service"
                            className={`w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 ${
                                errors.name
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                    : 'border-gray-300 focus:border-gray-900 focus:ring-gray-100'
                            }`}
                        />

                        {errors.name && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Endpoint URL */}
                    <div>
                        <label
                            htmlFor="webhook-url"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Endpoint URL
                        </label>

                        <input
                            id="webhook-url"
                            type="url"
                            value={targetUrl}
                            onChange={(e) => setTargetUrl(e.target.value)}
                            placeholder="https://api.example.com/webhooks"
                            className={`w-full rounded-lg border px-3 py-2.5 font-mono text-sm text-gray-900 outline-none transition placeholder:font-sans placeholder:text-gray-400 focus:ring-2 ${
                                errors.targetUrl
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-100'
                                    : 'border-gray-300 focus:border-gray-900 focus:ring-gray-100'
                            }`}
                        />

                        {errors.targetUrl ? (
                            <p className="mt-1.5 text-xs text-red-600">
                                {errors.targetUrl}
                            </p>
                        ) : (
                            <p className="mt-1.5 text-xs text-gray-500">
                                EventRelay will send HTTP requests to this URL.
                            </p>
                        )}
                    </div>

                    {/* Events */}
                    <div>
                        <label className="mb-1.5 block text-sm font-medium text-gray-700">
                            Events
                        </label>

                        <div className="rounded-lg border border-gray-200">
                            {availableEvents.map((event, index) => {
                                const selected = events.includes(event);

                                return (
                                    <label
                                        key={event}
                                        className={`flex cursor-pointer items-center gap-3 px-3.5 py-3 transition hover:bg-gray-50 ${
                                            index !== availableEvents.length - 1
                                                ? 'border-b border-gray-100'
                                                : ''
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selected}
                                            onChange={() =>
                                                toggleEvent(event)
                                            }
                                            className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                                        />

                                        <code className="text-sm text-gray-700">
                                            {event}
                                        </code>
                                    </label>
                                );
                            })}
                        </div>

                        {errors.events && (
                            <p className="mt-1.5 text-xs text-red-600">
                                {errors.events}
                            </p>
                        )}

                        {events.length > 0 && (
                            <p className="mt-1.5 text-xs text-gray-500">
                                {events.length} event
                                {events.length !== 1 ? 's' : ''} selected
                            </p>
                        )}
                    </div>

                    {/* Active */}
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3.5">
                        <div>
                            <p className="text-sm font-medium text-gray-800">
                                Active
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                                Start delivering events immediately.
                            </p>
                        </div>

                        <button
                            type="button"
                            role="switch"
                            aria-checked={active}
                            onClick={() => setActive(!active)}
                            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${
                                active ? 'bg-gray-900' : 'bg-gray-300'
                            }`}
                        >
                            <span
                                className={`inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow-sm transition ${
                                    active
                                        ? 'translate-x-5'
                                        : 'translate-x-0.5'
                                }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="default"
                            onClick={onCancel}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button
                        type="submit"
                        className="inline-flex items-center gap-2"
                    >
                        <SubmitIcon className="h-4 w-4" />
                        {submitLabel}
                    </Button>
                </div>
            </form>
        </div>
    );
}
