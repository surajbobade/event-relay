import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { MethodBadge } from './MethodBadge';
import { StatusBadge } from './StatusBadge';
import type { Request } from '../../types/Request';

type Props = {
    request: Request;
};

export function RequestHistoryItem({ request }: Props) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="border-b border-gray-800 last:border-b-0">
            <button
                onClick={() => setExpanded((prev) => !prev)}
                className="group flex w-full items-center gap-6 px-6 py-5 text-left transition hover:bg-gray-800/50"
            >
                <MethodBadge method={request.method} />

                <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-white">
                        {request.path}
                    </div>

                    <div className="mt-1 text-sm text-gray-400">
                        {new Date(request.cAt).toLocaleString()}
                    </div>
                </div>

                <StatusBadge status={request.response?.status || 200} />

                <ChevronDown
                    size={18}
                    className={`text-gray-500 transition-transform duration-200 ${
                        expanded ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {expanded && (
                <div className="grid grid-cols-2 gap-6 border-t border-gray-800 bg-gray-950 px-6 py-5">
                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-white">
                            Request Body
                        </h3>

                        <pre className="max-h-80 overflow-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-300">
                            {JSON.stringify(
                                request.body ?? {},
                                null,
                                2,
                            )}
                        </pre>
                    </div>

                    <div>
                        <h3 className="mb-3 text-sm font-semibold text-white">
                            Response
                        </h3>

                        <pre className="max-h-80 overflow-auto rounded-lg bg-gray-900 p-4 text-sm text-gray-300">
                            {JSON.stringify(
                                request.response?.body ?? {},
                                null,
                                2,
                            )}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}
