import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

import dotenv from "dotenv";
dotenv.config();

import { sveltekit } from '@sveltejs/kit/vite';

// https://github.com/sapphi-red/vite-plugin-static-copy#usage
import { viteStaticCopy } from 'vite-plugin-static-copy'

const files = [];

export default defineConfig(async ({ command }) => {
    const { needlePlugins, useGzip, loadConfig } = await import("@needle-tools/engine/plugins/vite/index.js");
    const needleConfig = await loadConfig();

    if(!process.env.NEEDLE_CLOUD_TOKEN){
        throw new Error("NEEDLE_CLOUD_TOKEN is not set in the environment variables.");
    }
    return {
        plugins: [
            mkcert(),
            // useGzip(needleConfig) ? viteCompression({ deleteOriginFile: true }) : null,
            needlePlugins(command, needleConfig, {
                noCopy: true,
                buildPipeline: {
                    accessToken: process.env.NEEDLE_CLOUD_TOKEN,
                    verbose: true,
                }
            }),
            viteStaticCopy({
                targets: files.map((file) => {
                    return {
                        src: file.path,
                        dest: "downloads",
                    }
                }),
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
            keepNames: true,
        }
    }
});