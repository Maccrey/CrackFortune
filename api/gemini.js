// Vercel Serverless Function: Gemini Proxy
// 요청 본문을 그대로 Gemini API로 전달하며, API 키는 서버 환경변수(GEMINI_API_KEY)로 보호합니다.

const TARGET_PATH = '/v1beta/models/gemini-2.0-flash:generateContent';
const TARGET_HOST = 'https://generativelanguage.googleapis.com';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-api-key');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY is not set' });
    return;
  }

  try {
    const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
    const targetUrl = `${TARGET_HOST}${TARGET_PATH}?key=${apiKey}`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: payload,
    });

    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    console.error('Gemini proxy error', error);
    res.status(502).json({ error: 'Failed to reach Gemini API' });
  }
}
