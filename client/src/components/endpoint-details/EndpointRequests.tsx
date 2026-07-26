import { Copy, Send, Inbox } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { Button } from '../../forms/auth/Button';
import type { EndpointDetails } from '../../types/Enpoint';

type Props = {
    endpoint: EndpointDetails;
};

export function EmptyRequests({ endpoint }: Props) {
    const endpointUrl = `https://${endpoint.domain}.requeststudio.com`;

    const copyEndpoint = useCallback(async () => {
        await navigator.clipboard.writeText(endpointUrl);
        toast.success('Endpoint URL copied.');
    }, [endpointUrl]);

    const sendTestRequest = useCallback(async () => {
        // TODO:
        // await sendTestRequest(endpoint._id);

        toast.success('Test request sent.');
    }, []);

    return (
        <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-900 px-8 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)]/10">
                <Inbox
                    size={30}
                    className="text-[var(--primary)]"
                />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
                Waiting for your first request
            </h2>

            <p className="mx-auto mt-3 max-w-2xl text-gray-400">
                Your endpoint is live and ready to receive HTTP
                requests. Send a request using Postman, curl,
                your application, or try a sample request.
            </p>

            <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-gray-800 bg-gray-950 p-5">
                <div className="mb-2 text-left text-xs uppercase tracking-wide text-gray-500">
                    Endpoint URL
                </div>

                <div className="overflow-x-auto rounded-lg bg-black/30 px-4 py-3 font-mono text-sm text-[var(--primary)]">
                    {endpointUrl}
                </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
                <Button
                    variant="primary"
                    className="w-auto px-5"
                    onClick={copyEndpoint}>
                    <Copy size={18} />
                    <span className="ml-2">Copy URL</span>
                </Button>

                <Button
                    variant="white"
                    className="w-auto px-5"
                    onClick={sendTestRequest}>
                    <Send size={18} />
                    <span className="ml-2">
                        Send Test Request
                    </span>
                </Button>
            </div>

            <div className="mt-10 rounded-xl border border-gray-800 bg-gray-950 p-6 text-left">
                <h3 className="mb-4 font-semibold">
                    Quick start
                </h3>

                <div className="overflow-x-auto rounded-lg bg-black px-4 py-3">
                    <code className="font-mono text-sm text-gray-300">
                        curl -X POST {endpointUrl}
                        {' \\'}
                        <br />
                        &nbsp;&nbsp;-H "Content-Type:
                        application/json" {'\\'}
                        <br />
                        &nbsp;&nbsp;-d '{"{"}"message":"Hello
                        Request Studio!"{"}"}'
                    </code>
                </div>
            </div>
        </div>
    );
}
