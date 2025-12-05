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
import { useAuth } from './AuthContext';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface FortuneContextValue {
  user: UserProfile | null;
  fortune: Fortune | null;
  recentFortunes: Fortune[];
  status: Status;
  error: string | null;
  crackFortune: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const FortuneContext = createContext<FortuneContextValue | undefined>(undefined);

export const FortuneProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const storageClient = useMemo(() => new LocalStorageClient(typeof window !== 'undefined' ? window.localStorage : null), []);
  const { user: authUser } = useAuth();

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

  const refreshUser = async () => {
    const profile = await userRepositoryRef.current.getProfile();
    // 인증된 사용자가 있으면 프로필 id를 동기화
    const mergedProfile = authUser
      ? {
        ...profile,
        id: authUser.uid,
        name: profile.name || authUser.displayName || 'Traveler',
        updatedAt: new Date().toISOString(),
      }
      : profile;

    if (mergedProfile.id !== profile.id) {
      await userRepositoryRef.current.saveProfile(mergedProfile);
    }

    setUser(mergedProfile);
    await loadCachedFortune(mergedProfile);
  };

  useEffect(() => {
    void refreshUser();
  }, [authUser]);

  const crackFortune = async () => {
    if (!user) return;
    setStatus('loading');
    setError(null);
    try {
      const result = await useCaseRef.current.execute({ user });
      setFortune(result);
      const recents = await fortuneRepositoryRef.current.listRecentFortunes(user.id);
      setRecentFortunes(recents);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다');
    }
  };

  const value: FortuneContextValue = {
    user,
    fortune,
    recentFortunes,
    status,
    error,
    crackFortune,
    refreshUser,
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
