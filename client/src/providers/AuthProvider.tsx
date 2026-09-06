import { useEffect, type ReactNode } from 'react';

import { refreshToken } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { useBusiness } from '../hooks/useBusiness';
import { getMe } from '../api/users';
import { getMyBusiness } from '../api/business';

type Props = {
    children: ReactNode;
};

export function AuthProvider({ children }: Props) {
    const { setUser, setAccessToken, setLoading } = useAuth();
    const { setBusiness, setLoading: setBusinessLoading } = useBusiness();

    useEffect(() => {
        const initAuth = async () => {
            try {
                const tokenResponse = await refreshToken();
                setAccessToken(tokenResponse.data.accessToken);

                const meResponse = await getMe();
                setUser(meResponse.data);

                const businessResponse = await getMyBusiness();
                setBusiness(businessResponse.data);
            } catch {
                setUser(null);
                setAccessToken(null);
                setBusiness(null);
            } finally {
                setLoading(false);
                setBusinessLoading(false);
            }
        };

        initAuth();
    }, [setUser, setAccessToken, setLoading, setBusiness, setBusinessLoading]);

    return <>{children}</>;
}
