import { Routes, Route } from 'react-router-dom';

import { Login } from '../pages/auth/Login';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { Register } from '../pages/auth/Register';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { PermissionGate } from './PermissionGate';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Webhooks } from '../pages/webhooks/Webhooks';
import { WebhookCreate } from '../pages/webhooks/WebhookCreate';
import { WebhookEdit } from '../pages/webhooks/WebhookEdit';
import { ApiKeys } from '../pages/api-keys/ApiKeys';
import { Events } from '../pages/events/Events';
import { BusinessSetup } from '../pages/business/BusinessSetup';
import { Users } from '../pages/users/Users';
import { UserCreate } from '../pages/users/UserCreate';

export function AppRoutes() {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />

            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />

            <Route
                path="/business-setup"
                element={
                    <ProtectedRoute requireBusinessSetup={false}>
                        <BusinessSetup />
                    </ProtectedRoute>
                }
            />

            {/* Protected */}
            <Route
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }>
                <Route path="/" element={<Dashboard />} />
                <Route
                    path='/webhooks'
                    element={
                        <PermissionGate permission="webhooks:view">
                            <Webhooks />
                        </PermissionGate>
                    }
                />
                <Route
                    path='/webhooks/create'
                    element={
                        <PermissionGate permission="webhooks:manage">
                            <WebhookCreate />
                        </PermissionGate>
                    }
                />
                <Route
                    path='/webhooks/:webhookId/edit'
                    element={
                        <PermissionGate permission="webhooks:manage">
                            <WebhookEdit />
                        </PermissionGate>
                    }
                />
                <Route
                    path='/api-keys'
                    element={
                        <PermissionGate permission="api_keys:view">
                            <ApiKeys />
                        </PermissionGate>
                    }
                />
                <Route
                    path='/events'
                    element={
                        <PermissionGate permission="events:view">
                            <Events />
                        </PermissionGate>
                    }
                />
                <Route
                    path='/users'
                    element={
                        <PermissionGate adminOnly>
                            <Users />
                        </PermissionGate>
                    }
                />
                <Route
                    path='/users/create'
                    element={
                        <PermissionGate adminOnly>
                            <UserCreate />
                        </PermissionGate>
                    }
                />
            </Route>
        </Routes>
    );
}
