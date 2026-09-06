import { useBusinessStore } from '../stores/businessStore';

export const useBusiness = () => {
    const business = useBusinessStore((state) => state.business);
    const isLoading = useBusinessStore((state) => state.isLoading);
    const setBusiness = useBusinessStore((state) => state.setBusiness);
    const setLoading = useBusinessStore((state) => state.setLoading);

    return {
        business,
        isLoading,
        setBusiness,
        setLoading,
    };
};
