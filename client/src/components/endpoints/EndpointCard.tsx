import { Globe, ChevronRight, CalendarDays } from 'lucide-react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Endpoint } from '../../types/Enpoint';

type EndpointCardProps = {
    endpoint: Endpoint;
};

export function EndpointCard({ endpoint }: EndpointCardProps) {
    const navigate = useNavigate();

    const openEndpointDetails = useCallback(() => {
        navigate(`/endpoints/${endpoint._id}`);
    }, [endpoint._id, navigate]);

    return (
        <button
            onClick={openEndpointDetails}
            className="group w-full rounded-xl border border-gray-800 bg-gray-900 p-6 text-left transition-all hover:border-[var(--primary)] hover:shadow-lg hover:shadow-[var(--primary)]/10">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-[var(--primary)]/10 p-2">
                            <Globe
                                size={18}
                                className="text-[var(--primary)]"
                            />
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-semibold text-white">
                                    {endpoint.name}
                                </h2>

                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                        !endpoint.ia
                                            ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20'
                                            : 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20'
                                    }`}>
                                    {endpoint.ia ? 'Inactive' : 'Active'}
                                </span>
                            </div>

                            <p className="mt-1 font-mono text-sm text-[var(--primary)]">
                                {endpoint.domain}.requeststudio.com
                            </p>
                        </div>
                    </div>
                    {endpoint.desc && (
                        <p className="mt-4 line-clamp-2 text-sm text-gray-400">
                            {endpoint.desc}
                        </p>
                    )}
                    <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
                        <CalendarDays size={14} />
                        Created {new Date(endpoint.cAt).toLocaleDateString()}
                    </div>
                </div>
                <ChevronRight
                    size={22}
                    className="my-auto text-gray-600 transition-transform group-hover:translate-x-1 group-hover:text-[var(--primary)]"
                />
            </div>
        </button>
    );
}
