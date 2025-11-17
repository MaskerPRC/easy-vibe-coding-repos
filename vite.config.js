import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()],
    server: {
        port: 5173,
        host: '0.0.0.0',
        hmr: {
            overlay: false,
            // 修复反向代理环境下的 HMR WebSocket 连接问题
            protocol: 'wss',
            host: 'playapp.apexstone.ai',
            clientPort: 443
        },
        proxy: {
            '/api': {
                target: 'http://localhost:3002',
                changeOrigin: true
            },
            // WebSocket 代理配置
            '/ws': {
                target: 'ws://localhost:5173',
                ws: true
            }
        }
    }
});

