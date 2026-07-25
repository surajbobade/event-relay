import { apiClient } from './axios';

export const getMe = () => {
    return apiClient.get('/auth/me');
};
