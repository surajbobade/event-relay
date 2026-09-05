import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { CircleAlert, CircleCheck, CircleX, Inbox } from 'lucide-react';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { getEventStats } from '../../api/events';
import { useAuth } from '../../hooks/useAuth';
import type { EventStats } from '../../types/Event';
import type { ApiErrorResponse } from '../../types/Api';

const STAT_CARDS: Array<{
    key: keyof EventStats;
    label: string;
    icon: typeof Inbox;
    iconClassName: string;
}> = [
    {
        key: 'received',
        label: 'Events Received Today',
        icon: Inbox,
        iconClassName: 'bg-gray-100 text-gray-600',
    },
    {
        key: 'success',
        label: 'Successful Deliveries',
        icon: CircleCheck,
        iconClassName: 'bg-green-50 text-green-700',
    },
    {
        key: 'failed',
        label: 'Failed Deliveries',
        icon: CircleX,
        iconClassName: 'bg-red-50 text-red-700',
    },
    {
        key: 'noSubscribers',
        label: 'No Subscribers',
        icon: CircleAlert,
        iconClassName: 'bg-amber-50 text-amber-700',
    },
];

export function Dashboard() {
    const { accessToken } = useAuth();
    const [stats, setStats] = useState<EventStats>({
        received: 0,
        success: 0,
        failed: 0,
        noSubscribers: 0,
    });
    const [live, setLive] = useState(false);
    const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            const res = await getEventStats();
            setStats(res.data);
        } catch (err: unknown) {
            const error = err as AxiosError<ApiErrorResponse>;
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Something went wrong.',
            );
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        const socket = io(`${import.meta.env.VITE_SERVER_URL}/events`, {
            auth: { token: accessToken },
        });

        socket.on('connect', () => setLive(true));
        socket.on('disconnect', () => setLive(false));

        socket.on('event:new', () => {
            // A burst of events/status updates should trigger one
            // refetch, not one request per message.
            if (refreshTimer.current) {
                clearTimeout(refreshTimer.current);
            }

            refreshTimer.current = setTimeout(fetchStats, 400);
        });

        return () => {
            if (refreshTimer.current) {
                clearTimeout(refreshTimer.current);
            }

            socket.disconnect();
        };
    }, [accessToken, fetchStats]);

    return (
        <div className="min-h-full p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Dashboard
                        </h1>

                        <p className="mt-1 text-sm">
                            Today's event activity.
                        </p>
                    </div>

                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            live
                                ? 'bg-green-50 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                        }`}>
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${
                                live
                                    ? 'animate-pulse bg-green-500'
                                    : 'bg-gray-400'
                            }`}
                        />
                        {live ? 'Live' : 'Connecting...'}
                    </span>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {STAT_CARDS.map(
                        ({ key, label, icon: Icon, iconClassName }) => (
                            <div
                                key={key}
                                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                                <div
                                    className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${iconClassName}`}>
                                    <Icon className="h-4 w-4" />
                                </div>

                                <p className="text-2xl font-semibold tracking-tight text-gray-900">
                                    {stats[key]}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    {label}
                                </p>
                            </div>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
}
