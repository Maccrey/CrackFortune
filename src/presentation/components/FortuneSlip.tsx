import React from 'react';
import { motion } from 'framer-motion';

interface FortuneSlipProps {
    summary: string;
    fullText: string;
    precision: string;
}

const FortuneSlip: React.FC<FortuneSlipProps> = ({ summary, fullText, precision }) => {
    return (
        <motion.div
            initial={{ scaleY: 0.1, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="bg-[#fdfbf7] text-gray-800 p-8 rounded-sm shadow-2xl max-w-md w-full relative overflow-hidden font-serif"
            style={{ transformOrigin: 'top' }}
        >
            {/* Paper Texture/Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

            {/* Decorative Border */}
            <div className="absolute inset-2 border-2 border-red-800/20 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.8 }}
                className="relative z-10 flex flex-col items-center text-center"
            >
                {/* Header */}
                <div className="mb-6">
                    <span className="inline-block px-3 py-1 bg-red-100 text-red-800 text-xs font-bold tracking-widest uppercase rounded-full mb-2">
                        {precision} Precision
                    </span>
                    <h3 className="text-2xl font-bold text-red-900 mb-1">Today's Insight</h3>
                    <div className="w-12 h-1 bg-red-900/20 mx-auto"></div>
                </div>

                {/* Content */}
                <p className="text-xl font-medium leading-relaxed mb-6 text-gray-900">
                    "{summary}"
                </p>

                <p className="text-sm text-gray-600 leading-relaxed italic mb-8 px-4">
                    {fullText}
                </p>

                {/* Footer */}
                <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest">
                    <span>Powered by Gemini</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>FortuneCrack</span>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default FortuneSlip;
