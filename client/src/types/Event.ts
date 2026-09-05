export type EventHistoryStatus = 'q' | 'ns' | 's' | 'f' | 'ip';

export type DeliveryAttemptLog = {
    s: 'success' | 'failed';
    eM?: string;
    aAt: string;
};

export type EventDelivery = {
    webhookId: string;
    status: 'pending' | 'success' | 'failed';
    attempts: DeliveryAttemptLog[];
    nextAttemptAt?: string;
};

export type EventHistoryItem = {
    _id: string;
    event: string;
    payload?: Record<string, unknown>;
    status: EventHistoryStatus;
    webhookIds: string[];
    deliveries: EventDelivery[];
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
