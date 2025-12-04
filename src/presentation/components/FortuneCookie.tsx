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
        }, 1500);
    };

    return (
        <div className="relative w-64 h-64 flex items-center justify-center cursor-pointer" onClick={handleCrack} data-testid="fortune-cookie">
            <AnimatePresence>
                {!isCracked ? (
                    <motion.div
                        key="cookie"
                        initial={{ scale: 0.8, y: 0 }}
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, 2, -2, 0]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95, rotate: [0, -5, 5, 0], transition: { duration: 0.2 } }}
                        className="w-48 h-48 bg-yellow-200 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(253,224,71,0.3)] relative overflow-hidden"
                    >
                        {/* Simple CSS shape for Cookie representation */}
                        <div className="absolute w-full h-full bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full transform rotate-45 skew-x-12 border-4 border-yellow-600/20"></div>
                        <div className="absolute w-3/4 h-3/4 bg-yellow-100/20 rounded-full blur-xl"></div>
                        <span className="relative z-10 text-6xl drop-shadow-lg">🥠</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="cracked"
                        className="relative w-full h-full"
                    >
                        {/* Left Half */}
                        <motion.div
                            initial={{ x: 0, rotate: 0, opacity: 1 }}
                            animate={{ x: -50, rotate: -20, opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute left-0 top-0 w-1/2 h-full bg-gradient-to-br from-yellow-300 to-orange-400 rounded-l-full flex items-center justify-end pr-4"
                        >
                            <span className="text-4xl">🍪</span>
                        </motion.div>

                        {/* Right Half */}
                        <motion.div
                            initial={{ x: 0, rotate: 0, opacity: 1 }}
                            animate={{ x: 50, rotate: 20, opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-yellow-300 to-orange-400 rounded-r-full flex items-center justify-start pl-4"
                        >
                            <span className="text-4xl">🍪</span>
                        </motion.div>

                        {/* Fortune Slip */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1, rotate: [0, 5, -5, 0] }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-white shadow-lg flex items-center justify-center p-2 z-20"
                        >
                            <div className="w-full h-full border border-red-200 flex items-center justify-center">
                                <span className="text-xs text-red-500 font-serif">Fortune Awaits...</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FortuneCookie;
