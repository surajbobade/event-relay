import { ArrowLeft, Copy, Pencil, Power, Trash2, Globe } from 'lucide-react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '../../forms/auth/Button';
import type { EndpointDetails } from '../../types/Enpoint';

type Props = {
    endpoint: EndpointDetails;
};

export function EndpointHeader({ endpoint }: Props) {
    const navigate = useNavigate();

    return (
        <>
            <button
                onClick={() => navigate('/endpoints')}
                className="mb-4 flex items-center gap-2 text-sm text-gray-400 transition hover:text-white">
                <ArrowLeft size={16} />
                Back to Endpoints
            </button>

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-5">
                        <div className="rounded-xl bg-[var(--primary)]/10 p-4">
                            <Globe
                                size={26}
                                className="text-[var(--primary)]"
                            />
                        </div>
                        <div>
                            <div className="mb-2 flex items-center gap-3">
                                <h1 className="text-3xl font-bold">
                                    {endpoint.name}
                                </h1>
                                <span
                                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                                        !endpoint.ia
                                            ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                                            : 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'
                                    }`}>
                                    <span
                                        className={`h-2 w-2 rounded-full ${
                                            !endpoint.ia
                                                ? 'bg-emerald-400'
                                                : 'bg-red-400'
                                        }`}
                                    />
                                    {endpoint.ia ? 'Inactive' : 'Active'}
                                </span>
                            </div>
                            <p className="font-mono text-lg text-[var(--primary)]">
                                {endpoint.domain}.requeststudio.com
                            </p>
                            {endpoint.desc && (
                                <p className="mt-4 max-w-3xl text-gray-400">
                                    {endpoint.desc}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="default">
                            <Pencil size={16} />
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
