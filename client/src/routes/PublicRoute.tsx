import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

type PublicRouteProps = {
    children: React.ReactNode;
};

export function PublicRoute({ children }: PublicRouteProps) {
    const { accessToken } = useAuth();

    if (accessToken) {
        return <Navigate to="/" replace />;
    }

    return children;
}
