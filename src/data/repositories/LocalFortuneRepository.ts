import type { Fortune } from '../../domain/entities/fortune';
import type { FortuneRepository } from '../../domain/repositories/fortuneRepository';
import { LocalStorageClient } from '../storage/LocalStorageClient';

const FORTUNE_KEY = 'fortunecrack:fortunes';

interface FortuneStorageMap {
  [id: string]: Fortune;
}

export class LocalFortuneRepository implements FortuneRepository {
  private readonly storage: LocalStorageClient;

  constructor(storage: LocalStorageClient) {
    this.storage = storage;
  }

  async getFortuneByDate(userId: string, date: string): Promise<Fortune | null> {
    const fortunes = this.storage.read<FortuneStorageMap>(FORTUNE_KEY) ?? {};
    const key = `${userId}:${date}`;
    return fortunes[key] ?? null;
  }

  async saveFortune(fortune: Fortune): Promise<void> {
    const fortunes = this.storage.read<FortuneStorageMap>(FORTUNE_KEY) ?? {};
    fortunes[fortune.id] = fortune;
    this.storage.write(FORTUNE_KEY, fortunes);
  }

  async listRecentFortunes(userId: string, limit = 10): Promise<Fortune[]> {
    const fortunes = this.storage.read<FortuneStorageMap>(FORTUNE_KEY) ?? {};
    return Object.values(fortunes)
      .filter((fortune) => fortune.userId === userId)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, limit);
  }
}
