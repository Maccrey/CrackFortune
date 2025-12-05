import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const GEMINI_PATH = '/api/gemini';
const GEMINI_TARGET = 'https://generativelanguage.googleapis.com';
const DEFAULT_MODEL_PATH = '/v1beta/models/gemini-2.0-flash-latest:generateContent';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.VITE_GEMINI_API_KEY;
  const modelPath = env.VITE_GEMINI_MODEL_PATH || DEFAULT_MODEL_PATH;

  return {
    plugins: [react()],
    server: {
      proxy: {
        [GEMINI_PATH]: {
          target: GEMINI_TARGET,
          changeOrigin: true,
          secure: true,
          rewrite: () => modelPath,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (apiKey) {
                proxyReq.setHeader('x-goog-api-key', apiKey);
              }
            });
          },
        },
      },
    },
  }
})
