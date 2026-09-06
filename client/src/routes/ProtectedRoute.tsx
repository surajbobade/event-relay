import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBusiness } from '../hooks/useBusiness';

type Props = {
    children: ReactNode;
    requireBusinessSetup?: boolean;
};

export function ProtectedRoute({
    children,
    requireBusinessSetup = true,
}: Props) {
    const { user, isLoading } = useAuth();
    const { business, isLoading: businessLoading } = useBusiness();

    if (isLoading || (requireBusinessSetup && businessLoading)) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (requireBusinessSetup && !business?.n) {
        return <Navigate to="/business-setup" replace />;
    }

    return <>{children}</>;
}
