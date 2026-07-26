import { Toaster } from 'sonner';
import { BrowserRouter } from 'react-router-dom';

import { AppRoutes } from './routes/AppRoutes';
import { AuthProvider } from './providers/AuthProvider';
import { ModalProvider } from './components/modal/ModalProvider';

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <ModalProvider>
                    <AppRoutes />
                    <Toaster richColors />
                </ModalProvider>
            </BrowserRouter>
        </AuthProvider>
    );
}
