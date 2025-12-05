export type FortunePrecision = 'high' | 'medium' | 'low';

export interface Fortune {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  summary: string;
  fullText: string;
  color: string;
  precision: FortunePrecision;
  locale: 'en' | 'ko' | 'ja';
  model: string;
  keywords?: string[];
  quote?: string; // AI generated inspirational quote
  createdAt: string;
}

export const buildFortuneId = (userId: string, date: string) => `${userId}:${date}`;
