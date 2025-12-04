import React, { useState } from 'react';
import { motion } from 'framer-motion';

type Tab = 'daily' | 'weekly' | 'monthly' | 'yearly';

const HistoryPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('daily');

    const tabs: { id: Tab; label: string }[] = [
        { id: 'daily', label: '일간' },
        { id: 'weekly', label: '주간' },
        { id: 'monthly', label: '월간' },
        { id: 'yearly', label: '연간' },
    ];

    // Mock Data
    const historyData = [
        { id: 1, date: '2023-10-24', summary: '저녁에 놀라운 일이 기다리고 있습니다.', type: 'daily' },
        { id: 2, date: '2023-10-23', summary: '오늘은 인내가 최고의 미덕입니다.', type: 'daily' },
        { id: 3, date: '2023-10-22', summary: '오랜 친구에게서 연락이 올 수 있습니다.', type: 'daily' },
        { id: 4, date: '42주차', summary: '건강과 웰빙에 집중하세요.', type: 'weekly' },
        { id: 5, date: '10월', summary: '변화와 성장의 달입니다.', type: 'monthly' },
    ];

    const filteredData = historyData.filter(item => item.type === activeTab || (activeTab === 'daily' && item.type === 'daily'));

    return (
        <div className="p-6 h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                운세 대시보드
            </h2>

            {/* Tabs */}
            <div className="flex bg-white/5 rounded-xl p-1 mb-6 border border-white/10">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-white/10 text-yellow-400 shadow-lg'
                                : 'text-gray-400 hover:text-gray-200'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-yellow-500/30 transition-colors group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-yellow-500/80 uppercase tracking-wider bg-yellow-500/10 px-2 py-1 rounded">
                                    {item.date}
                                </span>
                                <span className="text-xl group-hover:scale-110 transition-transform">✨</span>
                            </div>
                            <p className="text-gray-200 font-light leading-relaxed">
                                {item.summary}
                            </p>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center text-gray-500 mt-10">
                        <p>이 기간의 기록이 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;
