import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { Fortune } from '../../domain/entities/fortune';
import type { UserProfile } from '../../domain/entities/user';
import { GetDailyFortuneUseCase } from '../../domain/usecases/getDailyFortune';
import { LocalFortuneRepository } from '../../data/repositories/LocalFortuneRepository';
import { GroqFortuneRepository } from '../../data/repositories/GroqFortuneRepository';
import { LocalUserRepository } from '../../data/repositories/LocalUserRepository';
import { LocalStorageClient } from '../../data/storage/LocalStorageClient';
import { GroqClient } from '../../data/services/GroqClient';
import { useLanguage } from './LanguageContext';
import { FirebaseFortuneRepository } from '../../data/repositories/FirebaseFortuneRepository';
import { FirebaseUserRepository } from '../../data/repositories/FirebaseUserRepository';
import { useAuth } from './AuthContext';
import { analyticsEvents } from '../../config/firebase';
import { getLocalDateString } from '../utils/dateUtils';

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
  saveUser: (updates: Partial<UserProfile>) => Promise<void>;
}

const FortuneContext = createContext<FortuneContextValue | undefined>(undefined);

export const FortuneProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { language } = useLanguage();


  const { user: authUser, loading: authLoading } = useAuth();
  
  // Repositories initialization
  const repositories = useMemo(() => {
    const localClient = new LocalStorageClient(window.localStorage);
    
    if (authUser) {
      console.log('[FortuneContext] Using Firebase Repositories');
      return {
        userRepo: new FirebaseUserRepository(authUser.uid),
        fortuneRepo: new FirebaseFortuneRepository(authUser.uid)
      };
    } else {
      console.log('[FortuneContext] Using Local Storage Repositories');
      return {
        userRepo: new LocalUserRepository(localClient),
        fortuneRepo: new LocalFortuneRepository(localClient) // Note: This uses local storage, might need Groq for generation if separate? 
        // Actually LocalFortuneRepository likely implements generation or stores/retrieves. 
        // Wait, LocalFortuneRepository in this codebase seemed to wrap generation too? 
        // Let's check previous file content. 
        // Previous Content: const fortuneRepositoryRef = useRef(new LocalFortuneRepository(storageClient));
        // And GetDailyFortuneUseCase takes (fortuneRepo, generator).
        // If LocalFortuneRepository is just storage, we still need a generator.
      };
    }
  }, [authUser]);

  const generator = useMemo(() => new GroqFortuneRepository(new GroqClient()), []);
  const useCase = useMemo(() => new GetDailyFortuneUseCase(repositories.fortuneRepo, generator), [repositories.fortuneRepo, generator]);

  // Update refs for potential imperative usage if needed, or better, remove refs and use state/effects directly.
  // The original code used refs for repositories to avoid re-creation, but useMemo handles that.
  // However, methods like `refreshUser` used `userRepositoryRef.current`.
  
  const userRepository = repositories.userRepo;
  const fortuneRepository = repositories.fortuneRepo;


  const [user, setUser] = useState<UserProfile | null>(null);
  const [fortune, setFortune] = useState<Fortune | null>(null);
  const [recentFortunes, setRecentFortunes] = useState<Fortune[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);

  const loadCachedFortune = async (profile: UserProfile) => {
    const today = getLocalDateString();
    const cached = await fortuneRepository.getFortuneByDate(profile.id, today);
    setFortune(cached);
    const recents = await fortuneRepository.listRecentFortunes(profile.id);
    setRecentFortunes(recents);
  };

  const normalizeLocale = (lang: string): UserProfile['locale'] => {
    if (lang.startsWith('ko')) return 'ko';
    if (lang.startsWith('ja')) return 'ja';
    if (lang.startsWith('zh')) return 'zh';
    return 'en';
  };

  const refreshUser = async () => {
    try {
      const profile = await userRepository.getProfile();
      const normalized = normalizeLocale(language);
      
      console.log('[FortuneContext] Language sync:', { 
        languageContext: language, 
        profileLocale: profile.locale, 
        normalized 
      });

      const mergedProfile = profile.locale === normalized ? profile : { ...profile, locale: normalized };
      if (mergedProfile.locale !== profile.locale) {
        console.log('[FortuneContext] Updating profile locale:', profile.locale, '→', normalized);
        await userRepository.saveProfile(mergedProfile);
      }
      setUser(mergedProfile);
      await loadCachedFortune(mergedProfile);
    } catch (e) {
      console.error('[FortuneContext] refreshUser failed', e);
    }
  };

  // 초기 진입 및 인증 상태 변경 시 데이터 갱신
  useEffect(() => {
    if (authLoading) return; // Wait for auth loading/migration
    void refreshUser();
  }, [authUser, authLoading]); // repositories는 authUser에 의존하므로 authUser 변경 시 실행됨

  // 언어 변경 시 프로필 locale 동기화
  useEffect(() => {
    if (user) {
      const normalized = normalizeLocale(language);
      if (user.locale !== normalized) {
        const mergedProfile = { ...user, locale: normalized };
        userRepository.saveProfile(mergedProfile);
        setUser(mergedProfile);
      }
    }
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
      const result = await useCase.execute({ user });
      setFortune(result);
      const recents = await fortuneRepository.listRecentFortunes(user.id);
      setRecentFortunes(recents);
      setStatus('success');
      
      // Analytics: 포춘 생성 이벤트
      analyticsEvents.fortuneCracked(result.date);
      
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

  const saveUser = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates }; 
    try {
      await userRepository.saveProfile(updatedUser);
      setUser(updatedUser);
    } catch (e) {
      console.error('[FortuneContext] saveUser failed', e);
      throw e;
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
    selectFortune,
    saveUser,
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
