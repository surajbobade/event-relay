import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import type { AxiosError } from 'axios';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '../../forms/auth/Button';
import { EndpointCard } from '../../components/endpoints/EndpointCard';
import { getEndpoints } from '../../api/endpoints';
import type { ApiErrorResponse } from '../../types/Api';
import type { Endpoint } from '../../types/Enpoint';
import { useModal } from '../../components/modal/useModal';
import { CreateEndpointModal } from '../../components/endpoints/EndpointCreateModal';

export function Endpoints() {
    const { openModal } = useModal();
    const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const result = await getEndpoints();
                setEndpoints(result.data || []);
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
    }, []);

    const showCreateEndpointForm = useCallback(() => {
        openModal({
            component: CreateEndpointModal,
        })
    }, [openModal]);

    return (
        <div className="mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Endpoints</h1>
                    <p className="mt-1 text-gray-400">
                        Manage your webhook endpoints.
                    </p>
                </div>
                <Button variant="primary" className="w-auto px-5" onClick={showCreateEndpointForm}>
                    <Plus size={18} />
                    <span className="ml-2">New Endpoint</span>
                </Button>
            </div>
            {loading ? (
                <div>Loading...</div>
            ) : endpoints.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-700 py-20 text-center">
                    <h2 className="text-xl font-semibold">No endpoints yet</h2>
                    <p className="mt-2 text-gray-400">
                        Create your first endpoint to start receiving requests.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {endpoints.map((endpoint) => (
                        <EndpointCard key={endpoint._id} endpoint={endpoint} />
                    ))}
                </div>
            )}
        </div>
    );
}
