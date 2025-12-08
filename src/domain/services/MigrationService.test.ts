// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MigrationService } from './MigrationService';
import { FirebaseUserRepository } from '../../data/repositories/FirebaseUserRepository';
import { FirebaseFortuneRepository } from '../../data/repositories/FirebaseFortuneRepository';

// Mock dependencies
vi.mock('../../data/repositories/FirebaseUserRepository');
vi.mock('../../data/repositories/FirebaseFortuneRepository');

describe('MigrationService', () => {
  const mockUserId = 'firebase-uid-123';
  let service: MigrationService;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    service = new MigrationService(mockUserId);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should migrated user profile if exists in localStorage', async () => {
    // Setup Local Storage
    const localProfile = { id: 'local', name: 'Test User', locale: 'en' };
    localStorage.setItem('fortunecrack:user', JSON.stringify(localProfile));

    // Mock Repository
    const saveProfileMock = vi.fn().mockResolvedValue(undefined);
    // @ts-ignore
    FirebaseUserRepository.mockImplementation(() => ({
      saveProfile: saveProfileMock
    }));

    // Execute
    const result = await service.migrate();

    // Verify
    expect(result.profileMigrated).toBe(true);
    expect(saveProfileMock).toHaveBeenCalledWith(expect.objectContaining({
      id: mockUserId, // Should be updated to Auth UID
      name: 'Test User'
    }));
    expect(localStorage.getItem('fortunecrack:user')).toBeNull(); // Should be deleted
  });

  it('should migrate fortunes if exist in localStorage', async () => {
    // Setup Local Storage
    const localFortunes = {
      'local:2025-01-01': { id: 'local:2025-01-01', date: '2025-01-01', userId: 'local', summary: 'Good luck' }
    };
    localStorage.setItem('fortunecrack:fortunes', JSON.stringify(localFortunes));

    // Mock Repository
    const saveFortuneMock = vi.fn().mockResolvedValue(undefined);
    // @ts-ignore
    FirebaseFortuneRepository.mockImplementation(() => ({
      saveFortune: saveFortuneMock
    }));

    // Execute
    const result = await service.migrate();

    // Verify
    expect(result.fortunesMigrated).toBe(1);
    expect(saveFortuneMock).toHaveBeenCalledWith(expect.objectContaining({
      userId: mockUserId, // Should be updated
      date: '2025-01-01'
    }));
    expect(localStorage.getItem('fortunecrack:fortunes')).toBeNull(); // Should be deleted
  });

  it('should handle no local data gracefully', async () => {
    const result = await service.migrate();
    expect(result.profileMigrated).toBe(false);
    expect(result.fortunesMigrated).toBe(0);
  });
});
