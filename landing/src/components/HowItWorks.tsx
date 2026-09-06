const STEPS = [
    {
        number: '01',
        title: 'Create an API key',
        description:
            'Generate a scoped key from your dashboard. You\'ll only see the full key once, so store it with your backend secrets.',
    },
    {
        number: '02',
        title: 'Register a webhook',
        description:
            'Point it at your endpoint and subscribe it to the event types it should receive — order.created, payment.failed, whatever you emit.',
    },
    {
        number: '03',
        title: 'Send us your events',
        description:
            'POST { event, payload } to our API with your key. We match it against every subscribed webhook on your account.',
    },
    {
        number: '04',
        title: 'We deliver, you watch',
        description:
            'Each match gets its own delivery, with automatic retries on failure. Every attempt shows up live on your Events page.',
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="border-t border-gray-800 px-6 py-24">
            <div className="mx-auto max-w-6xl">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        How it works
                    </h2>

                    <p className="mt-4 text-gray-400">
                        From your first event to a delivered webhook, in four
                        steps.
                    </p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {STEPS.map(({ number, title, description }) => (
                        <div key={number}>
                            <span className="text-3xl font-bold text-gray-700">
                                {number}
                            </span>

                            <h3 className="mt-3 text-base font-semibold text-white">
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
