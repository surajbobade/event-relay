import { Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export function Navbar() {
    const { user } = useAuth();

    return (
        <header className="flex h-16 items-center justify-between border-b border-gray-800 bg-gray-900 px-8">
            <div className="relative w-96">
                {/* <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                /> */}
            </div>
            <div className="flex items-center gap-5">
                <button className="relative rounded-full p-2 hover:bg-gray-800">
                    <Bell size={20} />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--danger)]" />
                </button>
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] font-semibold">
                        {user?.profile?.name?.charAt(0).toUpperCase() ?? 'U'}
                    </div>

                    <div>
                        <div className="font-medium">{user?.profile?.name}</div>
                    </div>
                </div>
            </div>
        </header>
    );
}
