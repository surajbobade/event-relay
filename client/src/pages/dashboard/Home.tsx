import { useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../api/auth';

export function Home() {
    const { user, logout: setLogoutState } = useAuth();

    const logUserOut = useCallback(async () => {
        try {
            await logout();
            setLogoutState();
        } catch (err) {
            console.log(err);
        }
    }, [setLogoutState]);

    return (
        <div>
            <h1>Welcome {user?.email}</h1>
            <button onClick={logUserOut}>Logout</button>
        </div>
    );
}
