import { apiClient } from './axios';

export const getWebhooks = () => {
    return apiClient.get('/webhooks');
};

export const getWebhook = (id: string) => {
    return apiClient.get(`/webhooks/${id}`);
};

export const createWebhook = (data: {
    name: string;
    targetUrl: string;
    events: string[];
    active: boolean;
}) => {
    return apiClient.post('/webhooks', data);
};

export const updateWebhook = (
    id: string,
    data: Partial<{
        name: string;
        targetUrl: string;
        events: string[];
        active: boolean;
    }>,
) => {
    return apiClient.patch(`/webhooks/${id}`, data);
};

export const deleteWebhook = (id: string) => {
    return apiClient.delete(`/webhooks/${id}`);
};
