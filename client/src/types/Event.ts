export type EventHistoryStatus = 'q' | 'ns' | 's' | 'f' | 'ip';

export type DeliveryAttemptLog = {
    s: 'success' | 'failed';
    eM?: string;
    aAt: string;
};

export type EventHistoryItem = {
    _id: string;
    e: string;
    p?: Record<string, unknown>;
    wId?: string;
    s: EventHistoryStatus;
    a: DeliveryAttemptLog[];
    nAAt?: string;
    cAt: string;
};

export type EventHistoryPage = {
    items: EventHistoryItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type EventUpdateMessage = EventHistoryItem & {
    isNew: boolean;
};

export type EventStats = {
    received: number;
    success: number;
    failed: number;
    noSubscribers: number;
};
