import React from 'react';
import { Link } from 'react-router-dom';
import FortuneSlip from '../components/FortuneSlip';
import { useFortuneContext } from '../context/FortuneContext';
import { useLanguage } from '../context/LanguageContext';
import { LoginPromptModal } from '../components/LoginPromptModal';
import { useAuth } from '../context/AuthContext';
import KakaoAdFit from '../components/KakaoAdFit';

import { useMediaQuery } from '../hooks/useMediaQuery';

const ResultPage: React.FC = () => {
    const { fortune, status } = useFortuneContext();
    const { t } = useLanguage();
    const isDesktop = useMediaQuery('(min-width: 768px)'); // Matches Tailwind 'md' breakpoint

    const [showLoginPrompt, setShowLoginPrompt] = React.useState(false);
    const { user } = useAuth();
    const hasPrompted = React.useRef(false);

    React.useEffect(() => {
        if (fortune && !user && !hasPrompted.current) {
            const timer = setTimeout(() => {
                setShowLoginPrompt(true);
                hasPrompted.current = true;
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [fortune, user]);

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
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
            <FortuneSlip summary={fortune.summary} fullText={fortune.fullText} precision={fortune.precision?.toUpperCase() || 'UNKNOWN'} color={fortune.color} />

            <Link to="/" data-testid="btn-open-another" className="mt-8 md:mt-12 px-8 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-all text-sm font-medium tracking-wider backdrop-blur-md border border-white/10 whitespace-nowrap">
                {t('btn_open_another')}
            </Link>

            {/* AdFit Placement for Result Page */}
            <div className="mt-8 w-full flex flex-col items-center gap-4">
                {/* Conditionally render AdFit based on screen size to prevent script conflicts */}
                {!isDesktop ? (
                    /* Mobile: 320x50 */
                    <div className="mx-[-1rem] min-h-[50px] flex justify-center overflow-hidden">
                        <KakaoAdFit 
                            unitId="DAN-0kCP49fSWyvVrgcw" 
                            width="320" 
                            height="50" 
                            className="bg-white/5"
                        />
                    </div>
                ) : (
                    /* PC: 728x90 */
                    <div className="">
                        <KakaoAdFit 
                            unitId="DAN-t5g6wLbUaZzEVlom" 
                            width="728" 
                            height="90" 
                            className="bg-white/5"
                        />
                    </div>
                )}
            </div>

            <LoginPromptModal isOpen={showLoginPrompt} onClose={() => setShowLoginPrompt(false)} />
        </div>
    );
};

export default ResultPage;
