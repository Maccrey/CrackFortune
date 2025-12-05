import { describe, expect, it } from 'vitest';
import { LocalFortuneRepository } from './LocalFortuneRepository';
import { LocalStorageClient } from '../storage/LocalStorageClient';
import type { Fortune } from '../../domain/entities/fortune';

class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear(): void {
    this.store.clear();
  }
  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

const buildFortune = (date: string): Fortune => ({
  id: `user:${date}`,
  userId: 'user',
  date,
  summary: `summary ${date}`,
  fullText: 'fullText',
  color: '#eab308',
  precision: 'high',
  locale: 'ko',
  model: 'gemini',
  createdAt: new Date().toISOString(),
});

describe('LocalFortuneRepository', () => {
  it('운세를 저장하고 날짜로 조회한다', async () => {
    const storage = new LocalStorageClient(new MemoryStorage());
    const repo = new LocalFortuneRepository(storage);
    const fortune = buildFortune('2024-03-01');

    await repo.saveFortune(fortune);
    const result = await repo.getFortuneByDate('user', '2024-03-01');

    expect(result?.summary).toBe('summary 2024-03-01');
  });

  it('최근 운세를 날짜 역순으로 반환한다', async () => {
    const storage = new LocalStorageClient(new MemoryStorage());
    const repo = new LocalFortuneRepository(storage);
    await repo.saveFortune(buildFortune('2024-03-01'));
    await repo.saveFortune(buildFortune('2024-03-02'));
    await repo.saveFortune(buildFortune('2024-02-28'));

    const list = await repo.listRecentFortunes('user', 2);

    expect(list.map((f) => f.date)).toEqual(['2024-03-02', '2024-03-01']);
  });
});
