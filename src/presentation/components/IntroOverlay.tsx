import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { useLanguage } from '../context/LanguageContext';

interface IntroOverlayProps {
    onComplete: () => void;
}

const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
    const [isOpen, setIsOpen] = useState(false);
    // const { t } = useLanguage(); // Unused in new design for now, or add keys if needed. Using English for aesthetic consistency on "CLICK TO OPEN" often used in KR apps, but better to localize? 
    // Let's stick to English for the "Design" element or check if I should add a key. 
    // User asked for "Click" blinking. 
    // I'll just remove the unused `t` to fix lint.

    const handleOpen = () => {
        setIsOpen(true);
        setTimeout(onComplete, 2000); // Wait for animation to finish before unmounting
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden pointer-events-auto font-sans">
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        className="absolute inset-0 flex w-full h-full"
                        exit={{ opacity: 0, transition: { duration: 1, delay: 1 } }}
                    >
                        {/* Door Background Container */}
                        <div className="absolute inset-0 bg-black" />

                        {/* Left Door */}
                        <motion.div
                            className="w-1/2 h-full relative flex items-center justify-end z-10"
                            initial={{ x: 0 }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%', transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] } }}
                        >
                            {/* Door Panel */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-[#1a1a1a] to-black border-r border-[#333]">
                                {/* Texture Overlay */}
                                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                                
                                {/* Inner Frame Detail */}
                                <div className="absolute inset-4 border border-white/5 opacity-50 rounded-sm" />
                                <div className="absolute inset-12 border border-white/5 opacity-30 rounded-sm" />
                                
                                {/* Vertical Accent Line */}
                                <div className="absolute right-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />
                            </div>

                            {/* Handle Area */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 flex flex-col items-center">
                                {/* Handle Ring */}
                                <motion.div
                                    className="w-24 h-24 rounded-full border-2 border-amber-600/40 bg-black/80 backdrop-blur-md flex items-center justify-center cursor-pointer shadow-[0_0_50px_rgba(217,119,6,0.15)] group relative"
                                    whileHover={{ scale: 1.05, borderColor: 'rgba(217,119,6,0.8)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleOpen}
                                >
                                    {/* Inner Gold Circle */}
                                    <div className="w-16 h-16 rounded-full border border-amber-500/20 flex items-center justify-center bg-gradient-to-br from-amber-900/20 to-black">
                                       <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                                    </div>
                                    
                                    {/* Pulsing Ring Effect */}
                                    <div className="absolute inset-0 rounded-full border border-amber-500/30 animate-ping opacity-20" />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Right Door */}
                        <motion.div
                            className="w-1/2 h-full relative flex items-center justify-start z-10"
                            initial={{ x: 0 }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%', transition: { duration: 1.8, ease: [0.22, 1, 0.36, 1] } }}
                        >
                            {/* Door Panel */}
                            <div className="absolute inset-0 bg-gradient-to-bl from-gray-900 via-[#1a1a1a] to-black border-l border-[#333]">
                                {/* Texture Overlay */}
                                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                                
                                {/* Inner Frame Detail */}
                                <div className="absolute inset-4 border border-white/5 opacity-50 rounded-sm" />
                                <div className="absolute inset-12 border border-white/5 opacity-30 rounded-sm" />

                                {/* Vertical Accent Line */}
                                <div className="absolute left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-amber-500/20 to-transparent" />
                            </div>
                            
                            {/* Handle Area (Mirror) - Visual only, logic handled by left or global click */}
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 pointer-events-none">
                                 <div className="w-24 h-24 rounded-full border-2 border-amber-600/40 bg-black/80 backdrop-blur-md flex items-center justify-center shadow-[0_0_50px_rgba(217,119,6,0.15)]">
                                    <div className="w-16 h-16 rounded-full border border-amber-500/20 flex items-center justify-center bg-gradient-to-br from-amber-900/20 to-black">
                                       <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Center Gap Light & Click Indicator */}
                        <motion.div 
                            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                            exit={{ opacity: 0 }}
                        >
                             {/* Light Leak through gap */}
                             <div className="absolute top-0 bottom-0 w-[2px] bg-amber-500/50 blur-[2px] opacity-50" />
                             
                             {/* Click Indicator Text */}
                             <motion.div 
                                className="mt-40 md:mt-48 flex flex-col items-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1, duration: 1 }}
                             >
                                <motion.span 
                                    className="text-[10px] md:text-xs tracking-[0.3em] font-light text-amber-200/70 uppercase"
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    Click to Open
                                </motion.span>
                                <motion.div 
                                    className="w-1 h-8 bg-gradient-to-b from-amber-500/0 via-amber-500/50 to-amber-500/0" 
                                    animate={{ height: [0, 40, 0], opacity: [0, 0.5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                />
                             </motion.div>
                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default IntroOverlay;
