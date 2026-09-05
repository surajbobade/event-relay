import {
    MoreHorizontal,
    Plus,
    Webhook as WebhookIcon,
    CircleCheck,
    CircleX,
} from 'lucide-react';
import { Button } from '../../forms/auth/Button';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { getWebhooks } from '../../api/webhooks';
import type { Webhook } from '../../types/Webhook';
import type { ApiErrorResponse } from '../../types/Api';

export function Webhooks() {
    const navigate = useNavigate();
    const [webhooks, setWebhooks] = useState<Webhook[]>([]);

    useEffect(() => {
        const fetchWebhooks = async () => {
            try {
                const res = await getWebhooks();
                setWebhooks(res.data);
            } catch (err: unknown) {
                const error = err as AxiosError<ApiErrorResponse>;
                toast.error(
                    error.response?.data?.message ||
                        error.message ||
                        'Something went wrong.',
                );
            }
        };

        fetchWebhooks();
    }, []);

    const createWebhook = useCallback(() => {
        navigate('/webhooks/create');
    }, [navigate]);

    return (
        <div className="min-h-full p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Webhooks
                        </h1>

                        <p className="mt-1 text-sm">
                            Manage endpoints that receive your events.
                        </p>
                    </div>

                    <Button
                        className="inline-flex
                        inline-flex items-center gap-2
                        px-4 py-2.5
                        text-sm font-medium text-white
                        items-center gap-2
                        shadow-sm
              transition"
                        onClick={createWebhook}>
                        <Plus className="h-4 w-4" />
                        Create Webhook
                    </Button>
                </div>

                {/* Webhooks table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    {/* Table header */}
                    <div className="grid grid-cols-[2fr_2.5fr_1.5fr_1fr_40px] items-center gap-4 border-b border-gray-200 bg-gray-50 px-5 py-3">
                        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Webhook
                        </div>

                        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Endpoint
                        </div>

                        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Events
                        </div>

                        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Status
                        </div>

                        <div />
                    </div>

                    {/* Rows */}
                    {webhooks.map((webhook) => (
                        <div
                            key={webhook._id}
                            className="
                grid grid-cols-[2fr_2.5fr_1.5fr_1fr_40px]
                items-center
                gap-4
                border-b border-gray-100
                px-5 py-4
                transition
                last:border-b-0
                hover:bg-gray-50
              ">
                            {/* Name */}
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                                    <WebhookIcon className="h-4 w-4 text-gray-600" />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium text-gray-900">
                                        {webhook.name}
                                    </p>

                                    <p className="mt-0.5 text-xs text-gray-500">
                                        Created{' '}
                                        {new Date(
                                            webhook.cAt,
                                        ).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Endpoint */}
                            <div className="min-w-0">
                                <code className="block truncate text-sm text-gray-600">
                                    {webhook.targetUrl}
                                </code>
                            </div>

                            {/* Events */}
                            <div className="flex flex-wrap gap-1.5">
                                {webhook.events.slice(0, 2).map((event) => (
                                    <span
                                        key={event}
                                        className="
                      rounded-md
                      bg-gray-100
                      px-2 py-1
                      font-mono
                      text-xs
                      text-gray-600
                    ">
                                        {event}
                                    </span>
                                ))}

                                {webhook.events.length > 2 && (
                                    <span className="px-1 py-1 text-xs text-gray-400">
                                        +{webhook.events.length - 2}
                                    </span>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                {webhook.active ? (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                                        <CircleCheck className="h-3.5 w-3.5" />
                                        Active
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                                        <CircleX className="h-3.5 w-3.5" />
                                        Disabled
                                    </span>
                                )}
                            </div>

                            {/* Actions */}
                            <button
                                className="
                  rounded-md p-1.5
                  text-gray-400
                  transition
                  hover:bg-gray-100
                  hover:text-gray-700
                ">
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </div>
                    ))}

                    {/* Empty state */}
                    {webhooks.length === 0 && (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                <WebhookIcon className="h-5 w-5 text-gray-500" />
                            </div>

                            <h3 className="text-sm font-semibold text-gray-900">
                                No webhooks yet
                            </h3>

                            <p className="mt-1 max-w-sm text-sm text-gray-500">
                                Create your first webhook to start receiving
                                events.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer info */}
                <div className="mt-4 flex items-center justify-between text-xs">
                    <span>{webhooks.length} webhooks</span>

                    <span>Webhooks are delivered asynchronously</span>
                </div>
            </div>
        </div>
    );
}
