import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 5173,
        host: '0.0.0.0',
        hmr: {
            overlay: false
        },
        proxy: {
            '/api': {
                target: 'http://localhost:3002',
                changeOrigin: true
            }
        }
    }
});

