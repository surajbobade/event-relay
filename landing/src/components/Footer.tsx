import { ExternalLink, Mail, Webhook } from 'lucide-react';

const AUTHOR_NAME = 'Suraj Bobade';
const AUTHOR_EMAIL = 'surajbbd.in@gmail.com';
const AUTHOR_LINKEDIN = 'https://www.linkedin.com/in/surajbbd2811/';

export function Footer() {
    return (
        <footer className="border-t border-gray-800 px-6 py-10">
            <div className="mx-auto max-w-6xl">
                <div className="flex flex-col items-center justify-between gap-4 text-sm text-gray-500 sm:flex-row">
                    <div className="flex items-center gap-2">
                        <Webhook className="h-4 w-4 text-[var(--primary)]" />
                        <span className="font-semibold text-gray-300">
                            Event Relay
                        </span>
                    </div>

                    <p>
                        &copy; {new Date().getFullYear()} Event Relay. All
                        rights reserved.
                    </p>
                </div>

                <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-gray-800 pt-6 text-sm text-gray-500 sm:flex-row">
                    <p>
                        Built by{' '}
                        <span className="text-gray-300">{AUTHOR_NAME}</span>
                    </p>

                    <div className="flex items-center gap-4">
                        <a
                            href={`mailto:${AUTHOR_EMAIL}`}
                            className="inline-flex items-center gap-1.5 transition hover:text-white">
                            <Mail className="h-4 w-4" />
                            {AUTHOR_EMAIL}
                        </a>

                        <a
                            href={AUTHOR_LINKEDIN}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 transition hover:text-white">
                            <ExternalLink className="h-4 w-4" />
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
