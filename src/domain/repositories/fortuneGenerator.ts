import type { FortunePrecision } from '../entities/fortune';
import type { UserProfile } from '../entities/user';

export interface GeneratedFortune {
  summary: string;
  fullText: string;
  color: string;
  precision: FortunePrecision;
  model: string;
  keywords?: string[];
}

export interface FortuneGenerator {
  generateDailyFortune(user: UserProfile, date: string): Promise<GeneratedFortune>;
}
