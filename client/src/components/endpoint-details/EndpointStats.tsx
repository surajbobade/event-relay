import {
    Activity,
    Clock3,
    Timer,
    ShieldCheck,
} from 'lucide-react';

type Props = {
    totalRequests: number;
    requestsToday: number;
    lastRequestAt?: string;
    averageResponseTime?: number;
};

export function EndpointStats({
    totalRequests,
    requestsToday,
    lastRequestAt,
    averageResponseTime,
}: Props) {
    const stats = [
        {
            title: 'Total Requests',
            value: totalRequests.toLocaleString(),
            icon: Activity,
        },
        {
            title: 'Today',
            value: requestsToday.toLocaleString(),
            icon: ShieldCheck,
        },
        {
            title: 'Last Request',
            value: lastRequestAt
                ? new Date(lastRequestAt).toLocaleString()
                : 'Never',
            icon: Clock3,
        },
        {
            title: 'Avg Response',
            value:
                averageResponseTime != null
                    ? `${averageResponseTime} ms`
                    : '-',
            icon: Timer,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={stat.title}
                        className="rounded-xl border border-gray-800 bg-gray-900 p-5 transition hover:border-[var(--primary)]">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="rounded-lg bg-[var(--primary)]/10 p-2">
                                <Icon
                                    size={18}
                                    className="text-[var(--primary)]"
                                />
                            </div>
                        </div>

                        <div className="text-2xl font-bold">
                            {stat.value}
                        </div>

                        <div className="mt-1 text-sm text-gray-400">
                            {stat.title}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}