import {
    CircleAlert,
    CircleCheck,
    CircleDashed,
    CircleX,
    LoaderCircle,
} from 'lucide-react';
import type { EventHistoryStatus } from '../../types/Event';

type Props = {
    status: EventHistoryStatus;
    webhookCount?: number;
};

const STATUS_CONFIG: Record<
    EventHistoryStatus,
    { label: string; icon: typeof CircleCheck; className: string }
> = {
    q: {
        label: 'Queued',
        icon: CircleDashed,
        className: 'bg-gray-100 text-gray-600',
    },
    ip: {
        label: 'In Progress',
        icon: LoaderCircle,
        className: 'bg-blue-50 text-blue-700',
    },
    s: {
        label: 'Success',
        icon: CircleCheck,
        className: 'bg-green-50 text-green-700',
    },
    f: {
        label: 'Failed',
        icon: CircleX,
        className: 'bg-red-50 text-red-700',
    },
    ns: {
        label: 'No Subscribers',
        icon: CircleAlert,
        className: 'bg-amber-50 text-amber-700',
    },
};

export function EventStatusBadge({ status, webhookCount }: Props) {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.className}`}>
            <Icon className="h-3.5 w-3.5" />
            {config.label}
            {status === 'q' && typeof webhookCount === 'number'
                ? ` (${webhookCount})`
                : ''}
        </span>
    );
}
