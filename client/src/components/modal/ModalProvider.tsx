import { useCallback, useMemo, useState } from 'react';

import { ModalContext, type ModalComponent } from './ModalContext';

type ModalState = {
    component: ModalComponent<any> | null;
    props: any;
};

type Props = {
    children: React.ReactNode;
};

export function ModalProvider({ children }: Props) {
    const [modal, setModal] = useState<ModalState>({
        component: null,
        props: {},
    });

    const closeModal = useCallback(() => {
        setModal({
            component: null,
            props: {},
        });
    }, []);

    const openModal = useCallback(
        <P,>({
            component,
            props,
        }: {
            component: ModalComponent<P>;
            props?: P;
        }) => {
            setModal({
                component,
                props: props ?? {},
            });
        },
        [],
    );

    const value = useMemo(
        () => ({
            openModal,
            closeModal,
        }),
        [openModal, closeModal],
    );

    const Component = modal.component;

    return (
        <ModalContext.Provider value={value}>
            {children}

            {Component && <Component {...modal.props} onClose={closeModal} />}
        </ModalContext.Provider>
    );
}
