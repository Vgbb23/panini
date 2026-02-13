import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api/fruitfy': {
            target: 'https://api.fruitfy.io',
            changeOrigin: true,
            secure: true,
            rewrite: (p) => p.replace(/^\/api\/fruitfy/, '/api'),
            configure: (proxy) => {
              proxy.on('proxyReq', (proxyReq) => {
                proxyReq.setHeader('Authorization', `Bearer ${env.FRUITFY_API_TOKEN}`);
                proxyReq.setHeader('Store-Id', env.FRUITFY_STORE_ID);
              });
            }
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.FRUITFY_PRODUCT_ID': JSON.stringify(env.FRUITFY_PRODUCT_ID),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
