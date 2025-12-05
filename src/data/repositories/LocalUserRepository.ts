import { createDefaultUserProfile, type UserProfile } from '../../domain/entities/user';
import type { UserRepository } from '../../domain/repositories/userRepository';
import { LocalStorageClient } from '../storage/LocalStorageClient';

const USER_KEY = 'fortunecrack:user';

export class LocalUserRepository implements UserRepository {
  private readonly storage: LocalStorageClient;

  constructor(storage: LocalStorageClient) {
    this.storage = storage;
  }

  async getProfile(): Promise<UserProfile> {
    const profile = this.storage.read<UserProfile>(USER_KEY);
    if (profile) return profile;
    const fallback = createDefaultUserProfile();
    this.storage.write(USER_KEY, fallback);
    return fallback;
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    const next = { ...profile, updatedAt: new Date().toISOString() };
    this.storage.write(USER_KEY, next);
  }
}
