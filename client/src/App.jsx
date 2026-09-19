import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Activities from './pages/Activities';
import TimerPage from './pages/TimerPage';
import Reports from './pages/Reports';
import History from './pages/History';
import { useTimer } from './hooks/useTimer';
import { ThemeProvider } from './context/ThemeContext';

const AppContent = () => {
  const { activeSession, elapsedSeconds } = useTimer();

  return (
    <div className="app-container">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Navbar */}
        <Navbar activeSession={activeSession} elapsedSeconds={elapsedSeconds} />

        {/* Page Views */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/timer" element={<TimerPage />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;
