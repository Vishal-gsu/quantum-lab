import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
  const { pathname } = useLocation();
  const isStudyRoute = pathname.startsWith('/study');

  return (
    <div className="flex h-screen overflow-hidden font-sans text-slate-200 selection:bg-teal-500/25 selection:text-teal-100">
      <Sidebar
        collapsed={sidebarCollapsed}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
        backendStatus={backendStatus}
      />

      <main className="learn-canvas relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          backendStatus={backendStatus}
          shots={shots}
          onShotsChange={setShots}
          noiseEnabled={noiseEnabled}
          onNoiseToggle={setNoiseEnabled}
        />

        <div
          className={`flex-1 overflow-y-auto px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-10 ${
            isStudyRoute ? 'w-full max-w-none' : 'mx-auto w-full max-w-7xl'
          }`}
        >
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Dashboard backendStatus={backendStatus} />} />
              <Route
                path="/experiment/:id"
                element={
                  <ExperimentView backendStatus={backendStatus} shots={shots} noiseEnabled={noiseEnabled} />
                }
              />
              <Route path="/study" element={<StudyView />} />
              <Route path="/study/:docId" element={<StudyView />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
