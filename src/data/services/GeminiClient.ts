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
      // 오늘의 날짜 정보를 상세하게 포함
      const today = new Date(date);
      const todayInfo = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
        dayOfWeek: today.toLocaleDateString(user.locale === 'ko' ? 'ko-KR' : user.locale === 'ja' ? 'ja-JP' : 'en-US', { weekday: 'long' })
      };

      const prompt = `[출생 정보]
이름: ${user.name}
생년월일: ${user.birthDate}
생시: ${user.birthTime || '미상'}
생시 정확도: ${user.birthTimeAccuracy}

[오늘 날짜]
날짜: ${date} (${todayInfo.year}년 ${todayInfo.month}월 ${todayInfo.day}일)
요일: ${todayInfo.dayOfWeek}
언어: ${user.locale}
`;

      // locale에 따라 다른 프롬프트 생성 (사주명리 기반)
      const localePrompts = {
        ko: `당신은 전문 사주명리학자입니다. 위 사람의 출생 사주(생년월일시)와 오늘 날짜(${todayInfo.year}년 ${todayInfo.month}월 ${todayInfo.day}일 ${todayInfo.dayOfWeek})를 바탕으로 운세를 분석해주세요.

**분석 요소:**
- 출생 사주팔자(年柱, 月柱, 日柱, 時柱)
- 오늘의 년월일시와의 상호작용
- 오행(五行: 목화토금수)의 균형과 상생상극
- 천간지지(天干地支)의 조화
- 대운(大運)과 세운(歲運), 일진(日辰) 분석

**포함할 내용:**
재물운, 건강운, 인간관계운, 직업운 중 오늘 특히 중요한 부분을 강조하여 구체적이고 실용적인 조언을 제공해주세요.

JSON 형식으로 응답: {"summary":"한 줄 핵심 운세","fullText":"3-4문장으로 오늘의 운세 상세 설명","color":"오늘의 길한 색상 HEX","precision":"${user.birthTimeAccuracy}","quote":"오늘의 운세에 어울리는 사주명리 격언 또는 좌우명 (한 문장)"}`,
        
        ja: `あなたは四柱推命の専門家です。上記の出生四柱（生年月日時）と本日の日付（${todayInfo.year}年${todayInfo.month}月${todayInfo.day}日 ${todayInfo.dayOfWeek}）をもとに運勢を分析してください。

**分析要素:**
- 出生四柱八字（年柱、月柱、日柱、時柱）
- 本日の年月日時との相互作用
- 五行（木火土金水）のバランスと相生相剋
- 天干地支の調和
- 大運、歳運、日辰の分析

**含める内容:**
金運、健康運、人間関係運、仕事運の中で、本日特に重要な部分を強調し、具体的で実用的なアドバイスを提供してください。

JSON形式で回答: {"summary":"一行の核心運勢","fullText":"3-4文で本日の運勢の詳細説明","color":"本日の吉祥色HEX","precision":"${user.birthTimeAccuracy}","quote":"本日の運勢にふさわしい四柱推命の格言または座右の銘（一文）"}`,
        
        en: `You are a professional Four Pillars of Destiny (Ba Zi) fortune teller. Analyze the fortune based on the birth Four Pillars (birth year, month, day, and time) and today's date (${todayInfo.dayOfWeek}, ${todayInfo.month}/${todayInfo.day}/${todayInfo.year}).

**Analysis Elements:**
- Birth Four Pillars and Eight Characters (Year, Month, Day, Time Pillars)
- Interaction with today's year, month, day, and time
- Balance and interactions of Five Elements (Wood, Fire, Earth, Metal, Water)
- Harmony of Heavenly Stems and Earthly Branches
- Major Luck, Annual Luck, and Daily fortune analysis

**Include:**
Emphasize the most important aspects among wealth, health, relationships, and career for today, providing specific and practical advice.

Respond in JSON format: {"summary":"One-line core fortune","fullText":"3-4 sentences detailed fortune for today","color":"Today's auspicious color HEX","precision":"${user.birthTimeAccuracy}","quote":"A Four Pillars wisdom or motto that matches today's fortune (one sentence)"}`
      };

      const fortunePrompt = localePrompts[user.locale] || localePrompts.en;

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
                  text: `${prompt}\n${fortunePrompt}`
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
        // JSON 파싱 실패 시 텍스트를 summary로 사용 (locale별로 처리는 아래에서)
        parsedData = {
          summary: textContent.substring(0, 100),
          fullText: textContent,
        };
      }

      // locale별 fallback 메시지
      const fallbacks = {
        ko: {
          summary: '오늘도 좋은 하루 되세요!',
          fullText: '건강과 행운이 함께하는 하루가 될 것입니다.',
          quote: '작은 행동이 큰 변화를 만듭니다.'
        },
        ja: {
          summary: '今日も良い一日を！',
          fullText: '健康と幸運が共にある一日になるでしょう。',
          quote: '小さな行動が大きな変化を生み出します。'
        },
        en: {
          summary: 'Have a great day!',
          fullText: 'May health and good fortune be with you today.',
          quote: 'Small actions create big changes.'
        }
      };

      const fb = fallbacks[user.locale] || fallbacks.en;

      console.log('[GeminiClient] ✅ AI 응답 받음:', {
        summary: parsedData.summary?.substring(0, 50) + '...',
        fullText: parsedData.fullText?.substring(0, 50) + '...',
        color: parsedData.color,
        precision: parsedData.precision,
        quote: parsedData.quote?.substring(0, 50) + '...'
      });

      return {
        summary: parsedData.summary || fb.summary,
        fullText: parsedData.fullText || fb.fullText,
        color: parsedData.color || pickColor(user),
        precision: (parsedData.precision || user.birthTimeAccuracy || 'unknown') as GeneratedFortune['precision'],
        model: apiResponse.candidates?.[0]?.content?.role || 'gemini',
        keywords: parsedData.keywords,
        quote: parsedData.quote || fb.quote,
      };
    } catch (error) {
      console.warn('[GeminiClient] Gemini 호출 실패', error);
      throw new Error('Gemini 호출에 실패했습니다. 엔드포인트/키 또는 네트워크를 확인해주세요.');
    }
  }
}
