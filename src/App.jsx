import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAssessment } from './context/AssessmentContext';
import Header from './components/Header';
import OfficialTopBanner from './components/OfficialTopBanner';
import MobileBottomBar from './components/MobileBottomBar';
import EmergencyFooter from './components/EmergencyFooter';
import SkipLink from './components/SkipLink';
import StealthView from './components/StealthView';

// Pages
import Home from './pages/Home';
import Describe from './pages/Describe';
import Result from './pages/Result';
import SafeWalk from './pages/SafeWalk';
import EvidenceLocker from './pages/EvidenceLocker';
import SafetyPlan from './pages/SafetyPlan';
import Resources from './pages/Resources';
import Privacy from './pages/Privacy';

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isStealthMode } = useAssessment();

  // If covert stealth mode is activated, switch immediately to disguised food recipes
  if (isStealthMode) {
    return <StealthView />;
  }

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
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] text-slate-900 transition-colors duration-150 relative selection:bg-emerald-100 selection:text-emerald-900 bg-subtle-mesh">
      {/* Top ambient glow light-cone */}
      <div className="fixed inset-0 pointer-events-none hero-ambient-glow z-0" aria-hidden="true" />

      {/* Accessibility Skip Link */}
      <SkipLink />

      {/* Official State Heraldic Trust Banner */}
      <OfficialTopBanner />

      {/* Full-width sticky navigation bar */}
      <Header />

      {/* Main Content Area (proper spacing on mobile to avoid MobileBottomBar overlap) */}
      <main id="main-content" className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12 pb-32 lg:pb-12">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/describe" element={<Describe />} />
          <Route path="/result" element={<Result />} />
          <Route path="/safewalk" element={<SafeWalk />} />
          <Route path="/evidence" element={<EvidenceLocker />} />
          <Route path="/safety-plan" element={<SafetyPlan />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Emergency Persistent Footer */}
      <EmergencyFooter />

      {/* Mobile-Only Native Bottom Navigation Tab Bar */}
      <MobileBottomBar />
    </div>
  );
}
