import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { WebhookForm } from '../../components/webhooks/WebhookForm';
import { getWebhook, updateWebhook } from '../../api/webhooks';
import type { Webhook } from '../../types/Webhook';
import type { ApiErrorResponse } from '../../types/Api';

export function WebhookEdit() {
    const { webhookId } = useParams();
    const navigate = useNavigate();
    const [webhook, setWebhook] = useState<Webhook | null>(null);

    useEffect(() => {
        if (!webhookId) {
            return;
        }

        const fetchWebhook = async () => {
            try {
                const res = await getWebhook(webhookId);
                setWebhook(res.data);
            } catch (err: unknown) {
                const error = err as AxiosError<ApiErrorResponse>;
                toast.error(
                    error.response?.data?.message ||
                        error.message ||
                        'Something went wrong.',
                );
                navigate('/webhooks');
            }
        };

        fetchWebhook();
    }, [webhookId, navigate]);

    const handleSubmit = async (data: {
        name: string;
        targetUrl: string;
        events: string[];
        active: boolean;
    }) => {
        if (!webhookId) {
            return;
        }

        try {
            await updateWebhook(webhookId, data);
            navigate('/webhooks');
        } catch (err: unknown) {
            const error = err as AxiosError<ApiErrorResponse>;
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Something went wrong.',
            );
        }
    };

    const handleCancel = () => {
        navigate('/webhooks');
    };

    return (
        <div className="min-h-full p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="mb-3 inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-900">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Webhooks
                    </button>

                    <h1 className="text-2xl font-semibold tracking-tight">
                        Edit Webhook
                    </h1>

                    <p className="mt-1 text-sm">
                        Update this webhook's configuration.
                    </p>
                </div>

                {webhook && (
                    <WebhookForm
                        initialValues={{
                            name: webhook.name,
                            targetUrl: webhook.targetUrl,
                            events: webhook.events,
                            active: webhook.active,
                        }}
                        submitLabel="Save Changes"
                        submitIcon={Save}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                )}
            </div>
        </div>
    );
}
