import React from 'react';
import { motion } from 'framer-motion';

const ShamanCharacter: React.FC = () => {
    return (
        <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center">
            <motion.div
                className="relative w-full h-full flex items-center justify-center"
                animate={{
                    y: [0, -15, 0],
                    scale: [1, 1.02, 1],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <motion.img
                    src="/shaman.png"
                    alt="Shaman"
                    className="w-full h-full object-contain"
                    style={{
                        maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)',
                        WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)',
                        filter: 'drop-shadow(0 0 20px rgba(147, 51, 234, 0.3))'
                    }}
                    animate={{
                        filter: [
                            'drop-shadow(0 0 20px rgba(147, 51, 234, 0.3))',
                            'drop-shadow(0 0 40px rgba(147, 51, 234, 0.6))',
                            'drop-shadow(0 0 20px rgba(147, 51, 234, 0.3))'
                        ]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>

            {/* Mystical Aura Overlay */}
            <motion.div
                className="absolute inset-0 bg-purple-500/10 mix-blend-overlay pointer-events-none rounded-full blur-3xl"
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [0.8, 1.1, 0.8],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            {/* Color Tint Overlay for Integration */}
            <div className="absolute inset-0 bg-purple-900/20 mix-blend-overlay pointer-events-none"
                style={{
                    maskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)',
                    WebkitMaskImage: 'radial-gradient(circle at center, black 50%, transparent 100%)',
                }}
            />

            {/* Bottom Fade */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#111827] to-transparent pointer-events-none" />
        </div>
    );
};

export default ShamanCharacter;
