import type { GeneratedFortune } from '../../domain/repositories/fortuneGenerator';
import type { UserProfile } from '../../domain/entities/user';

interface GeminiResponse {
  summary: string;
  fullText: string;
  color: string;
  precision: GeneratedFortune['precision'];
  model: string;
  keywords?: string[];
}

const palette = ['#eab308', '#22d3ee', '#a855f7', '#f97316', '#10b981'];

const pickColor = (user: UserProfile) => {
  const seed = (user.name || user.id || '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return palette[Math.abs(seed) % palette.length];
};

export class GeminiClient {
  private readonly endpoint?: string;
  private readonly apiKey?: string;

  constructor(endpoint = import.meta.env.VITE_GEMINI_ENDPOINT, apiKey = import.meta.env.VITE_GEMINI_API_KEY) {
    const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    this.endpoint = isLocal ? '/api/gemini' : endpoint;
    this.apiKey = apiKey;
  }

  async requestDailyFortune(user: UserProfile, date: string): Promise<GeminiResponse> {
    const isRelative = this.endpoint?.startsWith('/');
    if (!this.endpoint || (!isRelative && !this.apiKey)) {
      throw new Error('Gemini 설정을 확인해주세요. (VITE_GEMINI_ENDPOINT, VITE_GEMINI_API_KEY)');
    }

    try {
      const prompt = `locale:${user.locale}\nname:${user.name}\nbirthDate:${user.birthDate}\nbirthTime:${user.birthTime}\nprecision:${user.birthTimeAccuracy}\ndate:${date}\n`;

      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(isRelative ? {} : { 'x-api-key': this.apiKey }),
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${prompt}\n오늘의 운세를 1) summary(한 줄) 2) fullText(3~4문장) 3) color(HEX) 로 JSON 형태로 응답해 주세요.`
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini request failed: ${response.status}`);
      }

      const data = (await response.json()) as GeminiResponse;
      return {
        ...data,
        color: data.color || pickColor(user),
      };
    } catch (error) {
      console.warn('[GeminiClient] Gemini 호출 실패', error);
      throw new Error('Gemini 호출에 실패했습니다. 엔드포인트/키 또는 네트워크를 확인해주세요.');
    }
  }
}
