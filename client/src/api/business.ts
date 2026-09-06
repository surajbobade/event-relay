import { apiClient } from './axios';

export const getMyBusiness = () => {
    return apiClient.get('/businesses/me');
};

export const updateMyBusiness = (name: string) => {
    return apiClient.patch('/businesses/me', { name });
};
