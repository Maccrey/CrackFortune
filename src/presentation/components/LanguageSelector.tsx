import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import type { Language } from '../utils/translations';

const LanguageSelector: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as Language);
    };

    return (
        <div className="relative">
            <select
                value={language}
                onChange={handleChange}
                className="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-8 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer hover:bg-white/20 transition-colors"
            >
                <option value="en" className="bg-gray-800 text-white">English</option>
                <option value="ko" className="bg-gray-800 text-white">한국어</option>
                <option value="ja" className="bg-gray-800 text-white">日本語</option>
                <option value="zh" className="bg-gray-800 text-white">中文</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};

export default LanguageSelector;
