import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const GEMINI_PATH = '/api/gemini';
const GEMINI_TARGET = 'https://generativelanguage.googleapis.com';
const DEFAULT_MODEL_PATH = '/v1/models/gemini-2.0-flash:generateContent';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiKey = env.VITE_GEMINI_API_KEY;
  const modelPath = env.VITE_GEMINI_MODEL_PATH || DEFAULT_MODEL_PATH;

  console.log('[vite.config] API Key loaded:', apiKey ? '✓ (hidden)' : '✗ Missing');
  console.log('[vite.config] Model Path:', modelPath);

  return {
    base: mode === 'production' ? '/FortuneCrack/' : '/',
    plugins: [
      react(),
      {
        name: 'local-gemini-proxy',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            // API 경로가 아니면 다음 미들웨어로
            if (!req.url?.startsWith(GEMINI_PATH)) return next();

            console.log('[local-gemini-proxy] Request received:', req.method, req.url);

            if (req.method === 'OPTIONS') {
              res.statusCode = 204;
              res.end();
              return;
            }

            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            if (!apiKey) {
              console.error('[local-gemini-proxy] API Key is missing!');
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Missing VITE_GEMINI_API_KEY' }));
              return;
            }

            try {
              const chunks: Buffer[] = [];
              for await (const chunk of req) {
                chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
              }
              const body = Buffer.concat(chunks).toString() || '{}';
              const targetUrl = `${GEMINI_TARGET}${modelPath}?key=${apiKey}`;

              console.log('[local-gemini-proxy] Forwarding to:', `${GEMINI_TARGET}${modelPath}`);

              const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body,
              });

              console.log('[local-gemini-proxy] Response status:', response.status);

              const text = await response.text();
              res.statusCode = response.status;
              res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
              res.end(text);
            } catch (error) {
              console.error('[local-gemini-proxy] error', error);
              res.statusCode = 502;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Gemini proxy failed' }));
            }
          });
        },
      },
    ],
  }
})
