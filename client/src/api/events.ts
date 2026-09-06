import { apiClient } from './axios';

export const getEvents = (page = 1, limit = 20) => {
    return apiClient.get('/events', { params: { page, limit } });
};

export const getEventStats = () => {
    return apiClient.get('/events/stats');
};

export const triggerTestEvent = () => {
    return apiClient.post('/events/test');
};
