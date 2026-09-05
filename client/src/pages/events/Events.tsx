import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Activity, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { getEvents } from '../../api/events';
import { useAuth } from '../../hooks/useAuth';
import { useModal } from '../../components/modal/useModal';
import { EventPayloadModal } from '../../components/events/EventPayloadModal';
import { EventStatusBadge } from '../../components/events/EventStatusBadge';
import type { EventHistoryItem, EventUpdateMessage } from '../../types/Event';
import type { ApiErrorResponse } from '../../types/Api';

const PAGE_SIZE = 10;

export function Events() {
    const { accessToken } = useAuth();
    const { openModal } = useModal();
    const [events, setEvents] = useState<EventHistoryItem[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [live, setLive] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await getEvents(page, PAGE_SIZE);
                setEvents(res.data.items);
                setTotalPages(res.data.totalPages);
                setTotal(res.data.total);
            } catch (err: unknown) {
                const error = err as AxiosError<ApiErrorResponse>;
                toast.error(
                    error.response?.data?.message ||
                        error.message ||
                        'Something went wrong.',
                );
            }
        };

        fetchEvents();
    }, [page]);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        const socket = io(`${import.meta.env.VITE_SERVER_URL}/events`, {
            auth: { token: accessToken },
        });

        socket.on('connect', () => setLive(true));
        socket.on('disconnect', () => setLive(false));

        socket.on('event:new', (event: EventUpdateMessage) => {
            if (event.isNew) {
                setTotal((current) => current + 1);
            }

            // Only the first page shows newest-first live updates —
            // other pages would otherwise shift under the reader. A
            // status update (isNew: false) patches an existing row in
            // place instead of prepending a duplicate.
            setPage((currentPage) => {
                if (currentPage === 1) {
                    setEvents((current) => {
                        const exists = current.some(
                            (item) => item._id === event._id,
                        );

                        if (exists) {
                            return current.map((item) =>
                                item._id === event._id ? event : item,
                            );
                        }

                        if (!event.isNew) {
                            return current;
                        }

                        return [event, ...current].slice(0, PAGE_SIZE);
                    });
                }

                return currentPage;
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [accessToken]);

    return (
        <div className="min-h-full p-6">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Events
                        </h1>

                        <p className="mt-1 text-sm">
                            Events received from your backend via the API.
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
                                live ? 'animate-pulse bg-green-500' : 'bg-gray-400'
                            }`}
                        />
                        {live ? 'Live' : 'Connecting...'}
                    </span>
                </div>

                {/* Events table */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    {/* Table header */}
                    <div className="grid grid-cols-[2fr_3fr_1.5fr_1fr_1.5fr] items-center gap-4 border-b border-gray-200 bg-gray-50 px-5 py-3">
                        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Event
                        </div>

                        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Payload
                        </div>

                        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Status
                        </div>

                        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Attempts
                        </div>

                        <div className="text-xs font-medium uppercase tracking-wider text-gray-500">
                            Received
                        </div>
                    </div>

                    {/* Rows */}
                    {events.map((event) => (
                        <div
                            key={event._id}
                            onClick={() =>
                                openModal({
                                    component: EventPayloadModal,
                                    props: { event },
                                })
                            }
                            className="grid cursor-pointer grid-cols-[2fr_3fr_1.5fr_1fr_1.5fr] items-center gap-4 border-b border-gray-100 px-5 py-4 transition last:border-b-0 hover:bg-gray-50">
                            {/* Name */}
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                                    <Activity className="h-4 w-4 text-gray-600" />
                                </div>

                                <code className="truncate text-sm font-medium text-gray-900">
                                    {event.event}
                                </code>
                            </div>

                            {/* Payload */}
                            <div className="min-w-0">
                                <code className="block truncate text-sm text-gray-600">
                                    {event.payload
                                        ? JSON.stringify(event.payload)
                                        : '—'}
                                </code>
                            </div>

                            {/* Status */}
                            <div>
                                <EventStatusBadge
                                    status={event.status}
                                    webhookCount={event.webhookIds.length}
                                />
                            </div>

                            {/* Attempts */}
                            <div className="text-sm text-gray-600">
                                {event.deliveries?.reduce(
                                    (sum, delivery) =>
                                        sum + (delivery.attempts?.length || 0),
                                    0,
                                ) || 0}
                            </div>

                            {/* Received */}
                            <div className="text-sm text-gray-600">
                                {new Date(event.cAt).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Empty state */}
                    {events.length === 0 && (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                                <Activity className="h-5 w-5 text-gray-500" />
                            </div>

                            <h3 className="text-sm font-semibold text-gray-900">
                                No events yet
                            </h3>

                            <p className="mt-1 max-w-sm text-sm text-gray-500">
                                Events sent to the API with a valid API key
                                will show up here.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer info */}
                <div className="mt-4 flex items-center justify-between text-xs">
                    <span>{total} events</span>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() =>
                                setPage((current) => Math.max(1, current - 1))
                            }
                            className="inline-flex items-center gap-1 rounded-md p-1.5 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">
                            <ChevronLeft className="h-4 w-4" />
                            Prev
                        </button>

                        <span>
                            Page {page} of {totalPages}
                        </span>

                        <button
                            type="button"
                            disabled={page >= totalPages}
                            onClick={() =>
                                setPage((current) =>
                                    Math.min(totalPages, current + 1),
                                )
                            }
                            className="inline-flex items-center gap-1 rounded-md p-1.5 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40">
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
