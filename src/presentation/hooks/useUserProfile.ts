import { useEffect, useMemo, useRef, useState } from 'react';
import type { UserProfile } from '../../domain/entities/user';
import { LocalUserRepository } from '../../data/repositories/LocalUserRepository';
import { LocalStorageClient } from '../../data/storage/LocalStorageClient';

interface UseUserProfileResult {
  profile: UserProfile | null;
  isLoading: boolean;
  saveProfile: (next: Partial<UserProfile>) => Promise<void>;
}

export const useUserProfile = (): UseUserProfileResult => {
  const storageClient = useMemo(() => new LocalStorageClient(typeof window !== 'undefined' ? window.localStorage : null), []);
  const repositoryRef = useRef(new LocalUserRepository(storageClient));

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const stored = await repositoryRef.current.getProfile();
      setProfile(stored);
      setIsLoading(false);
    };
    void load();
  }, []);

  const saveProfile = async (next: Partial<UserProfile>) => {
    if (!profile) return;
    const updated: UserProfile = { ...profile, ...next };
    await repositoryRef.current.saveProfile(updated);
    setProfile(updated);
  };

  return { profile, isLoading, saveProfile };
};
