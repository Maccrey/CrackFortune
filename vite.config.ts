import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const GEMINI_PATH = '/api/gemini';
const GEMINI_TARGET = 'https://generativelanguage.googleapis.com';
const GEMINI_MODEL_PATH = '/v1beta/models/gemini-2.0-flash:generateContent';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.VITE_GEMINI_API_KEY;

  return {
    plugins: [react()],
    server: {
      proxy: {
        [GEMINI_PATH]: {
          target: GEMINI_TARGET,
          changeOrigin: true,
          secure: true,
          rewrite: () => GEMINI_MODEL_PATH,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (apiKey) {
                proxyReq.setHeader('x-api-key', apiKey);
              }
            });
          },
        },
      },
    },
  }
})
