import {fileURLToPath, URL} from 'node:url'

import {defineConfig, loadEnv} from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {

    const env = loadEnv(mode, process.cwd(), '')

    return {
        base: '/',
        plugins: [
            vue(),
            tailwindcss(),
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        server: {
            open: true,
            host: '0.0.0.0',
            allowedHosts: '*',
            port: 3000,
            proxy: {
                '/resource-server': {
                    target: env.VITE_API_URL,
                    changeOrigin: true,
                    secure: false,
                    rewrite: path => path.replace(/^\/resource-server/, ''),
                },
            },
        },
    }
})
