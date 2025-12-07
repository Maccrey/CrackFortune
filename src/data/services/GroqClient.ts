import Groq from 'groq-sdk';
import type { GeneratedFortune } from '../../domain/repositories/fortuneGenerator';
import type { UserProfile } from '../../domain/entities/user';

interface GroqResponse {
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

export class GroqClient {
  private readonly groq: Groq;
  private readonly model: string;

  constructor() {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    this.model = import.meta.env.VITE_GROQ_MODEL || 'openai/gpt-oss-20b'; // Use openai/gpt-oss-20b as default

    if (!apiKey) {
      console.error('[GroqClient] Missing VITE_GROQ_API_KEY');
    }

    this.groq = new Groq({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true, // Allow running in browser for this demo/app
    });
  }

  async requestDailyFortune(user: UserProfile, date: string): Promise<GroqResponse> {
    if (!import.meta.env.VITE_GROQ_API_KEY) {
      throw new Error('Groq API Key is not set. Please check .env file.');
    }

    try {
      // Detailed date info
      const today = new Date(date);
      const todayInfo = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
        dayOfWeek: today.toLocaleDateString(user.locale === 'ko' ? 'ko-KR' : user.locale === 'ja' ? 'ja-JP' : user.locale === 'zh' ? 'zh-CN' : 'en-US', { weekday: 'long' })
      };

      const prompt = `[User Info]
Name: ${user.name}
Birth Date: ${user.birthDate}
Birth Time: ${user.birthTime || 'Unknown'}
Birth Time Accuracy: ${user.birthTimeAccuracy}

[Today's Date]
Date: ${date} (${todayInfo.year}-${todayInfo.month}-${todayInfo.day})
Day of Week: ${todayInfo.dayOfWeek}
Language: ${user.locale}
`;

      // Locale-specific prompts (Four Pillars of Destiny based)
      const localePrompts = {
        ko: `당신은 전문 사주명리학자입니다. 위 사람의 출생 사주(생년월일시)와 오늘 날짜를 바탕으로 운세를 분석해주세요.

**분석 요소:**
- 출생 사주팔자(年柱, 月柱, 日柱, 時柱)
- 오늘의 년월일시와의 상호작용
- 오행(五行: 목화토금수)의 균형과 상생상극
- 천간지지(天干地支)의 조화
- 대운(大運)과 세운(歲運), 일진(日辰) 분석

**포함할 내용:**
재물운, 건강운, 인간관계운, 직업운 중 오늘 특히 중요한 부분을 강조하여 구체적이고 실용적인 조언을 제공해주세요.

**중요: 색상 표현 규칙**
- 헥사 코드(#로 시작하는 코드)를 절대 사용하지 마세요
- 오직 일반인이 이해할 수 있는 색 이름만 사용하세요 (예: 황금색, 빨간색, 파란색, 초록색, 보라색)
- fullText에서도 헥사 코드를 언급하지 마세요

**JSON 형식으로만 응답해주세요 (MarkDown 코드 블록 없이):**
{"summary":"한 줄 핵심 운세","fullText":"3-4문장으로 오늘의 운세 상세 설명 (헥사 코드 언급 금지)","color":"오늘의 길한 색상을 일반적인 색 이름으로만 (예: 황금색, 빨간색, 파란색)","precision":"${user.birthTimeAccuracy}","quote":"오늘의 운세에 어울리는 사주명리 격언 또는 좌우명 (한 문장)"}`,
        
        ja: `あなたは四柱推命の専門家です。上記の出生四柱（生年月日時）と本日の日付をもとに運勢を分析してください。

**分析要素:**
- 出生四柱八字（年柱、月柱、日柱、時柱）
- 本日の年月日時との相互作用
- 五行（木火土金水）のバランスと相生相剋
- 天干地支の調和
- 大運、歳運、日辰の分析

**含める内容:**
金運、健康運、人間関係運、仕事運の中で、本日特に重要な部分を強調し、具体的で実用的なアドバイスを提供してください。

**重要：色の表現ルール**
- ヘキサコード（#で始まるコード）は絶対に使用しないでください
- 一般人が理解できる色の名前のみ使用してください（例：金色、赤色、青色、緑色、紫色）
- fullTextでもヘキサコードを言及しないでください

**JSON形式のみで回答してください（MarkDownコードブロックなし）:**
{"summary":"一行の核心運勢","fullText":"3-4文で本日の運勢の詳細説明（ヘキサコード言及禁止）","color":"本日の吉祥色を一般的な色の名前でのみ（例：金色、赤色、青色）","precision":"${user.birthTimeAccuracy}","quote":"本日の運勢にふさわしい四柱推命の格言または座右の銘（一文）"}`,

        zh: `你是八字命理学的专家。请根据上述出生八字（年月日时）和今天的日期分析运势。

**分析要素：**
- 出生八字（年柱、月柱、日柱、时柱）
- 与今日干支的相互作用
- 五行（木火土金水）的平衡与生克
- 天干地支的和谐
- 大运、流年、流日的分析

**包含内容：**
请在财运、健康运、人际关系运、事业运中，重点强调今天特别重要的部分，并提供具体实用的建议。

**重要：颜色表达规则**
- 绝对不要使用十六进制代码（以#开头的代码）
- 仅通过一般人能理解的颜色名称来描述（例如：金色、红色、蓝色、绿色、紫色）
- fullText 中也不要提及十六进制代码

**仅以 JSON 格式回答（不要使用 Markdown 代码块）：**
{"summary":"一行核心运势","fullText":"3-4句话详细描述今日运势（禁止提及十六进制代码）","color":"仅使用通用颜色名称描述今日吉色（例如：金色、红色、蓝色）","precision":"${user.birthTimeAccuracy}","quote":"符合今日运势的八字命理格言或座右铭（一句话）"}`,
        
        en: `You are a professional Four Pillars of Destiny (Ba Zi) fortune teller. Analyze the fortune based on the birth Four Pillars and today's date.

**Analysis Elements:**
- Birth Four Pillars and Eight Characters
- Interaction with today's date
- Five Elements Balance
- Harmony of Heavenly Stems and Earthly Branches

**Include:**
Emphasize the most important aspects among wealth, health, relationships, and career for today.

**IMPORTANT: Color Expression Rules**
- NEVER use hex codes (codes starting with #)
- ONLY use common color names that regular people understand (e.g., golden, red, blue, green, purple)
- Do NOT mention hex codes in fullText either

**Respond ONLY in JSON format (No Markdown code blocks):**
{"summary":"One-line core fortune","fullText":"3-4 sentences detailed fortune for today (NO hex codes)","color":"Today's auspicious color using ONLY common color names (e.g., golden, red, blue)","precision":"${user.birthTimeAccuracy}","quote":"A Four Pillars wisdom or motto that matches today's fortune (one sentence)"}`
      };

      const fortunePrompt = localePrompts[user.locale] || localePrompts.en;

      console.log('[GroqClient] Calling Groq API...', this.model);

      const completion = await this.groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates fortune telling results in JSON format.',
          },
          {
            role: 'user',
            content: `${prompt}\n${fortunePrompt}`,
          },
        ],
        model: this.model,
        temperature: 0.7,
        response_format: { type: 'json_object' }, // Enforce JSON response if supported, or rely on prompt
      });

      const textContent = completion.choices[0]?.message?.content || '';
      
      console.log('[GroqClient] Raw Response:', textContent);

      let parsedData: Partial<GroqResponse> = {};
      try {
        parsedData = JSON.parse(textContent);
      } catch (e) {
        console.warn('[GroqClient] Failed to parse JSON, falling back to text extraction', e);
        // Fallback or regex extraction if needed, but 'json_object' mode should help
        parsedData = {
            summary: textContent.substring(0, 100),
            fullText: textContent
        };
      }

      // Locale fallbacks
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
        zh: {
          summary: '祝你今天过得愉快！',
          fullText: '愿健康和好运今天与你同在。',
          quote: '细小的行动带来巨大的改变。'
        },
        en: {
          summary: 'Have a great day!',
          fullText: 'May health and good fortune be with you today.',
          quote: 'Small actions create big changes.'
        }
      };

      const fb = fallbacks[user.locale] || fallbacks.en;

      console.log('[GroqClient] ✅ Groq Response Parsed:', {
        summary: parsedData.summary?.substring(0, 50) + '...',
        fullText: parsedData.fullText?.substring(0, 50) + '...',
      });

      return {
        summary: parsedData.summary || fb.summary,
        fullText: parsedData.fullText || fb.fullText,
        color: parsedData.color || pickColor(user),
        precision: (parsedData.precision || user.birthTimeAccuracy || 'unknown') as GeneratedFortune['precision'],
        model: this.model,
        keywords: parsedData.keywords,
        quote: parsedData.quote || fb.quote,
      };

    } catch (error) {
      console.warn('[GroqClient] Groq Call Failed', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Groq request failed. Please check endpoint/key or network.');

    }
  }

  async chat(messages: { role: 'system' | 'user' | 'assistant'; content: string }[], temperature: number = 0.7): Promise<string> {
    if (!import.meta.env.VITE_GROQ_API_KEY) {
      throw new Error('Groq API Key is not set. Please check .env file.');
    }

    try {
      console.log('[GroqClient] Calling Chat API...', this.model);

      const completion = await this.groq.chat.completions.create({
        messages: messages as any,
        model: this.model,
        temperature: temperature,
      });

      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.warn('[GroqClient] Groq Chat Call Failed', error);
      throw error;
    }
  }
}
