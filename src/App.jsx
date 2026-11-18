import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import EmergencyFooter from './components/EmergencyFooter';
import SkipLink from './components/SkipLink';

// Pages
import Home from './pages/Home';
import Describe from './pages/Describe';
import Result from './pages/Result';
import Resources from './pages/Resources';
import Privacy from './pages/Privacy';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Telegram Mini App native BackButton handling
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg?.BackButton) {
      if (location.pathname !== '/') {
        tg.BackButton.show();
        const handleBack = () => {
          navigate(-1);
        };
        tg.BackButton.onClick(handleBack);
        return () => {
          tg.BackButton.offClick(handleBack);
        };
      } else {
        tg.BackButton.hide();
      }
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-canvas-light text-ink-primary-light dark:bg-canvas-dark dark:text-ink-primary-dark transition-colors duration-150">
      {/* Accessibility Skip Link */}
      <SkipLink />

      {/* Main App Header with integrated navigation and Panic Button */}
      <Header />

      {/* Main Content Area (Max width 640px reading width, single column, editorial whitespace) */}
      <main id="main-content" className="flex-1 w-full max-w-reading mx-auto px-4 sm:px-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/describe" element={<Describe />} />
          <Route path="/result" element={<Result />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Emergency Persistent Footer */}
      <EmergencyFooter />
    </div>
  );
}
