import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useFortuneContext } from '../context/FortuneContext';
import KakaoAdFit from './KakaoAdFit';

const DesktopSidebar: React.FC = () => {
    const { t } = useLanguage();
    const { recentFortunes, fortune } = useFortuneContext();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // 오늘 날짜의 운세가 있는지 확인
    const today = new Date().toISOString().slice(0, 10);
    const hasTodaysFortune = fortune && fortune.date === today;

    // 최근 운세 3개까지 표시
    const displayFortunes = recentFortunes.slice(0, 3);

    return (
        <div className="h-full flex flex-col p-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none" />

            {/* Greeting Section */}
            <div className="mb-12 relative z-10">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 mb-2 font-mystical">
                    {t('greeting')}
                </h2>
                <p className="text-gray-400 font-mono text-sm">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 mb-12 relative z-10">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors group">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t('stats_cracked')}</div>
                    <div className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors">{recentFortunes.length}</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-xl hover:bg-white/10 transition-colors group">
                    <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{t('stats_streak')}</div>
                    <div className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors">
                        {hasTodaysFortune ? '🔥' : '-'} {t('nav_today')}
                    </div>
                </div>
            </div>

            {/* Recent History Preview */}
            <div className="flex-1 relative z-10">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
                    {t('stats_recent')}
                </h3>
                <div className="space-y-3">
                    {displayFortunes.length > 0 ? (
                        displayFortunes.map((f) => (
                            <div key={f.id} className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer p-2 rounded-lg hover:bg-white/5">
                                <div className="w-2 h-2 rounded-full bg-purple-500/50" />
                                <span className="truncate">{f.summary}</span>
                            </div>
                        ))
                    ) : (
                        <div className="text-sm text-gray-500 italic">쿠키를 깨트려 보세요!</div>
                    )}
                </div>
            </div>

            {/* Daily Quote */}
            <div className="mt-auto pt-8 border-t border-white/10 relative z-10">
                <div className="text-xs text-purple-300 uppercase tracking-wider mb-2">{t('quote_title')}</div>
                <blockquote className="text-sm text-gray-300 italic leading-relaxed font-serif">
                    "{hasTodaysFortune && fortune?.quote ? fortune.quote : 'The future belongs to those who believe in the beauty of their dreams.'}"
                </blockquote>
            </div>

            {/* AdFit Placement for PC Sidebar */}
            {/* Suggested size: 300x250 */}
            <div className="mt-6 relative z-10 flex justify-center">
                <KakaoAdFit 
                    unitId="DAN-v6FTObnKG2MeUAct" 
                    width="300" 
                    height="250" 
                    className="rounded-xl overflow-hidden shadow-lg bg-white/5"
                />
            </div>
        </div>
    );
};

export default DesktopSidebar;
