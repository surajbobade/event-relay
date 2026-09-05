import { apiClient } from './axios';

export const getEvents = (page = 1, limit = 20) => {
    return apiClient.get('/events', { params: { page, limit } });
};
