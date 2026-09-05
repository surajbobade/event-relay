import { Routes, Route } from 'react-router-dom';

import { Login } from '../pages/auth/Login';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { Register } from '../pages/auth/Register';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Webhooks } from '../pages/webhooks/Webhooks';
import { WebhookCreate } from '../pages/webhooks/WebhookCreate';
import { ApiKeys } from '../pages/api-keys/ApiKeys';
import { Events } from '../pages/events/Events';

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

            {/* Protected */}
            <Route
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }>
                <Route path="/" element={<Dashboard />} />
                <Route path='/webhooks' element={<Webhooks />} />
                <Route path='/webhooks/create' element={<WebhookCreate />} />
                <Route path='/api-keys' element={<ApiKeys />} />
                <Route path='/events' element={<Events />} />
            </Route>
        </Routes>
    );
}
