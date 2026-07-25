import { Routes, Route } from 'react-router-dom';

import { Login } from '../pages/auth/Login';
import { Home } from '../pages/dashboard/Home';
import { Register } from '../pages/auth/Register';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
