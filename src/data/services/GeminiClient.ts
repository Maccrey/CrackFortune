import type { GeneratedFortune } from '../../domain/repositories/fortuneGenerator';
import type { UserProfile } from '../../domain/entities/user';

interface GeminiResponse {
  summary: string;
  fullText: string;
  color: string;
  precision: GeneratedFortune['precision'];
  model: string;
  keywords?: string[];
  quote?: string; // AI generated inspirational quote
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
                  text: `${prompt}\n오늘의 운세를 JSON 형태로 응답해 주세요. 형식: {"summary":"한 줄 요약","fullText":"3-4문장 전체 운세","color":"HEX 색상","precision":"${user.birthTimeAccuracy}","quote":"운세에 어울리는 짧은 영감을 주는 명언 (한 문장)"}`
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

      const apiResponse = await response.json();
      
      // Gemini API 응답 구조: { candidates: [{ content: { parts: [{ text: "..." }] } }] }
      const textContent = apiResponse.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // JSON 추출 (마크다운 코드 블록 제거)
      const jsonMatch = textContent.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : textContent;
      
      let parsedData: Partial<GeminiResponse> = {};
      try {
        parsedData = JSON.parse(jsonStr);
      } catch {
        // JSON 파싱 실패 시 텍스트를 summary로 사용
        parsedData = {
          summary: textContent.substring(0, 100) || '오늘도 좋은 하루 되세요!',
          fullText: textContent || '건강과 행운이 함께하는 하루가 될 것입니다.',
        };
      }

      console.log('[GeminiClient] ✅ AI 응답 받음:', {
        summary: parsedData.summary?.substring(0, 50) + '...',
        fullText: parsedData.fullText?.substring(0, 50) + '...',
        color: parsedData.color,
        precision: parsedData.precision
      });

      return {
        summary: parsedData.summary || '오늘도 좋은 하루 되세요!',
        fullText: parsedData.fullText || '건강과 행운이 함께하는 하루가 될 것입니다.',
        color: parsedData.color || pickColor(user),
        precision: (parsedData.precision || user.birthTimeAccuracy || 'unknown') as GeneratedFortune['precision'],
        model: apiResponse.candidates?.[0]?.content?.role || 'gemini',
        keywords: parsedData.keywords,
        quote: parsedData.quote || 'The future belongs to those who believe in the beauty of their dreams.',
      };
    } catch (error) {
      console.warn('[GeminiClient] Gemini 호출 실패', error);
      throw new Error('Gemini 호출에 실패했습니다. 엔드포인트/키 또는 네트워크를 확인해주세요.');
    }
  }
}
