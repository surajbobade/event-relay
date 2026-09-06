import { ArrowRight, Zap } from 'lucide-react';
import { SIGNUP_URL } from '../constants';

export function Hero() {
    return (
        <section className="relative overflow-hidden px-6 pt-20 pb-24 text-center">
            <div
                className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-96 opacity-20 blur-3xl"
                style={{
                    background:
                        'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
                }}
            />

            <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-gray-800 bg-gray-900 px-3 py-1 text-xs font-medium text-gray-300">
                <Zap className="h-3.5 w-3.5 text-[var(--primary)]" />
                Built for developers who ship webhooks
            </span>

            <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Reliable event delivery,{' '}
                <span className="text-[var(--primary)]">without the pain</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400">
                Send us your events over a simple API. We match them to your
                webhooks, retry failed deliveries automatically, and give you
                a live view of everything in flight.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                    href={SIGNUP_URL}
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-gray-950 shadow-lg shadow-[var(--primary)]/20 transition hover:bg-[var(--primary-hover)] hover:text-white">
                    Get Started Free
                    <ArrowRight className="h-4 w-4" />
                </a>

                <a
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-700 px-6 py-3 text-sm font-semibold text-gray-200 transition hover:bg-gray-900">
                    See how it works
                </a>
            </div>
        </section>
    );
}
