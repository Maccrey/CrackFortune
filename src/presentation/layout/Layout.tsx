import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import DesktopSidebar from '../components/DesktopSidebar';
import ShamanCharacter from '../components/ShamanCharacter';
import LanguageSelector from '../components/LanguageSelector';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { useLanguage } from '../context/LanguageContext';

const LayoutContent: React.FC = () => {
    const { t } = useLanguage();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    return (
        <div className="h-[100dvh] flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden font-mystical">
            {/* Glassmorphism Header */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/10 h-16 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" className="w-8 h-8" />
                    <Link to="/" className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500 font-mystical">
                        FortuneCrack
                    </Link>
                </div>
                <div className="flex gap-6 text-sm font-medium text-gray-100 items-center">
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" data-testid="nav-today" className="hover:text-white transition-colors">{t('nav_today')}</Link>
                        <Link to="/history" data-testid="nav-history" className="hover:text-white transition-colors">{t('nav_history')}</Link>
                        <Link to="/chat" data-testid="nav-chat" className="hover:text-white transition-colors">{t('nav_chat')}</Link>
                        <Link to="/settings" data-testid="nav-settings" className="hover:text-white transition-colors">{t('nav_settings')}</Link>
                    </nav>

                    {/* Always visible on Desktop, flexible on mobile */}
                    <div className="hidden md:flex items-center gap-4">
                        <GoogleLoginButton />
                        <LanguageSelector />
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden p-2 text-gray-200 hover:text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 top-16 z-40 bg-gray-900/95 backdrop-blur-xl md:hidden flex flex-col p-6 animate-fade-in">
                    <nav className="flex flex-col gap-6 text-lg font-medium text-gray-100">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-white/10 hover:text-white transition-colors">{t('nav_today')}</Link>
                        <Link to="/history" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-white/10 hover:text-white transition-colors">{t('nav_history')}</Link>
                        <Link to="/chat" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-white/10 hover:text-white transition-colors">{t('nav_chat')}</Link>
                        <Link to="/settings" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-white/10 hover:text-white transition-colors">{t('nav_settings')}</Link>
                    </nav>
                    <div className="mt-8 flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Account</span>
                            <GoogleLoginButton />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Language</span>
                            <LanguageSelector />
                        </div>
                    </div>
                </div>
            )}

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
