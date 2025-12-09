import React from 'react';
import FortuneCookie from '../components/FortuneCookie';
import { useLanguage } from '../context/LanguageContext';
import KakaoAdFit from '../components/KakaoAdFit';
import { useMediaQuery } from '../hooks/useMediaQuery';

const MainPage: React.FC = () => {
    const { t } = useLanguage();
    const isDesktop = useMediaQuery('(min-width: 768px)');

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 gap-8 relative overflow-hidden w-full h-full">
            {/* Left Content (Cookie) */}
            <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-md xl:max-w-none">
                <h2 data-testid="heading-main" className="text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-500 tracking-widest uppercase drop-shadow-lg font-mystical">
                    {t('cookie_title')}
                </h2>

                <FortuneCookie />

                <p className="mt-12 text-gray-400 text-center text-sm animate-pulse tracking-wider">
                    {t('cookie_hint')}
                </p>

                {/* AdFit Placement for Main Page */}
                <div className="mt-8 w-full flex flex-col items-center gap-4">
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
                         /* PC: 728x90 (Optional, can omit if cleaner) */
                        <div className="">
                            <KakaoAdFit 
                                unitId="DAN-t5g6wLbUaZzEVlom" 
                                width="480" 
                                height="90" 
                                className="bg-white/5"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainPage;
