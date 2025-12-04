import React from 'react';

const HistoryPage: React.FC = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">History</h2>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <div className="text-sm text-gray-400 mb-1">2023-10-{10 + i}</div>
                        <div className="text-gray-200">Fortune summary goes here...</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryPage;
