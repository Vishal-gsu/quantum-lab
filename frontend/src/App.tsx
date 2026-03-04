import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import Dashboard from './pages/Dashboard.tsx';
import ExperimentView from './pages/ExperimentView.tsx';
import StudyView from './pages/StudyView.tsx';
import { useBackendHealth } from './hooks/useBackendHealth.ts';

import './App.css';

export default function App() {
  const backendStatus = useBackendHealth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [shots, setShots] = useState(1024);
  const [noiseEnabled, setNoiseEnabled] = useState(false);

  // Derive a label for the header from the current route
  const activeLabel = location.pathname.startsWith('/experiment')
    ? 'experiment'
    : location.pathname.startsWith('/study')
      ? 'study'
      : 'dashboard';

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30">
      <Sidebar
        collapsed={sidebarCollapsed}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
        backendStatus={backendStatus}
      />

      <main className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent relative">
        <Header
          backendStatus={backendStatus}
          activeLabel={activeLabel}
          shots={shots}
          onShotsChange={setShots}
          noiseEnabled={noiseEnabled}
          onNoiseToggle={setNoiseEnabled}
        />

        <div className="p-12 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard backendStatus={backendStatus} />} />
              <Route path="/experiment/:id" element={<ExperimentView backendStatus={backendStatus} shots={shots} noiseEnabled={noiseEnabled} />} />
              <Route path="/study" element={<StudyView />} />
              <Route path="/study/:docId" element={<StudyView />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
