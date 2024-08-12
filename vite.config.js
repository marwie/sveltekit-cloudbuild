import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig(async ({ command }) => {
    const { needlePlugins, useGzip, loadConfig } = await import("@needle-tools/engine/plugins/vite/index.js");
    const needleConfig = await loadConfig();
    
    return {
        plugins: [
            mkcert(),
            needlePlugins(command, needleConfig, {
                buildPipeline: {
                }
            }),
            sveltekit(),
        ],
        server: {
            port: 3000,
            proxy: {},
            fs: {
                strict: false,
            },
        },
        build: {
            emptyOutDir: true,
        }
    }
});