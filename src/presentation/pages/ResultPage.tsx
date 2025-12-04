import React from 'react';
import { Link } from 'react-router-dom';
import FortuneSlip from '../components/FortuneSlip';

const ResultPage: React.FC = () => {
    // Mock Data
    const fortuneData = {
        summary: "Great things are coming your way.",
        fullText: "Your patience will soon be rewarded. The stars align to bring clarity to your confusion and strength to your endeavors. Trust the process.",
        precision: "High"
    };

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6">

            <FortuneSlip {...fortuneData} />

            <Link to="/" className="mt-12 px-8 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-all text-sm font-medium tracking-wider backdrop-blur-md border border-white/10">
                Open Another Cookie
            </Link>
        </div>
    );
};

export default ResultPage;
