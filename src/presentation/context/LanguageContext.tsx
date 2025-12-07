import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { translations } from '../utils/translations';
import type { Language } from '../utils/translations';
import { analyticsEvents } from '../../config/firebase';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'fortunecrack:language';

// 브라우저 언어 감지 함수
const detectBrowserLanguage = (): Language => {
  // localStorage에 저장된 언어 우선
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && (stored === 'ko' || stored === 'ja' || stored === 'en')) {
    return stored as Language;
  }

  // 브라우저 언어 감지
  const browserLang = navigator.language.toLowerCase();
  
  // 한국어 체크
  if (browserLang.startsWith('ko')) {
    return 'ko';
  }
  // 일본어 체크
  if (browserLang.startsWith('ja')) {
    return 'ja';
  }
  // 그 외는 모두 영어
  return 'en';
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // 초기 상태부터 브라우저 언어 적용
    const [language, setLanguageState] = useState<Language>(detectBrowserLanguage);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
        analyticsEvents.languageChanged(lang);
    };

    const t = (key: keyof typeof translations['en']) => {
        return translations[language][key] || translations['en'][key];
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
