import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useFortuneContext } from '../context/FortuneContext';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ isOpen, onClose }) => {
  const { loginWithGoogle } = useAuth();
  const { refreshUser } = useFortuneContext();

  if (!isOpen) return null;

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      await refreshUser(); // Migration completed, refresh data
      onClose();
    } catch (error) {
      console.error('Login failed in modal:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md p-6 overflow-hidden rounded-2xl bg-white/10 border border-white/20 shadow-2xl backdrop-blur-md animate-scale-in">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -translate-x-10 -translate-y-10" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl translate-x-10 translate-y-10" />

        <div className="relative flex flex-col items-center text-center space-y-6">
          <div className="p-3 bg-gradient-to-br from-purple-500/20 to-amber-500/20 rounded-full border border-white/10">
            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Save Your Fortune</h3>
            <p className="text-white/70">
              Log in to save this fortune to your history and track your destiny over time.
            </p>
          </div>

          <div className="flex flex-col w-full space-y-3">
            <button
              onClick={handleLogin}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
              </svg>
              Continue with Google
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-medium rounded-xl transition-colors duration-200"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
