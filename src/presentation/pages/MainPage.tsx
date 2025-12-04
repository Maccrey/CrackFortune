import React from 'react';
import FortuneCookie from '../components/FortuneCookie';

const MainPage: React.FC = () => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl font-bold mb-12 text-white tracking-widest uppercase">Today's Fortune</h2>

            <FortuneCookie />

            <p className="mt-12 text-gray-400 text-center text-sm animate-pulse">
                Tap the cookie to reveal your destiny
            </p>
        </div>
    );
};

export default MainPage;
