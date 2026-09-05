import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { WebhookForm } from '../../components/webhooks/WebhookForm';
import { createWebhook } from '../../api/webhooks';
import type { ApiErrorResponse } from '../../types/Api';

export function WebhookCreate() {
    const navigate = useNavigate();

    const handleSubmit = async (data: {
        name: string;
        targetUrl: string;
        events: string[];
        active: boolean;
    }) => {
        try {
            await createWebhook(data);
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
            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition hover:text-gray-900 cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Webhooks
                    </button>

                    <h1 className="text-2xl font-semibold tracking-tight">
                        Create Webhook
                    </h1>

                    <p className="mt-1 text-sm">
                        Configure an endpoint to receive your events.
                    </p>
                </div>

                <WebhookForm onSubmit={handleSubmit} onCancel={handleCancel} />
            </div>
        </div>
    );
}
