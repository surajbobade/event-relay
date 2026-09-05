import { apiClient } from './axios';

export const getWebhooks = () => {
    return apiClient.get('/webhooks');
};

export const createWebhook = (data: {
    name: string;
    targetUrl: string;
    events: string[];
    active: boolean;
}) => {
    return apiClient.post('/webhooks', data);
};

export const deleteWebhook = (id: string) => {
    return apiClient.delete(`/webhooks/${id}`);
};
