import { defineConfig, loadEnv } from 'vite';
import { resolve, join } from 'path';
import react from '@vitejs/plugin-react'
import path from 'path';


export default defineConfig((mode) => {
    const env = loadEnv(mode, process.cwd(), '');
    console.log("***##" + path.resolve(__dirname, '..', 'node_modules/bootstrap'))
    const INPUT_DIR = './babblebox/static/vite_assets';
    const OUTPUT_DIR =  './babblebox/static/vite_assets_dist';
    console.log("Input directory" + join(INPUT_DIR, '/js/apps/vendors.js'))

    return {
        plugins: [react(      {fastRefresh: false})],
        root: resolve(INPUT_DIR),
        base: '/static/',
        server: {
            host: '0.0.0.0',
            port: 5173,
        },
        resolve: {
            alias: {
                '~bootstrap' : path.resolve(__dirname, '..', 'node_modules/bootstrap'),
            }
        },
        build: {
            manifest: true,
            emptyOutDir: true,
            outDir: resolve(OUTPUT_DIR),
            rollupOptions: {
                input: {
                    vendors: join(INPUT_DIR, '/js/apps/vendors.js'),
                    project: join(INPUT_DIR, '/js/apps/project.js'),
                    home: join(INPUT_DIR, '/js/apps/home.js'),
                    css: join(INPUT_DIR, '/css/project.css'),
                    page: join(INPUT_DIR, 'js/chat-home/index.tsx')
                },
            },
        },
    };
});
