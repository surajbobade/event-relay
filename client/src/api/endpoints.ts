import { apiClient } from "./axios";

export const createEndpoint = (data: Record<string, unknown>) => {
    return apiClient.post('/endpoints', data);
};

export const getEndpoints = () => {
    return apiClient.get('/endpoints');
};
