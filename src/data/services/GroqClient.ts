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

const colorNames = {
  en: ['Golden Yellow', 'Sky Blue', 'Mystic Purple', 'Sunset Orange', 'Emerald Green'],
  ko: ['황금색', '하늘색', '신비한 보라색', '노을빛 주황색', '에메랄드 초록색'],
  ja: ['黄金色', '空色', '神秘的な紫色', '夕焼けのオレンジ', 'エメラルドグリーン'],
  zh: ['金黄色', '天蓝色', '神秘紫', '夕阳橙', '祖母绿']
};

const pickColor = (user: UserProfile) => {
  const seed = (user.name || user.id || '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const colors = colorNames[user.locale] || colorNames.en;
  return colors[Math.abs(seed) % colors.length];
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
Calendar Type: ${user.calendarType || 'solar'}

[Today's Date]
Date: ${date} (${todayInfo.year}-${todayInfo.month}-${todayInfo.day})
Day of Week: ${todayInfo.dayOfWeek}
Language: ${user.locale}
`;

      // Locale-specific prompts (Four Pillars of Destiny based)
      const localePrompts = {
        ko: `당신은 사용자의 친한 친구이자 사주명리 전문가입니다. 사주(생년월일시)와 양력/음력 여부, 오늘 날짜를 바탕으로 운세를 분석해주세요.

**톤앤매너:**
- 친구에게 말하듯이 다정하고 친근한 말투(해요체)를 사용하세요.
- 딱딱한 전문가 느낌보다는, 따뜻하게 조언해주는 멘토나 친구 같은 느낌을 주세요.
- 어려운 전문 용어(천간, 지지 등)는 되도록 풀어서 쉽게 설명하거나 생략하고, 실생활에 적용할 수 있는 조언 위주로 작성하세요.

**분석 요소:**
- 출생 사주팔자와 오늘 날짜의 조화
- 오행의 균형

**포함할 내용:**
- 재물, 건강, 인간관계, 직업 중 오늘 특히 신경 써야 할 부분이나 좋은 점을 콕 집어서 이야기해주세요.
- 구체적이고 실천 가능한 조언을 포함하세요。

**중요: 색상 표현 규칙**
- 헥사 코드(#로 시작) 절대 사용 금지
- '황금색', '파란색', '연두색' 같이 누구나 아는 쉬운 색 이름만 사용
- fullText에서도 헥사 코드는 언급하지 마세요

**JSON 형식으로만 응답 (Markdown 코드 블록 금지):**
{"summary":"친구에게 건네는 한 줄 핵심 조언","fullText":"3~4문장으로 전하는 오늘의 운세와 따뜻한 조언 (헥사 코드 금지, 친구 말투)","color":"오늘의 행운의 색 (쉬운 한글 이름)","precision":"${user.birthTimeAccuracy}","quote":"오늘 나에게 힘이 되는 한 마디 (격언 또는 응원)"}`,
        
        ja: `あなたはユーザーの親しい友人であり、四柱推命の専門家です。出生情報と今日の日付をもとに運勢を分析してください。

**トーン＆マナー:**
- 友人に話しかけるように、親しみやすく優しい口調（です・ます調）で話してください。
- 堅苦しい専門家としてではなく、温かくアドバイスする良き理解者として振る舞ってください。
- 難しい専門用語は避け、誰にでも直感的に分かる言葉で説明してください。

**分析要素:**
- 生年月日と今日の日付の相性
- 五行のバランス

**含める内容:**
- 金運、健康、人間関係、仕事の中で、今日特に注目すべき点や良い点を具体的に教えてください。
- 実践的で具体的なアドバイスを含めてください。

**重要：色の表現ルール**
- ヘキサコード（#で始まる）は絶対に使用禁止
- 「金色」「空色」「桜色」のように、一般的で分かりやすい色名のみ使用
- fullTextでもヘキサコードは言及しない

**JSON形式のみで回答（Markdownなし）:**
{"summary":"友人への一行アドバイス","fullText":"3-4文で伝える今日の運勢と温かいアドバイス（ヘキサコード禁止、親しみやすい口調）","color":"今日のラッキーカラー（一般的な色名）","precision":"${user.birthTimeAccuracy}","quote":"今日を元気に過ごすための一言（格言や応援）"}`,

        zh: `你是用户的亲密朋友，也是八字命理专家。请根据出生信息和今天的日期来分析运势。

**语气风格:**
- 请像对老朋友说话一样，使用亲切、自然、友好的语气。
- 不要像严厉的算命先生，而要像一位给予温暖建议的人生导师或知己。
- 尽量避免晦涩难懂的专业术语，用通俗易懂的大白话来解释。

**分析要素:**
- 八字与今日日期的互动
- 五行平衡

**包含内容:**
- 请重点指出今天在财运、健康、人际或事业方面最需要注意或最好的地方。
- 提供具体、可操作的实用建议。

**重要：颜色表达规则**
- 绝对禁止使用十六进制代码（#开头）
- 只使用“金黄色”、“淡蓝色”、“草绿色”等通俗易懂的颜色名称
- fullText 中也不要提及十六进制代码

**仅以 JSON 格式回答（无 Markdown 代码块）：**
{"summary":"给朋友的一句核心建议","fullText":"3-4句话的今日运势详解与温馨建议（禁止代码，亲切语气）","color":"今日幸运色（通俗颜色名）","precision":"${user.birthTimeAccuracy}","quote":"给人力量的一句话（格言或鼓励）"}`,
        
        en: `You are the user's close friend and a Four Pillars of Destiny (Ba Zi) expert. Analyze the fortune based on birth info and today's date.

**Tone & Style:**
- Speak in a warm, friendly, and conversational tone, like giving advice to a best friend.
- Avoid being overly formal or rigid. Be supportive and encouraging.
- Use simple, everyday language. Avoid complex esoteric jargon where possible.

**Analysis Elements:**
- Interaction between birth chart and today's date
- Five Elements balance

**Include:**
- Highlight the most important aspects of wealth, health, relationships, or career for today.
- Provide specific, practical advice.

**IMPORTANT: Color Expression Rules**
- NEVER use hex codes (starting with #)
- ONLY use common color names (e.g., 'Golden Yellow', 'Navy Blue', 'Salmon Pink')
- Do NOT mention hex codes in fullText

**Respond ONLY in JSON format (No Markdown):**
{"summary":"One-line core advice for a friend","fullText":"3-4 sentences of detailed fortune and warm advice (NO hex codes, friendly tone)","color":"Today's lucky color (common name)","precision":"${user.birthTimeAccuracy}","quote":"An inspiring quote or motto for today"}`
      };

      const fortunePrompt = localePrompts[user.locale] || localePrompts.en;

      console.log('[GroqClient] Calling Groq API...', this.model);

      let parsedData: Partial<GroqResponse> = {};
      const MAX_RETRIES = 3;

      for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
        try {
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
            response_format: { type: 'json_object' },
          });

          const textContent = completion.choices[0]?.message?.content || '';
          console.log(`[GroqClient] Raw Response (Attempt ${attempt + 1}):`, textContent);

          parsedData = JSON.parse(textContent);
          
          // If successful, break the loop
          break;

        } catch (e) {
          console.warn(`[GroqClient] Attempt ${attempt + 1} failed:`, e);
          
          if (attempt === MAX_RETRIES - 1) {
            console.error('[GroqClient] All retries failed. Using fallback.');
            // Only fallback on the last attempt
             parsedData = {}; 
          } else {
            // Wait before retrying (1s)
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
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
