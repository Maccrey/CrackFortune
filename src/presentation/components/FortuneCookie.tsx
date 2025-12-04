import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FortuneCookie: React.FC = () => {
    const navigate = useNavigate();
    const [isCracked, setIsCracked] = useState(false);

    const handleCrack = () => {
        if (isCracked) return;
        setIsCracked(true);
        // Navigate after animation
        setTimeout(() => {
            navigate('/result');
        }, 3500);
    };

    return (
        <div className="relative w-80 h-80 flex items-center justify-center cursor-pointer" onClick={handleCrack} data-testid="fortune-cookie">
            {/* Persistent Definitions for Gradients and Filters */}
            <svg width="0" height="0" className="absolute pointer-events-none">
                <defs>
                    <linearGradient id="cookieGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FCD34D" /> {/* yellow-300 */}
                        <stop offset="100%" stopColor="#F59E0B" /> {/* amber-500 */}
                    </linearGradient>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
            </svg>

            <AnimatePresence>
                {!isCracked ? (
                    <motion.div
                        key="cookie"
                        initial={{ scale: 0.8, y: 0 }}
                        animate={{
                            y: [0, -15, 0],
                            rotate: [0, 1, -1, 0]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full h-full flex items-center justify-center filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                    >
                        <svg viewBox="0 0 200 200" className="w-full h-full">
                            {/* Main Cookie Shape - Uncracked */}
                            <path
                                d="M100,40 C60,40 30,70 30,110 C30,150 60,170 100,170 C140,170 170,150 170,110 C170,70 140,40 100,40 Z"
                                fill="url(#cookieGradient)"
                                stroke="#B45309"
                                strokeWidth="2"
                            />
                            {/* Fold lines for detail */}
                            <path d="M30,110 Q65,110 100,140" fill="none" stroke="#B45309" strokeWidth="1" opacity="0.5" />
                            <path d="M170,110 Q135,110 100,140" fill="none" stroke="#B45309" strokeWidth="1" opacity="0.5" />
                            <path d="M100,40 Q100,80 100,110" fill="none" stroke="#B45309" strokeWidth="1" opacity="0.3" />
                        </svg>

                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-4xl opacity-0">🥠</span>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="cracked"
                        className="relative w-full h-full"
                    >
                        {/* Left Half */}
                        <motion.div
                            initial={{ x: 0, rotate: 0 }}
                            animate={{ x: -60, rotate: -25 }}
                            transition={{ duration: 0.8, ease: "backOut" }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <svg viewBox="0 0 200 200" className="w-full h-full">
                                <path
                                    d="M100,40 C60,40 30,70 30,110 C30,150 60,170 100,170 L100,110 L100,40 Z"
                                    fill="url(#cookieGradient)"
                                    stroke="#B45309"
                                    strokeWidth="2"
                                />
                                <path d="M30,110 Q65,110 100,140" fill="none" stroke="#B45309" strokeWidth="1" opacity="0.5" />
                            </svg>
                        </motion.div>

                        {/* Right Half */}
                        <motion.div
                            initial={{ x: 0, rotate: 0 }}
                            animate={{ x: 60, rotate: 25 }}
                            transition={{ duration: 0.8, ease: "backOut" }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <svg viewBox="0 0 200 200" className="w-full h-full">
                                <path
                                    d="M100,40 L100,110 L100,170 C140,170 170,150 170,110 C170,70 140,40 100,40 Z"
                                    fill="url(#cookieGradient)"
                                    stroke="#B45309"
                                    strokeWidth="2"
                                />
                                <path d="M170,110 Q135,110 100,140" fill="none" stroke="#B45309" strokeWidth="1" opacity="0.5" />
                            </svg>
                        </motion.div>

                        {/* Fortune Slip */}
                        <motion.div
                            initial={{ scale: 0.2, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0, rotate: [0, 2, -2, 0] }}
                            transition={{
                                scale: { type: "spring", bounce: 0.5, duration: 0.8, delay: 0.1 },
                                y: { type: "spring", bounce: 0.5, duration: 0.8, delay: 0.1 },
                                opacity: { duration: 0.8, delay: 0.1 },
                                rotate: { duration: 0.8, ease: "easeInOut", delay: 0.1 }
                            }}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-16 bg-white shadow-2xl flex items-center justify-center p-1 z-20 rotate-[-5deg]"
                        >
                            <div className="w-full h-full border-2 border-red-400 border-double flex items-center justify-center bg-[#fffdf0]">
                                <span className="text-xs text-red-600 font-serif font-bold tracking-widest">운세</span>
                            </div>
                        </motion.div>

                        {/* Particle Effects (Crumbs) */}
                        {[...Array(5)].map((_, i) => (
                            <motion.div
                                key={`crumb-${i}`}
                                initial={{ x: 0, y: 0, opacity: 1 }}
                                animate={{
                                    x: (Math.random() - 0.5) * 150,
                                    y: (Math.random() - 0.5) * 150,
                                    opacity: 0
                                }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-600 rounded-full"
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FortuneCookie;
