import { apiClient } from './axios';

export const getApiKeys = () => {
    return apiClient.get('/api-keys');
};

export const createApiKey = (data: { name?: string }) => {
    return apiClient.post('/api-keys', data);
};

export const deleteApiKey = (id: string) => {
    return apiClient.delete(`/api-keys/${id}`);
};
