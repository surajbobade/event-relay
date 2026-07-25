import { createContext } from 'react';
import type { User } from '../types/User';

type AuthContextType = {
    user: User | null;
    loginUser: (email: string, password: string) => Promise<void>;
    logoutUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
