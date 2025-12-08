import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import DesktopSidebar from '../components/DesktopSidebar';
import ShamanCharacter from '../components/ShamanCharacter';
import LanguageSelector from '../components/LanguageSelector';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useLanguage } from '../context/LanguageContext';

const LayoutContent: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden font-mystical">
            {/* Glassmorphism Header */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/10 h-16 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" className="w-8 h-8" />
                    <Link to="/" className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 font-mystical">
                        FortuneCrack
                    </Link>
                </div>
                <nav className="flex gap-6 text-sm font-medium text-gray-100 items-center">
                    <Link to="/" data-testid="nav-today" className="hover:text-white transition-colors">{t('nav_today')}</Link>
                    <Link to="/history" data-testid="nav-history" className="hover:text-white transition-colors">{t('nav_history')}</Link>
                    <Link to="/chat" data-testid="nav-chat" className="hover:text-white transition-colors">{t('nav_chat')}</Link>
                    <Link to="/settings" data-testid="nav-settings" className="hover:text-white transition-colors">{t('nav_settings')}</Link>
                    <GoogleLoginButton />
                    <LanguageSelector />
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

                    {/* Persistent Shaman (Visible on Desktop) */}
                    <div className="hidden xl:flex flex-1 h-full items-center justify-center relative">
                        <ShamanCharacter />
                    </div>
                </main>
            </div>
        </div>
    );
};

const Layout: React.FC = () => {
    return <LayoutContent />;
};

export default Layout;
