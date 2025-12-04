import React from 'react';
import FortuneCookie from '../components/FortuneCookie';

const MainPage: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 gap-8 relative overflow-hidden w-full h-full">
            {/* Left Content (Cookie) */}
            <div className="flex-1 flex flex-col items-center justify-center z-10 w-full max-w-md xl:max-w-none">
                <h2 className="text-3xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-500 tracking-widest uppercase drop-shadow-lg">
                    오늘의 운세
                </h2>

                <FortuneCookie />

                <p className="mt-12 text-gray-400 text-center text-sm animate-pulse tracking-wider">
                    쿠키를 눌러 운명을 확인하세요
                </p>
            </div>
        </div>
    );
};

export default MainPage;
