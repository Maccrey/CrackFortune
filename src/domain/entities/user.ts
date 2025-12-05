export type BirthTimeAccuracy = 'minute' | 'hour' | 'unknown';

export interface UserProfile {
  id: string;
  name: string;
  birthDate: string; // ISO date (YYYY-MM-DD)
  birthTime?: string; // HH:mm
  birthTimeAccuracy: BirthTimeAccuracy;
  locale: 'en' | 'ko' | 'ja';
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export const createDefaultUserProfile = (locale: UserProfile['locale'] = 'en'): UserProfile => {
  const now = new Date().toISOString();
  return {
    id: 'local-user',
    name: 'Traveler',
    birthDate: '',
    birthTime: '',
    birthTimeAccuracy: 'unknown',
    locale,
    createdAt: now,
    updatedAt: now,
  };
};
