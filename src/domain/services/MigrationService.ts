import type { UserProfile } from '../../domain/entities/user';
import type { Fortune } from '../../domain/entities/fortune';
import { FirebaseUserRepository } from '../../data/repositories/FirebaseUserRepository';
import { FirebaseFortuneRepository } from '../../data/repositories/FirebaseFortuneRepository';

export class MigrationService {
  private readonly authUserId: string;

  constructor(authUserId: string) {
    this.authUserId = authUserId;
  }

  async migrate(): Promise<{ profileMigrated: boolean; fortunesMigrated: number }> {
    let profileMigrated = false;
    let fortunesMigrated = 0;

    try {
      // 1. Profile Migration
      const localProfileJson = localStorage.getItem('fortunecrack:user');
      if (localProfileJson) {
        const localProfile = JSON.parse(localProfileJson) as UserProfile;
        const userRepo = new FirebaseUserRepository(this.authUserId);
        
        // Check if remote profile already exists and is valid
        const remoteProfile = await userRepo.getProfile();
        const isRemoteValid = remoteProfile.name && remoteProfile.birthDate;

        if (isRemoteValid) {
          console.log('Valid remote profile exists, skipping overwrite from local');
          // We still want to clear local storage to prevent confusion, 
          // or maybe we should just leave it? 
          // If we don't clear it, next time it might try again?
          // Actually, if we logged in, we switch to Firebase Repo, so local storage is ignored.
          // But cleaning up is good practice after "sync" attempt.
          localStorage.removeItem('fortunecrack:user');
        } else {
          // Keep local data but update ID to match Firebase Auth UID
          await userRepo.saveProfile({ ...localProfile, id: this.authUserId });
          localStorage.removeItem('fortunecrack:user');
          console.log('Profile migrated to Firebase');
          profileMigrated = true;
        }
      }

      // 2. Fortune Migration
      const localFortunesJson = localStorage.getItem('fortunecrack:fortunes');
      if (localFortunesJson) {
        const fortunesMap = JSON.parse(localFortunesJson) as Record<string, Fortune>;
        const fortuneRepo = new FirebaseFortuneRepository(this.authUserId);

        const migrations = Object.values(fortunesMap).map((fortune) => {
          const migratedFortune = { ...fortune, userId: this.authUserId };
          return fortuneRepo.saveFortune(migratedFortune);
        });

        await Promise.all(migrations);
        localStorage.removeItem('fortunecrack:fortunes');
        console.log(`Migrated ${migrations.length} fortunes to Firebase`);
        fortunesMigrated = migrations.length;
      }
    } catch (e) {
      console.error('Data migration failed:', e);
      throw e;
    }

    return { profileMigrated, fortunesMigrated };
  }
}
