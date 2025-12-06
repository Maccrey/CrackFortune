import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './presentation/layout/Layout';
import MainPage from './presentation/pages/MainPage';
import ResultPage from './presentation/pages/ResultPage';
import HistoryPage from './presentation/pages/HistoryPage';
import ChatPage from './presentation/pages/ChatPage';
import SettingsPage from './presentation/pages/SettingsPage';
import IntroOverlay from './presentation/components/IntroOverlay';
import { LanguageProvider } from './presentation/context/LanguageContext';
import { FortuneProvider } from './presentation/context/FortuneContext';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('visited');
    if (hasVisited) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem('visited', 'true');
    setShowIntro(false);
  };

  return (
    <LanguageProvider>
      <FortuneProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          {showIntro && <IntroOverlay onComplete={handleIntroComplete} />}
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<MainPage />} />
              <Route path="result" element={<ResultPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </FortuneProvider>
    </LanguageProvider>
  );
};

export default App;
