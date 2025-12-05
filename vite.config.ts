import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const GEMINI_PATH = '/api/gemini';
const GEMINI_TARGET = 'https://generativelanguage.googleapis.com';
const GEMINI_MODEL_PATH = '/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

// https://vite.dev/config/
export default defineConfig({
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
            if (GEMINI_API_KEY) {
              proxyReq.setHeader('x-api-key', GEMINI_API_KEY);
            }
          });
        },
      },
    },
  },
})
