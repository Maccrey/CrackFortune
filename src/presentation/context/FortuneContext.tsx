import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Fortune } from '../../domain/entities/fortune';
import type { UserProfile } from '../../domain/entities/user';
import { GetDailyFortuneUseCase } from '../../domain/usecases/getDailyFortune';
import { LocalFortuneRepository } from '../../data/repositories/LocalFortuneRepository';
import { GeminiFortuneRepository } from '../../data/repositories/GeminiFortuneRepository';
import { LocalUserRepository } from '../../data/repositories/LocalUserRepository';
import { LocalStorageClient } from '../../data/storage/LocalStorageClient';
import { GeminiClient } from '../../data/services/GeminiClient';
import { useLanguage } from './LanguageContext';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface FortuneContextValue {
  user: UserProfile | null;
  fortune: Fortune | null;
  recentFortunes: Fortune[];
  status: Status;
  error: string | null;
  crackFortune: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
  selectFortune: (fortune: Fortune) => void;
}

const FortuneContext = createContext<FortuneContextValue | undefined>(undefined);

export const FortuneProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const storageClient = useMemo(() => new LocalStorageClient(typeof window !== 'undefined' ? window.localStorage : null), []);
  const { language } = useLanguage();

  const fortuneRepositoryRef = useRef(new LocalFortuneRepository(storageClient));
  const userRepositoryRef = useRef(new LocalUserRepository(storageClient));
  const generatorRef = useRef(new GeminiFortuneRepository(new GeminiClient()));
  const useCaseRef = useRef(new GetDailyFortuneUseCase(fortuneRepositoryRef.current, generatorRef.current));

  const [user, setUser] = useState<UserProfile | null>(null);
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [recentFortunes, setRecentFortunes] = useState<Fortune[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const loadCachedFortune = async (profile: UserProfile) => {
    const today = new Date().toISOString().slice(0, 10);
    const cached = await fortuneRepositoryRef.current.getFortuneByDate(profile.id, today);
    setFortune(cached);
    const recents = await fortuneRepositoryRef.current.listRecentFortunes(profile.id);
    setRecentFortunes(recents);
  };

  const normalizeLocale = (lang: string): UserProfile['locale'] => {
    if (lang.startsWith('ko')) return 'ko';
    if (lang.startsWith('ja')) return 'ja';
    return 'en';
  };

  const refreshUser = async () => {
    const profile = await userRepositoryRef.current.getProfile();
    const normalized = normalizeLocale(language);
    
    console.log('[FortuneContext] Language sync:', { 
      languageContext: language, 
      profileLocale: profile.locale, 
      normalized 
    });

    const mergedProfile = profile.locale === normalized ? profile : { ...profile, locale: normalized };
    if (mergedProfile !== profile) {
      console.log('[FortuneContext] Updating profile locale:', profile.locale, '→', normalized);
      await userRepositoryRef.current.saveProfile(mergedProfile);
    }
    setUser(mergedProfile);
    await loadCachedFortune(mergedProfile);
  };

  useEffect(() => {
    void refreshUser();
  }, [language]);

  const isProfileComplete = (profile: UserProfile | null) => {
    if (!profile) return false;
    return Boolean(profile.name?.trim()) && Boolean(profile.birthDate?.trim());
  };

  const crackFortune = async () => {
    if (!user) {
      setError('프로필을 먼저 입력해주세요.');
      setStatus('error');
      return false;
    }
    if (!isProfileComplete(user)) {
      setError('프로필(이름, 생년월일)을 입력하면 맞춤 운세를 받을 수 있어요. 설정에서 저장해주세요.');
      setStatus('error');
      return false;
    }
    setStatus('loading');
    setError(null);
    try {
      const result = await useCaseRef.current.execute({ user });
      setFortune(result);
      const recents = await fortuneRepositoryRef.current.listRecentFortunes(user.id);
      setRecentFortunes(recents);
      setStatus('success');
      return true;
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
      return false;
    }
  };

  const selectFortune = (fortune: Fortune) => {
    setFortune(fortune);
  };

  const value: FortuneContextValue = {
    user,
    fortune,
    recentFortunes,
    status,
    error,
    crackFortune,
    refreshUser,
    selectFortune,
  };

  return <FortuneContext.Provider value={value}>{children}</FortuneContext.Provider>;
};

export const useFortuneContext = (): FortuneContextValue => {
  const context = useContext(FortuneContext);
  if (!context) {
    throw new Error('useFortuneContext must be used within a FortuneProvider');
  }
  return context;
};
