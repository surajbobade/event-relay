import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { usePermissions } from '../hooks/usePermissions';

type Props = {
    children: ReactNode;
    permission?: string;
    adminOnly?: boolean;
};

// Nests inside ProtectedRoute — assumes auth/business-setup are already
// verified, only checks the specific permission for this page.
export function PermissionGate({ children, permission, adminOnly }: Props) {
    const { isAdmin, hasPermission } = usePermissions();

    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    if (permission && !hasPermission(permission)) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
