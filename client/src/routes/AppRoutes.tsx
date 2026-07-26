import { Routes, Route } from 'react-router-dom';

import { Login } from '../pages/auth/Login';
import { Dashboard } from '../pages/dashboard/Dashboard';
import { Register } from '../pages/auth/Register';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Endpoints } from '../pages/endpoints/Endpoints';
import { EndpointDetails } from '../pages/endpoints/EndpointDetails';

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
                <Route path="/endpoints" element={<Endpoints />} />
                <Route
                    path="/endpoints/:endpointId"
                    element={<EndpointDetails />}
                />
            </Route>
        </Routes>
    );
}
