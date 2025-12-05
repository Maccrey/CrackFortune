import React from 'react';
import { Link } from 'react-router-dom';
import FortuneSlip from '../components/FortuneSlip';
import { useFortuneContext } from '../context/FortuneContext';
import { useLanguage } from '../context/LanguageContext';

const ResultPage: React.FC = () => {
    const { fortune, status } = useFortuneContext();
    const { t } = useLanguage();

    if (!fortune) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-4">
                <p className="text-gray-300 text-sm">{status === 'loading' ? '운세를 준비하고 있어요...' : '쿠키를 먼저 깨트려 주세요!'}</p>
                <Link to="/" className="px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-all text-sm font-medium tracking-wider backdrop-blur-md border border-white/10">
                    {t('btn_open_another')}
                </Link>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
            <FortuneSlip summary={fortune.summary} fullText={fortune.fullText} precision={fortune.precision.toUpperCase()} />

            <Link to="/" data-testid="btn-open-another" className="mt-12 px-8 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-all text-sm font-medium tracking-wider backdrop-blur-md border border-white/10">
                {t('btn_open_another')}
            </Link>
        </div>
    );
};

export default ResultPage;
