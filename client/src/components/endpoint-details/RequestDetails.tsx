import { useMemo, useState } from 'react';
import {
    Clock3,
    Copy,
    Globe,
    HardDrive,
} from 'lucide-react';
import { toast } from 'sonner';

import { MethodBadge } from './MethodBadge';
import { StatusBadge } from './StatusBadge';

export type EndpointRequest = {
    _id: string;
    method: string;
    path: string;
    status: number;

    headers: Record<string, string>;
    query: Record<string, string>;
    body: unknown;
    response: unknown;

    ip: string;
    duration: number;
    createdAt: string;
};

type Props = {
    request: EndpointRequest | null;
};

const TABS = [
    'Headers',
    'Query',
    'Body',
    'Response',
] as const;

type Tab = (typeof TABS)[number];

export function RequestDetails({
    request,
}: Props) {
    const [tab, setTab] = useState<Tab>('Body');

    const content = useMemo(() => {
        if (!request) {
            return '';
        }

        switch (tab) {
            case 'Headers':
                return request.headers;

            case 'Query':
                return request.query;

            case 'Body':
                return request.body;

            case 'Response':
                return request.response;
        }
    }, [request, tab]);

    async function copy() {
        await navigator.clipboard.writeText(
            JSON.stringify(content, null, 2),
        );

        toast.success('Copied.');
    }

    if (!request) {
        return (
            <div className="flex items-center justify-center rounded-2xl border border-gray-800 bg-gray-900">
                <div className="text-center">
                    <HardDrive
                        size={42}
                        className="mx-auto mb-4 text-gray-600"
                    />

                    <h2 className="text-lg font-semibold">
                        Select a request
                    </h2>

                    <p className="mt-2 text-gray-400">
                        Choose a request from the
                        left panel.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-270px)] flex-col rounded-2xl border border-gray-800 bg-gray-900">
            <div className="border-b border-gray-800 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <MethodBadge
                            method={request.method}
                        />

                        <div className="font-semibold">
                            {request.path}
                        </div>

                        <StatusBadge
                            status={request.status}
                        />
                    </div>

                    <button
                        onClick={copy}
                        className="rounded-lg p-2 transition hover:bg-gray-800">
                        <Copy size={18} />
                    </button>
                </div>

                <div className="mt-5 flex flex-wrap gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <Clock3 size={16} />
                        {new Date(
                            request.createdAt,
                        ).toLocaleString()}
                    </div>

                    <div>
                        {request.duration} ms
                    </div>

                    <div className="flex items-center gap-2">
                        <Globe size={16} />
                        {request.ip}
                    </div>
                </div>
            </div>

            <div className="border-b border-gray-800 px-6">
                <div className="flex gap-6">
                    {TABS.map((item) => (
                        <button
                            key={item}
                            onClick={() => setTab(item)}
                            className={`border-b-2 py-3 text-sm transition ${
                                tab === item
                                    ? 'border-[var(--primary)] text-[var(--primary)]'
                                    : 'border-transparent text-gray-400 hover:text-white'
                            }`}>
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6">
                <pre className="overflow-auto rounded-xl bg-gray-950 p-5 text-sm leading-7">
                    <code>
                        {JSON.stringify(
                            content,
                            null,
                            2,
                        )}
                    </code>
                </pre>
            </div>
        </div>
    );
}
