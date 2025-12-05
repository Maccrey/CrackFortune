import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

interface IntroOverlayProps {
    onComplete: () => void;
}

const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useLanguage();

    const handleOpen = () => {
        setIsOpen(true);
        setTimeout(onComplete, 2000); // Wait for animation to finish before unmounting
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden pointer-events-auto">
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        className="absolute inset-0 flex w-full h-full"
                        exit={{ opacity: 0, transition: { duration: 1, delay: 1 } }}
                    >
                        {/* Left Door */}
                        <motion.div
                            className="w-1/2 h-full bg-[#1a1a1a] relative border-r-4 border-[#2a2a2a] flex items-center justify-end shadow-2xl"
                            initial={{ x: 0 }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%', transition: { duration: 1.5, ease: "easeInOut" } }}
                        >
                            {/* Wood Texture / Pattern */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/50" />

                            {/* Decorative Elements */}
                            <div className="w-full h-full border-8 border-[#3a3a3a] absolute inset-0 m-4 opacity-50" />
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-64 bg-[#2a2a2a] rounded-full shadow-inner" />

                            {/* Door Handle Area */}
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <motion.div
                                    className="w-16 h-16 rounded-full border-4 border-yellow-600/50 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-yellow-900/20 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleOpen}
                                >
                                    <div className="w-8 h-8 rounded-full bg-yellow-600/80 shadow-[0_0_15px_rgba(202,138,4,0.5)]" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right Door */}
                        <motion.div
                            className="w-1/2 h-full bg-[#1a1a1a] relative border-l-4 border-[#2a2a2a] flex items-center justify-start shadow-2xl"
                            initial={{ x: 0 }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%', transition: { duration: 1.5, ease: "easeInOut" } }}
                        >
                            {/* Wood Texture / Pattern */}
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] mix-blend-overlay" />
                            <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-transparent to-black/50" />

                            {/* Decorative Elements */}
                            <div className="w-full h-full border-8 border-[#3a3a3a] absolute inset-0 m-4 opacity-50" />
                            <div className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-64 bg-[#2a2a2a] rounded-full shadow-inner" />

                            {/* Door Handle Area */}
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <motion.div
                                    className="w-16 h-16 rounded-full border-4 border-yellow-600/50 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-yellow-900/20 transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleOpen}
                                >
                                    <div className="w-8 h-8 rounded-full bg-yellow-600/80 shadow-[0_0_15px_rgba(202,138,4,0.5)]" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Central Text / Hint */}
                        <motion.div
                            className="absolute top-3/4 left-1/2 -translate-x-1/2 text-center pointer-events-none"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <p className="text-yellow-500/80 font-mystical text-xl tracking-[0.2em] uppercase animate-pulse">
                                {t('cookie_hint') || "Click to Enter"}
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default IntroOverlay;
