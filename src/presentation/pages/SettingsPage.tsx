import React from 'react';

const SettingsPage: React.FC = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Settings</h2>
            <div className="space-y-6">
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h3 className="font-medium mb-2">Language</h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white/10 rounded text-sm">English</button>
                        <button className="px-3 py-1 bg-transparent text-gray-400 rounded text-sm">한국어</button>
                        <button className="px-3 py-1 bg-transparent text-gray-400 rounded text-sm">日本語</button>
                    </div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                    <h3 className="font-medium mb-2">Theme</h3>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white/10 rounded text-sm">Dark</button>
                        <button className="px-3 py-1 bg-transparent text-gray-400 rounded text-sm">Light</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
