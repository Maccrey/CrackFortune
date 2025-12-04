import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import DesktopSidebar from '../components/DesktopSidebar';
import ShamanCharacter from '../components/ShamanCharacter';

const Layout: React.FC = () => {
    const location = useLocation();

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
            {/* Glassmorphism Header */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/10 h-16 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <img src="/favicon.png" alt="Logo" className="w-8 h-8" />
                    <Link to="/" className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                        FortuneCrack
                    </Link>
                </div>
                <nav className="flex gap-6 text-sm font-medium text-gray-300">
                    <Link to="/" className="hover:text-white transition-colors">오늘</Link>
                    <Link to="/history" className="hover:text-white transition-colors">기록</Link>
                    <Link to="/chat" className="hover:text-white transition-colors">채팅</Link>
                    <Link to="/settings" className="hover:text-white transition-colors">설정</Link>
                </nav>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 pt-16 flex w-full h-full">
                {/* Left Column (Desktop Sidebar) - Fixed width */}
                <aside className="hidden md:block w-96 border-r border-white/10 bg-white/5 backdrop-blur-sm">
                    <DesktopSidebar />
                </aside>

                {/* Right Column (App) - Takes remaining space */}
                <main className="flex-1 relative flex overflow-hidden">
                    {/* Page Content */}
                    <div className="flex-1 flex flex-col relative z-10">
                        <Outlet />
                    </div>

                    {/* Persistent Shaman (Visible on Desktop for Main/Result) */}
                    {(location.pathname === '/' || location.pathname === '/result') && (
                        <div className="hidden xl:flex flex-1 h-full items-center justify-center relative">
                            <ShamanCharacter />
                        </div>
                    )}
                </main>
            </div>

            {/* Footer (Mobile Only) */}
            <footer className="md:hidden py-4 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} FortuneCrack. Powered by Gemini.
            </footer>
        </div>
    );
};

export default Layout;
