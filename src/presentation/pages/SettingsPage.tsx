import React, { useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';

const SettingsPage: React.FC = () => {
    const { profile, isLoading, saveProfile } = useUserProfile();
    const [toast, setToast] = useState('');

    const handleSave = async () => {
        if (!profile) return;
        await saveProfile({ name: profile.name, birthDate: profile.birthDate, birthTime: profile.birthTime });
        setToast('프로필이 저장되었습니다');
        setTimeout(() => setToast(''), 2000);
    };

    const handleFieldChange = (field: 'name' | 'birthDate' | 'birthTime', value: string) => {
        if (!profile) return;
        saveProfile({ [field]: value } as any).catch(() => setToast('저장에 실패했습니다'));
    };

    return (
        <div className="p-6 pb-24 overflow-y-auto h-full">
            <h2 className="text-2xl font-bold mb-6 text-white tracking-wide">Settings</h2>

            {toast && (
                <div className="mb-4 text-sm text-yellow-200 bg-white/10 border border-white/20 rounded-lg px-4 py-2 inline-flex" data-testid="toast-message">
                    {toast}
                </div>
            )}

            <div className="space-y-6">
                {/* User Profile Section */}
                <section className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
                    <h3 className="text-lg font-semibold mb-4 text-yellow-400 flex items-center gap-2">
                        <span>👤</span> User Profile
                    </h3>

                    <div className="space-y-4">
                        {/* Name Input */}
                        <div>
                            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Name</label>
                            <input
                                type="text"
                                value={profile?.name ?? ''}
                                onChange={(e) => handleFieldChange('name', e.target.value)}
                                placeholder="Enter your name"
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition-colors"
                                data-testid="input-name"
                                disabled={isLoading}
                                inputMode="text"
                            />
                        </div>

                        {/* Birth Date Input */}
                        <div>
                            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Birth Date</label>
                            <input
                                type="date"
                                value={profile?.birthDate ?? ''}
                                onChange={(e) => handleFieldChange('birthDate', e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition-colors"
                                data-testid="input-birthdate"
                                disabled={isLoading}
                            />
                        </div>

                        {/* Birth Time Input */}
                        <div>
                            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">Birth Time</label>
                            <input
                                type="time"
                                value={profile?.birthTime ?? ''}
                                onChange={(e) => handleFieldChange('birthTime', e.target.value)}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition-colors"
                                data-testid="input-birthtime"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full mt-6 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-yellow-500/20 active:scale-95 transition-all"
                        data-testid="btn-save"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Save Profile'}
                    </button>
                </section>

                {/* Existing Settings (Visual Only) */}
                <section className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md opacity-75">
                    <h3 className="text-lg font-semibold mb-4 text-gray-300">Preferences</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Language</span>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 bg-white/10 rounded text-xs text-white">EN</span>
                                <span className="px-2 py-1 text-gray-600 text-xs">KO</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Theme</span>
                            <span className="px-2 py-1 bg-white/10 rounded text-xs text-white">Dark</span>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default SettingsPage;
