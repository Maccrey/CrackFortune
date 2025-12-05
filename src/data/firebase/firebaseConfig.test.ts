import { describe, expect, it } from 'vitest';
import { buildFirebaseConfig } from './firebaseConfig';

const baseEnv = {
  VITE_FIREBASE_API_KEY: 'api',
  VITE_FIREBASE_AUTH_DOMAIN: 'project.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'project-id',
  VITE_FIREBASE_STORAGE_BUCKET: 'project.appspot.com',
  VITE_FIREBASE_MESSAGING_SENDER_ID: 'sender',
  VITE_FIREBASE_APP_ID: 'app-id',
  VITE_FIREBASE_MEASUREMENT_ID: 'G-123',
};

describe('buildFirebaseConfig', () => {
  it('필수 키가 모두 있으면 설정을 반환한다', () => {
    const config = buildFirebaseConfig(baseEnv);
    expect(config.apiKey).toBe('api');
    expect(config.projectId).toBe('project-id');
  });

  it('필수 키가 없으면 오류를 던진다', () => {
    expect(() => buildFirebaseConfig({ ...baseEnv, VITE_FIREBASE_API_KEY: undefined })).toThrowError(
      /VITE_FIREBASE_API_KEY/
    );
  });
});
