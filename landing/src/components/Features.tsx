import {
    Activity,
    KeyRound,
    LayoutDashboard,
    RefreshCw,
    Users,
    Webhook,
} from 'lucide-react';

const FEATURES = [
    {
        icon: Webhook,
        title: 'Webhook Management',
        description:
            'Register endpoints, subscribe them to specific event types, and toggle them on or off without touching your backend.',
    },
    {
        icon: KeyRound,
        title: 'Secure API Keys',
        description:
            'Ingest events with a scoped API key. Revoke access instantly whenever you need to, no code changes required.',
    },
    {
        icon: RefreshCw,
        title: 'Automatic Retries',
        description:
            'Failed deliveries retry with exponential backoff — up to five attempts — so a brief outage on your side never means a lost event.',
    },
    {
        icon: Activity,
        title: 'Live Delivery Tracking',
        description:
            'Watch every event and every delivery attempt update in real time, with full request/response detail for each try.',
    },
    {
        icon: Users,
        title: 'Team & Permissions',
        description:
            'Invite teammates as Admins or Members, and grant granular per-resource permissions — view or manage, your call.',
    },
    {
        icon: LayoutDashboard,
        title: 'At-a-Glance Dashboard',
        description:
            "See today's received, successful, and failed deliveries the moment they happen — no refresh needed.",
    },
];

export function Features() {
    return (
        <section id="features" className="px-6 py-24">
            <div className="mx-auto max-w-6xl">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Everything you need to relay events
                    </h2>

                    <p className="mt-4 text-gray-400">
                        One API in, reliably delivered out — with the
                        visibility and controls a production system demands.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map(({ icon: Icon, title, description }) => (
                        <div
                            key={title}
                            className="rounded-xl border border-gray-800 bg-gray-900/50 p-6 transition hover:border-gray-700 hover:bg-gray-900">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary)]/10">
                                <Icon className="h-5 w-5 text-[var(--primary)]" />
                            </div>

                            <h3 className="text-base font-semibold text-white">
                                {title}
                            </h3>

                            <p className="mt-2 text-sm text-gray-400">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
