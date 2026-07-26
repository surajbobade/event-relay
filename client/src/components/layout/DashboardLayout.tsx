import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

import { useCallback, useEffect, useState } from 'react';

export function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);

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

    return (
        <>
            <div className="flex h-screen bg-gray-950 text-white">
                <Sidebar
                    collapsed={collapsed}
                    toggleCollapsed={toggleCollapsed}
                />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <Navbar />
                    <main className="flex-1 overflow-y-auto p-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
}
