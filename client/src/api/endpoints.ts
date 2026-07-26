import { apiClient } from "./axios";

export const createEndpoint = (data: Record<string, unknown>) => {
    return apiClient.post('/endpoints', data);
};

export const getEndpoints = () => {
    return apiClient.get('/endpoints');
};

export const getEndpoint = (endpointId: string) => {
    return apiClient.get(`/endpoints/${endpointId}`);
};

export const getRequests = (endpointId: string) => {
    return apiClient.get(`/requests/endpoint/${endpointId}`);
};
