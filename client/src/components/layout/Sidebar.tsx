import {
    LayoutDashboard,
    Webhook,
    Activity,
    LogOut,
    PanelLeftOpen,
    PanelLeftClose,
    type LucideIcon,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { logout } from '../../api/auth';
import { useCallback } from 'react';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '../../types/Api';

type SidebarProps = {
    collapsed: boolean;
    toggleCollapsed: () => void;
};

type SidebarLinkProps = {
    to: string;
    icon: LucideIcon;
    label: string;
    collapsed: boolean;
    end?: boolean;
};

export function SidebarLink({
    to,
    icon: Icon,
    label,
    collapsed,
    end = false,
}: SidebarLinkProps) {
    return (
        <NavLink
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
                `group flex items-center rounded-lg px-4 py-3 transition-all duration-200 ${
                    collapsed ? 'justify-center' : 'gap-3'
                } ${
                    isActive
                        ? 'bg-[var(--primary)] text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
            }>
            <Icon size={20} className="flex-shrink-0" />
            <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${
                    collapsed
                        ? 'max-w-0 opacity-0'
                        : 'max-w-[200px] opacity-100'
                }`}>
                {label}
            </span>
        </NavLink>
    );
}

export function Sidebar({ collapsed, toggleCollapsed }: SidebarProps) {
    const { logout: logoutState } = useAuth();

    const handleLogout = useCallback(async () => {
        try {
            await logout();
            logoutState();
        } catch (err: unknown) {
            const error = err as AxiosError<ApiErrorResponse>;
            toast.error(
                error.response?.data?.message ||
                    error.message ||
                    'Something went wrong.',
            );
        }
    }, [logoutState]);

    return (
        <aside
            className={`flex flex-col border-r border-gray-800 bg-gray-900 transition-all duration-300 ${
                collapsed ? 'w-20' : 'w-64'
            }`}>
            <div className="flex h-20 items-center justify-between border-b border-gray-800 px-5">
                {!collapsed ? (
                    <div>
                        <h1 className="text-xl font-bold text-[var(--primary)]">
                            Event Relay
                        </h1>

                        <p className="text-xs text-gray-400">
                            Event Delivery Infrastructure
                        </p>
                    </div>
                ) : (
                    <Webhook
                        size={28}
                        className="mx-auto text-[var(--primary)]"
                    />
                )}
                <button
                    onClick={toggleCollapsed}
                    className="rounded-lg p-2 hover:bg-gray-800">
                    {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
                </button>
            </div>

            <nav className="flex-1 space-y-2 p-4">
                <SidebarLink
                    to="/"
                    icon={LayoutDashboard}
                    label="Dashboard"
                    collapsed={collapsed}
                    end
                />
                <SidebarLink
                    to="/webhooks"
                    icon={Webhook}
                    label="Webhooks"
                    collapsed={collapsed}
                />
                <SidebarLink
                    to="/events"
                    icon={Activity}
                    label="Events"
                    collapsed={collapsed}
                />
            </nav>
            <div className="border-t border-gray-800 p-4">
                <button
                    onClick={handleLogout}
                    className={`flex w-full items-center rounded-lg px-4 py-3 transition hover:bg-[var(--danger)] ${
                        collapsed ? 'justify-center' : 'gap-3'
                    }`}
                    >
                    <LogOut size={20} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
