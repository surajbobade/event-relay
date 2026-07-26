import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';

import type { ApiErrorResponse } from '../../types/Api';
import { RequestHistoryItem } from './RequestHistoryItem';
import { getRequests } from '../../api/endpoints';
import type { Request } from '../../types/Request';

type Props = {
    endpointId: string;
};

export function RequestHistory({ endpointId }: Props) {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await getRequests(endpointId);

                setRequests(res.data);
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
        return <div>Loading requests...</div>;
    }

    if (requests.length === 0) {
        return (
            <div className="rounded-xl border border-gray-800 p-6 text-center text-gray-400">
                No requests yet.
            </div>
        );
    }

    return (
        <div className="rounded-xl border border-gray-800 bg-gray-900">
            <div className="border-b border-gray-800 px-6 py-5">
                <h2 className="text-xl font-semibold text-white">
                    Request History
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                    All incoming requests to this endpoint.
                </p>
            </div>

            <div className="divide-y divide-gray-800">
                {requests.map((request) => (
                    <RequestHistoryItem
                        key={request._id}
                        request={request}
                    />
                ))}
            </div>
        </div>
    );
}
