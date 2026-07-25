import { apiClient } from './axios';

export const login = (data: { email: string; password: string }) => {
    return apiClient.post('/auth/login', data);
};

export const registerNewUser = (data: { email: string; password: string }) => {
    return apiClient.post('/auth/register', data);
};

export const refreshToken = () => {
    return apiClient.post('/auth/refresh');
};

export const logout = () => {
    return apiClient.post('/auth/logout');
};
