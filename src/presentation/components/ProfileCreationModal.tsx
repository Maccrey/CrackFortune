import React, { useState } from 'react';
import { useFortuneContext } from '../context/FortuneContext';
import { useLanguage } from '../context/LanguageContext';

interface ProfileCreationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export const ProfileCreationModal: React.FC<ProfileCreationModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const { t } = useLanguage();
    const { saveUser, user } = useFortuneContext();
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState<{ name: string; birthDate: string; birthTime: string; calendarType: 'solar' | 'lunar' }>({
        name: user?.name || '',
        birthDate: user?.birthDate || '',
        birthTime: user?.birthTime || '',
        calendarType: (user?.calendarType as 'solar' | 'lunar') || 'solar'
    });

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!form.name.trim() || !form.birthDate.trim()) {
            // Simple validation, could be improved with error states
            return;
        }

        setIsLoading(true);
        try {
            await saveUser({
                name: form.name,
                birthDate: form.birthDate,
                birthTime: form.birthTime,
                calendarType: form.calendarType
            });
            onSuccess();
        } catch (error) {
            console.error('Failed to save profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
             <div className="relative w-full max-w-md p-6 overflow-hidden rounded-2xl bg-white/10 border border-white/20 shadow-2xl backdrop-blur-md animate-scale-in will-change-transform">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -translate-x-10 -translate-y-10" />
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl translate-x-10 translate-y-10" />

                <div className="relative flex flex-col space-y-6">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white tracking-wide">{t('profile_create_title')}</h3>
                        <p className="text-sm text-white/70">{t('profile_create_desc')}</p>
                    </div>

                    <div className="space-y-4">
                        {/* Name Input */}
                        <div>
                            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">{t('input_name_label')}</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:bg-black/30 transition-all"
                                placeholder={t('input_name_label')}
                            />
                        </div>

                        {/* Birth Date Input - Native Date Picker */}
                        <div>
                            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">{t('input_birthdate_label')}</label>
                             <div className="flex gap-2">
                                <input
                                    type="date"
                                    value={form.birthDate}
                                    onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                                    className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition-colors [color-scheme:dark]"
                                />
                                <div className="flex bg-black/20 rounded-lg p-1 border border-white/10 shrink-0">
                                    <button
                                        onClick={() => setForm({ ...form, calendarType: 'solar' })}
                                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${form.calendarType === 'solar' ? 'bg-yellow-500/20 text-yellow-500' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        {t('label_solar')}
                                    </button>
                                    <button
                                        onClick={() => setForm({ ...form, calendarType: 'lunar' })}
                                        className={`px-3 py-1 rounded text-xs font-medium transition-all ${form.calendarType === 'lunar' ? 'bg-purple-500/20 text-purple-400' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        {t('label_lunar')}
                                    </button>
                                </div>
                            </div>
                        </div>

                         {/* Birth Time Input */}
                         <div>
                            <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wider">{t('input_birthtime_label')}</label>
                            <input
                                type="time"
                                value={form.birthTime}
                                onChange={(e) => setForm({ ...form, birthTime: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-base text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 transition-colors [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-2">
                        <button
                            onClick={handleSave}
                            disabled={isLoading || !form.name || !form.birthDate}
                            className="w-full py-3 px-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? '...' : t('btn_complete_profile')}
                        </button>
                         <button
                            onClick={onClose}
                            className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-medium rounded-xl transition-colors duration-200"
                        >
                            {t('login_prompt_later')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
