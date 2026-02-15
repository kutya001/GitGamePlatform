import React from 'react';
import { HashRouter, Routes, Route, Navigate } from './store';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { GameWrapper } from './pages/GameWrapper';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/game/:id" element={<GameWrapper />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;