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
        // Keep local data but update ID to match Firebase Auth UID
        await userRepo.saveProfile({ ...localProfile, id: this.authUserId });
        localStorage.removeItem('fortunecrack:user');
        console.log('Profile migrated to Firebase');
        profileMigrated = true;
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
