import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useFortuneContext } from '../context/FortuneContext';

const HistoryPage: React.FC = () => {
    const { t } = useLanguage();
    const { recentFortunes, status, selectFortune } = useFortuneContext();
    const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('daily');
    const navigate = useNavigate();

    const tabs = [
        { id: 'daily', label: t('tab_daily') },
        { id: 'weekly', label: t('tab_weekly') },
        { id: 'monthly', label: t('tab_monthly') },
        { id: 'yearly', label: t('tab_yearly') },
    ];

    const filteredFortunes = useMemo(() => {
        if (activeTab === 'daily') return recentFortunes;
        // For now, simple grouping placeholder until weekly/monthly aggregation is added.
        return recentFortunes;
    }, [activeTab, recentFortunes]);

    const handleFortuneClick = (fortune: typeof recentFortunes[0]) => {
        selectFortune(fortune);
        navigate('/result');
    };

    return (
        <div className="flex-1 flex flex-col p-4 md:p-6 h-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-200 to-pink-200 font-mystical">
                {t('dashboard_title')}
            </h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-white/20 text-white shadow-lg backdrop-blur-md border border-white/10'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area (Scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                {status === 'loading' && (
                    <div className="text-sm text-gray-400">최근 운세를 불러오는 중...</div>
                )}

                {!filteredFortunes.length && status !== 'loading' && (
                    <div className="text-sm text-gray-400">아직 저장된 운세가 없습니다. 쿠키를 깨트려 보세요!</div>
                )}

                {filteredFortunes.map((fortune) => (
                    <div 
                        key={fortune.id} 
                        className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group"
                        onClick={() => handleFortuneClick(fortune)}
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-xs text-purple-300 font-mono">{fortune.date}</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider group-hover:text-yellow-400 transition-colors">
                                {activeTab === 'daily' ? 'Daily' : activeTab === 'weekly' ? 'Weekly' : 'Monthly'}
                            </div>
                        </div>
                        <h3 className="text-white font-bold mb-1 group-hover:text-purple-200 transition-colors">
                            {fortune.summary}
                        </h3>
                        <p className="text-sm text-gray-400 line-clamp-2">
                            {fortune.fullText}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryPage;
