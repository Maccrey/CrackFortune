import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
            {/* Glassmorphism Header */}
            <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/10 border-b border-white/10 h-16 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <img src="/favicon.png" alt="Logo" className="w-8 h-8" />
                    <Link to="/" className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
                        FortuneCrack
                    </Link>
                </div>
                <nav className="flex gap-6 text-sm font-medium text-gray-300">
                    <Link to="/" className="hover:text-white transition-colors">Today</Link>
                    <Link to="/history" className="hover:text-white transition-colors">History</Link>
                    <Link to="/settings" className="hover:text-white transition-colors">Settings</Link>
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 pt-16 relative w-full max-w-md mx-auto flex flex-col">
                <Outlet />
            </main>

            {/* Footer (Optional, mostly for desktop or info) */}
            <footer className="py-4 text-center text-xs text-gray-500">
                &copy; {new Date().getFullYear()} FortuneCrack. Powered by Gemini.
            </footer>
        </div>
    );
};

export default Layout;
