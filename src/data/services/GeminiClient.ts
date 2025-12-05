import type { GeneratedFortune } from '../../domain/repositories/fortuneGenerator';
import type { UserProfile } from '../../domain/entities/user';

interface GeminiResponse {
  summary: string;
  fullText: string;
  precision: GeneratedFortune['precision'];
  model: string;
  keywords?: string[];
}

const fallbackFortune: GeminiResponse = {
  summary: '새로운 여정이 당신을 부르고 있습니다.',
  fullText:
    '당신의 선택이 곧 큰 변화를 만들어낼 것입니다. 오늘은 작은 결정을 신중히 하고, 주변의 도움을 기꺼이 받아들이세요. 직관을 믿고 한 걸음씩 나아가면 좋은 흐름이 이어집니다.',
  precision: 'medium',
  model: 'gemini-mock',
  keywords: ['변화', '직관', '흐름'],
};

export class GeminiClient {
  private readonly endpoint?: string;
  private readonly apiKey?: string;

  constructor(endpoint = import.meta.env.VITE_GEMINI_ENDPOINT, apiKey = import.meta.env.VITE_GEMINI_API_KEY) {
    this.endpoint = endpoint;
    this.apiKey = apiKey;
  }

  async requestDailyFortune(user: UserProfile, date: string): Promise<GeminiResponse> {
    if (!this.endpoint || !this.apiKey) {
      return fallbackFortune;
    }

    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify({
          user,
          date,
          locale: user.locale,
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini request failed: ${response.status}`);
      }

      const data = (await response.json()) as GeminiResponse;
      return data;
    } catch (error) {
      console.warn('[GeminiClient] Falling back to mock fortune', error);
      return fallbackFortune;
    }
  }
}
