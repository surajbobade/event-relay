import { Webhook } from 'lucide-react';
import { LOGIN_URL, SIGNUP_URL } from '../constants';

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                <div className="flex items-center gap-2.5">
                    <Webhook className="h-6 w-6 text-[var(--primary)]" />
                    <span className="text-lg font-bold text-white">
                        Event Relay
                    </span>
                </div>

                <nav className="hidden items-center gap-8 text-sm font-medium text-gray-300 md:flex">
                    <a href="#features" className="transition hover:text-white">
                        Features
                    </a>
                    <a
                        href="#how-it-works"
                        className="transition hover:text-white">
                        How it works
                    </a>
                </nav>

                <div className="flex items-center gap-3">
                    <a
                        href={LOGIN_URL}
                        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition hover:text-white">
                        Log In
                    </a>

                    <a
                        href={SIGNUP_URL}
                        className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-gray-950 transition hover:bg-[var(--primary-hover)] hover:text-white">
                        Sign Up
                    </a>
                </div>
            </div>
        </header>
    );
}
