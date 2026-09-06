import { apiClient } from './axios';

export const getMe = () => {
    return apiClient.get('/auth/me');
};

export const getUsers = () => {
    return apiClient.get('/users');
};

export const createUser = (data: {
    name: string;
    email: string;
    password: string;
}) => {
    return apiClient.post('/users', data);
};

export const updateMemberPermissions = (
    memberId: string,
    permissions: string[],
) => {
    return apiClient.patch(`/users/${memberId}/permissions`, { permissions });
};
