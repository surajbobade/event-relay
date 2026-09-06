import type { PropsWithChildren, ReactNode } from 'react';
import { Webhook } from 'lucide-react';

type AuthLayoutProps = PropsWithChildren<{
    title: string | ReactNode;
    subtitle?: string;
    footer?: ReactNode;
}>;

export function AuthLayout({
    title,
    subtitle,
    footer,
    children,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-6 flex flex-col items-center">
                    <Webhook size={28} className="text-[var(--primary)]" />

                    <span className="mt-2 text-lg font-bold text-gray-900">
                        Event Relay
                    </span>
                </div>

                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
                    )}
                </div>

                {children}

                {footer && (
                    <div className="mt-6 border-t border-gray-200 pt-4">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
