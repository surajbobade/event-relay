import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        plugins: [react(), tailwindcss()],
        server: {
            // Proxies API calls through the same origin as the dev
            // server, so the refresh-token cookie is same-site from the
            // browser's perspective. Without this, the client
            // (localhost:5173) and server (localhost:3000) are
            // cross-origin, requiring SameSite=None cookies — which
            // Safari's ITP frequently blocks/purges even on localhost,
            // even though Chrome tolerates it.
            //
            // Prefix is "/__api" (not "/api") because Vite/http-proxy
            // matches by string prefix, not path segment — a plain
            // "/api" prefix would also swallow real client routes like
            // "/api-keys" on a hard refresh.
            proxy: {
                '/__api': {
                    target: env.VITE_SERVER_URL || 'http://localhost:3000',
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/__api/, ''),
                },
            },
        },
    };
});
