import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, logEvent, type Analytics } from 'firebase/analytics';

// Firebase 설정
// Firebase Console에서 프로젝트 설정 > 일반 > 웹 앱에서 확인 가능
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Firebase 초기화 (환경 변수가 유효하고 placeholder가 아닐 때만)
let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;

const isValidConfig = (config: typeof firebaseConfig) => {
  if (!config.projectId || !config.apiKey) return false;
  // placeholder 값 체크
  if (config.projectId.includes('your-project-id')) return false;
  if (config.apiKey.includes('your_firebase_api_key')) return false;
  if (config.appId?.includes('1:123:web:abc')) return false;
  return true;
};

if (isValidConfig(firebaseConfig)) {
  try {
    app = initializeApp(firebaseConfig);
    
    // Analytics 초기화 (브라우저 환경에서만)
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
      console.log('[Firebase] Analytics initialized');
    }
  } catch (error) {
    console.warn('[Firebase] Initialization failed:', error);
  }
} else {
  console.log('[Firebase] Analytics disabled - missing configuration');
}

// Analytics 이벤트 로깅 헬퍼 함수
export const logAnalyticsEvent = (eventName: string, params?: Record<string, any>) => {
  if (analytics) {
    logEvent(analytics, eventName, params);
    console.log(`[Analytics] ${eventName}`, params);
  }
};

// 커스텀 이벤트들
export const analyticsEvents = {
  // 포춘 관련
  fortuneCracked: (date: string) => {
    logAnalyticsEvent('fortune_cracked', { date });
  },
  fortuneViewed: (date: string) => {
    logAnalyticsEvent('fortune_viewed', { date });
  },
  
  // 프로필 관련
  profileUpdated: () => {
    logAnalyticsEvent('profile_updated');
  },
  
  // 페이지 뷰
  pageView: (pageName: string) => {
    logAnalyticsEvent('page_view', { page_name: pageName });
  },
  
  // 언어 변경
  languageChanged: (language: string) => {
    logAnalyticsEvent('language_changed', { language });
  }
};

export { app, analytics };
