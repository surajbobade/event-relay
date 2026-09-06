import { create } from 'zustand';
import type { Business } from '../types/Business';

type BusinessState = {
    business: Business | null;
    isLoading: boolean;

    setBusiness: (business: Business | null) => void;
    setLoading: (isLoading: boolean) => void;
};

export const useBusinessStore = create<BusinessState>((set) => ({
    business: null,
    isLoading: true,

    setBusiness: (business) =>
        set({
            business,
        }),

    setLoading: (isLoading) =>
        set({
            isLoading,
        }),
}));
