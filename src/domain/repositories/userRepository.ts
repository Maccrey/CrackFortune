import type { UserProfile } from '../entities/user';

export interface UserRepository {
  getProfile(): Promise<UserProfile>;
  saveProfile(profile: UserProfile): Promise<void>;
}
