import { CreateEndpointModal } from '../endpoints/EndpointCreateModal';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';

import { useCallback, useEffect, useState, type ReactNode } from 'react';

type DashboardLayoutProps = {
    children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [isCreateEndpointOpen, setIsCreateEndpointOpen] = useState(false);

    useEffect(() => {
        const value = localStorage.getItem('sidebar-collapsed');
        if (value) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setCollapsed(JSON.parse(value));
        }
    }, []);

    const toggleCollapsed = useCallback(() => {
        setCollapsed((prev) => {
            localStorage.setItem('sidebar-collapsed', JSON.stringify(!prev));

            return !prev;
        });
    }, []);

    const toggleCreateEndpointModal = useCallback(() => {
        setIsCreateEndpointOpen((prev) => !prev);
    }, []);

    return (
        <>
            <div className="flex h-screen bg-gray-950 text-white">
                <Sidebar
                    collapsed={collapsed}
                    toggleCollapsed={toggleCollapsed}
                />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <Navbar
                        toggleCreateEndpointModal={toggleCreateEndpointModal}
                    />
                    <main className="flex-1 overflow-y-auto p-8">
                        {children}
                    </main>
                </div>
            </div>
            <CreateEndpointModal
                open={isCreateEndpointOpen}
                onClose={toggleCreateEndpointModal}
            />
        </>
    );
}
