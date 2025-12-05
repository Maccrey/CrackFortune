import type { Fortune, FortunePrecision } from '../entities/fortune';
import type { UserProfile } from '../entities/user';

export interface GeneratedFortune {
  summary: string;
  fullText: string;
  color: string;
  precision: Fortune['precision'];
  model: string;
  keywords?: string[];
  quote?: string; // AI generated inspirational quote
}

export interface FortuneGenerator {
  generateDailyFortune(user: UserProfile, date: string): Promise<GeneratedFortune>;
}
