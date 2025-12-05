import type { Fortune } from '../entities/fortune';

export interface FortuneRepository {
  getFortuneByDate(userId: string, date: string): Promise<Fortune | null>;
  saveFortune(fortune: Fortune): Promise<void>;
  listRecentFortunes(userId: string, limit?: number): Promise<Fortune[]>;
}
