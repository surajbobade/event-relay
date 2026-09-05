export type EventHistoryStatus = 'queued' | 'no_subscribers';

export type EventHistoryItem = {
    _id: string;
    event: string;
    payload?: Record<string, unknown>;
    status: EventHistoryStatus;
    webhookIds: string[];
    cAt: string;
};

export type EventHistoryPage = {
    items: EventHistoryItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};
