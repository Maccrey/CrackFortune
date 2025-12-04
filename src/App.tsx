
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './presentation/layout/Layout';
import MainPage from './presentation/pages/MainPage';
import ResultPage from './presentation/pages/ResultPage';
import HistoryPage from './presentation/pages/HistoryPage';
import SettingsPage from './presentation/pages/SettingsPage';

import ChatPage from './presentation/pages/ChatPage';

function App() {
  return (
    <BrowserRouter>
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
  );
}

export default App;
