import { useAuth } from './useAuth';

export const usePermissions = () => {
    const { user } = useAuth();

    const isAdmin = user?.role === 'admin';

    const hasPermission = (permission: string) => {
        if (!user) {
            return false;
        }

        if (isAdmin) {
            return true;
        }

        return user.p?.includes(permission) ?? false;
    };

    return {
        isAdmin,
        hasPermission,
    };
};
