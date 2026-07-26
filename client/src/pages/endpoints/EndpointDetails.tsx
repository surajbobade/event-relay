import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { EndpointStats } from '../../components/endpoint-details/EndpointStats';
import type { EndpointDetails } from '../../types/Enpoint';
import { EndpointHeader } from '../../components/endpoint-details/EndpointHeader';
import { EmptyRequests } from '../../components/endpoint-details/EndpointRequests';
import { RequestHistory } from '../../components/endpoint-details/RequestHistory';
import { getEndpoint } from '../../api/endpoints';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../../types/Api';
import { toast } from 'sonner';

export function EndpointDetails() {
    const { endpointId } = useParams();

    const [endpoint, setEndpoint] = useState<EndpointDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await getEndpoint(endpointId!);
                setEndpoint(res.data);
            } catch (err) {
                const error = err as AxiosError<ApiErrorResponse>;
                toast.error(
                    error.response?.data?.message ||
                        error.message ||
                        'Something went wrong.',
                );
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [endpointId]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                Loading...
            </div>
        );
    }

    if (!endpoint) {
        return <div className="py-20 text-center">Endpoint not found.</div>;
    }

    return (
        <div className="space-y-8">
            <EndpointHeader endpoint={endpoint} />

            <EndpointStats
                totalRequests={0}
                requestsToday={0}
                lastRequestAt={undefined}
                averageResponseTime={undefined}
            />

            {!endpoint.hasRequests ? (
                <EmptyRequests endpoint={endpoint} />
            ) : (
                <div className="gap-6">
                    <RequestHistory endpointId={endpoint._id} />
                </div>
            )}
        </div>
    );
}
