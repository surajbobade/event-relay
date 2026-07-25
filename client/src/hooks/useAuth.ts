import { useAuthStore } from '../stores/authStore';

export const useAuth = () => {
    const user = useAuthStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);
    const setUser = useAuthStore((state) => state.setUser);
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const logout = useAuthStore((state) => state.logout);
    const setLoading = useAuthStore((state) => state.setLoading);
    const isLoading = useAuthStore((state) => state.isLoading);

    return {
        user,
        accessToken,
        setUser,
        setAccessToken,
        logout,
        setLoading,
        isLoading,
    };
};
