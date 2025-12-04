import React from 'react';

const DesktopSidebar: React.FC = () => {
    return (
        <div className="flex flex-col h-full p-8 gap-6 overflow-y-auto custom-scrollbar">
            {/* Greeting Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-500 mb-2">
                    좋은 오후입니다
                </h2>
                <p className="text-gray-400">오늘의 운세를 확인해보세요.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 backdrop-blur-md border border-white/5 p-4 rounded-2xl">
                    <div className="text-2xl mb-1">🥠</div>
                    <div className="text-2xl font-bold text-white">12</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">확인한 운세</div>
                </div>
                <div className="bg-black/20 backdrop-blur-md border border-white/5 p-4 rounded-2xl">
                    <div className="text-2xl mb-1">🔥</div>
                    <div className="text-2xl font-bold text-white">5</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider">연속 출석</div>
                </div>
            </div>

            {/* Recent History */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl flex-1">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <span>📜</span> 최근 운세
                </h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="group cursor-pointer">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>어제</span>
                                <span className="text-yellow-500/50 group-hover:text-yellow-400 transition-colors">보기</span>
                            </div>
                            <p className="text-sm text-gray-300 line-clamp-2 group-hover:text-white transition-colors">
                                기다리는 자에게 복이 오지만, 나아가 쟁취하는 자에게는 더 큰 복이 옵니다.
                            </p>
                            <div className="h-px bg-white/5 mt-3" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Daily Quote */}
            <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-xl">
                <div className="text-4xl text-purple-400 mb-2">"</div>
                <p className="text-lg text-white font-serif italic leading-relaxed relative z-10">
                    미래를 예측하는 가장 좋은 방법은 미래를 창조하는 것이다.
                </p>
                <div className="text-right text-sm text-purple-300 mt-4 font-medium">— 피터 드러커</div>
            </div>
        </div>
    );
};

export default DesktopSidebar;
