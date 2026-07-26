import { createContext } from 'react';

export type ModalComponent<P = Record<string, never>> = React.ComponentType<
    P & { onClose: () => void }
>;

type ModalContextType = {
    openModal: <P>(p: { component: ModalComponent<P>; props?: P }) => void;
    closeModal: () => void;
};

export const ModalContext = createContext<ModalContextType | null>(null);
