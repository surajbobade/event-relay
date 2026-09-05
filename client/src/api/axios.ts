import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../stores/authStore';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

type RetriableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

let refreshPromise: Promise<string> | null = null;

const refreshAccessToken = () => {
    if (!refreshPromise) {
        refreshPromise = axios
            .post<{ accessToken: string }>(
                `${import.meta.env.VITE_SERVER_URL}/auth/refresh`,
                undefined,
                { withCredentials: true },
            )
            .then((res) => {
                const { accessToken } = res.data;
                useAuthStore.getState().setAccessToken(accessToken);
                return accessToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as
            | RetriableRequestConfig
            | undefined;

        // Only bearer-authenticated calls carry this header — login,
        // register, and the refresh call itself never do, so this
        // naturally excludes them from the retry loop.
        const hadAuthHeader = Boolean(originalRequest?.headers?.Authorization);

        if (
            error.response?.status === 401 &&
            originalRequest &&
            hadAuthHeader &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const accessToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);
