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
    plugins: [
      react(),
      {
        name: 'local-gemini-proxy',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (!req.url?.startsWith(GEMINI_PATH)) return next();

            if (req.method === 'OPTIONS') {
              res.statusCode = 204;
              res.end();
              return;
            }

            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end();
              return;
            }

            if (!apiKey) {
              res.statusCode = 500;
              res.end('Missing VITE_GEMINI_API_KEY');
              return;
            }

            try {
              const chunks: Buffer[] = [];
              for await (const chunk of req) {
                chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
              }
              const body = Buffer.concat(chunks).toString() || '{}';
              const targetUrl = `${GEMINI_TARGET}${modelPath}?key=${apiKey}`;

              const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body,
              });

              res.statusCode = response.status;
              res.setHeader('Content-Type', response.headers.get('content-type') || 'application/json');
              const text = await response.text();
              res.end(text);
            } catch (error) {
              console.error('[local-gemini-proxy] error', error);
              res.statusCode = 502;
              res.end('Gemini proxy failed');
            }
          });
        },
      },
    ],
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
