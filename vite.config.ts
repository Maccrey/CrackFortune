import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.VITE_GEMINI_API_KEY;
  const modelPath = env.VITE_GEMINI_MODEL_PATH || '/v1/models/gemini-2.0-flash:generateContent';

  console.log('[vite.config] API Key loaded:', apiKey ? '✓ (hidden)' : '✗ Missing');
  console.log('[vite.config] Model Path:', modelPath);

  return {
    base: '/',
    plugins: [react()],
  }
})
