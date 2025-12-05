import { describe, expect, it, vi } from 'vitest';
import { GetDailyFortuneUseCase } from './getDailyFortune';
import { createDefaultUserProfile } from '../entities/user';
import type { FortuneRepository } from '../repositories/fortuneRepository';
import type { FortuneGenerator } from '../repositories/fortuneGenerator';

const user = createDefaultUserProfile('ko');

const buildRepo = () => {
  const fortunes: Record<string, any> = {};
  const repo: FortuneRepository = {
    getFortuneByDate: vi.fn(async (userId, date) => fortunes[`${userId}:${date}`] ?? null),
    saveFortune: vi.fn(async (fortune) => {
      fortunes[fortune.id] = fortune;
    }),
    listRecentFortunes: vi.fn(async () => Object.values(fortunes)),
  };
  return { repo, fortunes };
};

const buildGenerator = (): FortuneGenerator => ({
  generateDailyFortune: vi.fn(async () => ({
    summary: '요약',
    fullText: '상세',
    precision: 'high' as const,
    model: 'gemini-mock',
  })),
});

describe('GetDailyFortuneUseCase', () => {
  it('캐시된 운세가 있으면 생성기를 호출하지 않는다', async () => {
    const { repo, fortunes } = buildRepo();
    const generator = buildGenerator();
    const useCase = new GetDailyFortuneUseCase(repo, generator);
    fortunes[`${user.id}:2024-01-01`] = {
      id: `${user.id}:2024-01-01`,
      userId: user.id,
      date: '2024-01-01',
      summary: 'cached',
      fullText: 'cached',
      precision: 'medium',
      locale: 'ko',
      model: 'gemini',
      createdAt: new Date().toISOString(),
    };

    const result = await useCase.execute({ user, date: '2024-01-01' });

    expect(result.summary).toBe('cached');
    expect(generator.generateDailyFortune).not.toHaveBeenCalled();
  });

  it('캐시가 없을 때 운세를 생성하고 저장한다', async () => {
    const { repo, fortunes } = buildRepo();
    const generator = buildGenerator();
    const useCase = new GetDailyFortuneUseCase(repo, generator);

    const result = await useCase.execute({ user, date: '2024-02-02' });

    expect(result.id).toBe(`${user.id}:2024-02-02`);
    expect(generator.generateDailyFortune).toHaveBeenCalledOnce();
    expect(fortunes[result.id]).toBeDefined();
  });
});
