import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

const requiredKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
] as const;

type FirebaseEnv = Record<string, string | undefined>;

export const buildFirebaseConfig = (env: FirebaseEnv) => {
  const missing = requiredKeys.filter((key) => !env[key]);
  if (missing.length) {
    throw new Error(`Firebase env missing: ${missing.join(', ')}`);
  }

  return {
    apiKey: env.VITE_FIREBASE_API_KEY as string,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: env.VITE_FIREBASE_APP_ID as string,
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
  };
};

let firebaseApp: FirebaseApp | null = null;

export const getFirebaseApp = () => {
  if (firebaseApp) return firebaseApp;
  const config = buildFirebaseConfig(import.meta.env as FirebaseEnv);
  firebaseApp = getApps()[0] ?? initializeApp(config);
  return firebaseApp;
};
