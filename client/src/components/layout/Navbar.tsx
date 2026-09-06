import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
    const { user } = useAuth();

    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-8">
            <div className="relative w-96" />
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] font-semibold">
                        {user?.profile?.name?.charAt(0).toUpperCase() ?? 'U'}
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-medium">{user?.profile?.name}</span>

                        {user?.role && (
                            <span className="inline-flex items-center rounded-full bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-300 capitalize">
                                {user.role}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
