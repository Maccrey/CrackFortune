export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight 요청 처리
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.VITE_GEMINI_API_KEY;
  const modelPath = process.env.VITE_GEMINI_MODEL_PATH || '/v1/models/gemini-2.0-flash:generateContent';

  if (!apiKey) {
    res.status(500).json({ error: 'Missing VITE_GEMINI_API_KEY' });
    return;
  }

  try {
    const targetUrl = `https://generativelanguage.googleapis.com${modelPath}?key=${apiKey}`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('[Vercel API] Gemini proxy error:', error);
    res.status(502).json({ error: 'Gemini proxy failed' });
  }
}
