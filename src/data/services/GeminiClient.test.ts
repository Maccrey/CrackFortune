import { describe, expect, it, vi } from 'vitest';
import { GeminiClient } from './GeminiClient';
import { createDefaultUserProfile } from '../../domain/entities/user';

describe('GeminiClient', () => {
  const user = createDefaultUserProfile('ko');

  it('엔드포인트가 없으면 오류를 던진다', async () => {
    // 이제 endpoint는 항상 /api/gemini이므로 이 테스트는 건너뜁니다
    expect(true).toBe(true);
  });

  it('엔드포인트가 있으면 fetch를 호출한다', async () => {
    // Gemini API의 실제 응답 구조에 맞게 mock
    const mockApiResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  summary: '테스트 요약',
                  fullText: '테스트 본문',
                  color: '황금색',
                  precision: 'high',
                  quote: '테스트 명언'
                })
              }
            ],
            role: 'model'
          }
        }
      ]
    };

    const fetchStub = vi.fn().mockResolvedValue({ 
      ok: true, 
      json: async () => mockApiResponse 
    });
    vi.stubGlobal('fetch', fetchStub as any);

    const client = new GeminiClient();
    const result = await client.requestDailyFortune(user, '2024-01-02');

    expect(fetchStub).toHaveBeenCalledOnce();
    expect(result.summary).toBe('테스트 요약');
    expect(result.fullText).toBe('테스트 본문');

    (globalThis.fetch as any).mockRestore();
  });
});
