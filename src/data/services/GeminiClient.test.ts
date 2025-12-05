import { describe, expect, it, vi } from 'vitest';
import { GeminiClient } from './GeminiClient';
import { createDefaultUserProfile } from '../../domain/entities/user';

describe('GeminiClient', () => {
  const user = createDefaultUserProfile('ko');

  it('엔드포인트가 없으면 목 운세를 반환한다', async () => {
    const client = new GeminiClient('', '');
    const fetchSpy = vi.spyOn(globalThis, 'fetch' as any);

    const result = await client.requestDailyFortune(user, '2024-01-01');

    expect(result.summary).toBeDefined();
    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
  });

  it('엔드포인트가 있으면 fetch를 호출한다', async () => {
    const mockResponse = {
      summary: '테스트 요약',
      fullText: '테스트 본문',
      precision: 'high',
      model: 'gemini-test',
    };
    const fetchStub = vi.fn().mockResolvedValue({ ok: true, json: async () => mockResponse });
    vi.stubGlobal('fetch', fetchStub as any);

    const client = new GeminiClient('https://mock-endpoint', 'api-key');
    const result = await client.requestDailyFortune(user, '2024-01-02');

    expect(fetchStub).toHaveBeenCalledOnce();
    expect(result.summary).toBe('테스트 요약');

    (globalThis.fetch as any).mockRestore();
  });
});
