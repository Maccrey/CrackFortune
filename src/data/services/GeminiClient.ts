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

const fallbackFortune: GeminiResponse = {
  summary: '새로운 여정이 당신을 부르고 있습니다.',
  fullText:
    '당신의 선택이 곧 큰 변화를 만들어낼 것입니다. 오늘은 작은 결정을 신중히 하고, 주변의 도움을 기꺼이 받아들이세요. 직관을 믿고 한 걸음씩 나아가면 좋은 흐름이 이어집니다.',
  color: '#eab308',
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
      return {
        ...fallbackFortune,
        summary: `${user.name || '당신'}에게 다가오는 흐름을 살펴보세요.`,
        fullText: `${user.birthDate ? `${user.birthDate}에 태어난 ` : ''}${user.name || '여행자'}님, 오늘은 ${date} 기준으로 에너지가 변화하고 있습니다. 주변의 따뜻한 색감을 활용하면 집중력과 직관이 높아집니다.`,
      };
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
      const palette = ['#eab308', '#22d3ee', '#a855f7', '#f97316', '#10b981'];
      const index = Math.abs((user.name ?? user.id ?? '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % palette.length;
      return {
        ...fallbackFortune,
        color: palette[index],
        summary: `${user.name || '여행자'}님, 오늘의 색은 ${palette[index]} 입니다.`,
        fullText: `${user.name || '여행자'}님, ${user.birthDate ? `${user.birthDate}에 태어나 ` : ''}당신에게 어울리는 컬러가 오늘의 흐름을 안정시켜 줍니다. ${palette[index]} 톤의 아이템을 활용해 집중력을 높여 보세요.`,
      };
    }
  }
}
