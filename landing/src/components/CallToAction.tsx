import { ArrowRight } from 'lucide-react';
import { SIGNUP_URL } from '../constants';

export function CallToAction() {
    return (
        <section className="border-t border-gray-800 px-6 py-24">
            <div className="mx-auto max-w-3xl rounded-2xl border border-gray-800 bg-gray-900/50 px-8 py-16 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                    Stop babysitting webhook deliveries
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-gray-400">
                    Create your account, get an API key, and send your first
                    event in minutes.
                </p>

                <a
                    href={SIGNUP_URL}
                    className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-[var(--primary)]/20 transition hover:bg-[var(--primary-hover)] hover:text-white">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                </a>
            </div>
        </section>
    );
}
