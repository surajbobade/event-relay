export function Analytics() {
    return (
        <>
            <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-4 gap-6">
                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <p className="text-sm text-gray-400">Total Endpoints</p>

                    <h2 className="mt-3 text-4xl font-bold">0</h2>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <p className="text-sm text-gray-400">Requests Today</p>

                    <h2 className="mt-3 text-4xl font-bold">0</h2>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <p className="text-sm text-gray-400">Success Rate</p>

                    <h2 className="mt-3 text-4xl font-bold">100%</h2>
                </div>

                <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                    <p className="text-sm text-gray-400">API Keys</p>

                    <h2 className="mt-3 text-4xl font-bold">1</h2>
                </div>
            </div>
        </>
    );
}
