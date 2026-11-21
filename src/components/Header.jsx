import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  IoCall, 
  IoCarSport, 
  IoLockClosed, 
  IoSparkles, 
  IoMenu, 
  IoClose,
  IoDocumentText,
  IoRestaurant,
  IoChevronForward,
  IoChevronDown,
  IoGlobeOutline,
  IoCheckmark,
  IoHome
} from 'react-icons/io5';
import { MdSecurity } from 'react-icons/md';
import { useAssessment } from '../context/AssessmentContext';
import PanicButton from './PanicButton';
import FakeCallModal from './FakeCallModal';
import logoImg from '../assets/logo.png';

const LANG_OPTIONS = [
  { code: 'uz', label: 'O‘zbekcha', short: 'O‘z', flag: '🇺🇿' },
  { code: 'uz_cyr', label: 'Ўзбекча', short: 'Ўз', flag: '🇺🇿' },
  { code: 'ru', label: 'Русский', short: 'Ру', flag: '🇷🇺' },
];

export default function Header() {
  const { lang, setLang, t, toggleStealthMode } = useAssessment();
  const [isFakeCallOpen, setIsFakeCallOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef(null);

  // Close language dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANG_OPTIONS.find((item) => item.code === lang) || LANG_OPTIONS[0];

  const NAV_LINKS = [
    { to: '/', label: t('nav_home_short'), icon: IoHome, end: true },
    { to: '/describe', label: t('nav_describe_short'), icon: IoSparkles, badge: 'AI' },
    { to: '/safewalk', label: t('nav_safewalk'), icon: IoCarSport, pulse: true },
    { to: '/evidence', label: t('nav_evidence_short'), icon: IoLockClosed },
    { to: '/safety-plan', label: t('nav_safety_plan_short'), icon: IoDocumentText },
    { to: '/resources', label: t('nav_resources_short'), icon: IoCall },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* Brand Identity: Official Himoya AI Civic Logo */}
          <div className="flex items-center shrink-0 min-w-0">
            <Link
              to="/"
              className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg transition-transform active:scale-[0.98]"
              aria-label="Himoya platformasi bosh sahifasi"
            >
              <img
                src={logoImg}
                alt="Himoya AI Civic"
                className="h-7 sm:h-9 md:h-10 w-auto max-w-[130px] sm:max-w-[170px] md:max-w-[210px] object-contain select-none transition-opacity group-hover:opacity-90"
              />
            </Link>
          </div>

          {/* Desktop Navigation: Compact, Clean, 100% Fit on 100% scale */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 justify-center flex-1 mx-1 sm:mx-2 min-w-0" aria-label="Asosiy menyu">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3 rounded-full text-xs xl:text-[13px] font-heading whitespace-nowrap transition-all duration-150 select-none ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.pulse && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Dock: Responsively Balanced, Never Overflows on Mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Soxta qo'ng'iroq (Fake Call) Quick Trigger */}
            <button
              type="button"
              onClick={() => setIsFakeCallOpen(true)}
              className="h-8 sm:h-9 inline-flex items-center gap-1.5 px-2.5 sm:px-3 rounded-full bg-emerald-50 hover:bg-emerald-100/90 active:bg-emerald-200 border border-emerald-200/90 text-emerald-800 text-xs font-heading font-semibold transition-all cursor-pointer active:scale-95 shadow-2xs whitespace-nowrap group"
              title={t('action_fake_call_tip') || "Soxta qo‘ng‘iroq: Noqulay vaziyatdan chiqish"}
              aria-label={t('action_fake_call') || "Soxta qo‘ng‘iroq"}
            >
              <IoCall className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
              <span className="hidden sm:inline font-bold">{t('action_fake_call') || "Soxta qo‘ng‘iroq"}</span>
            </button>

            {/* Language Selector Dropdown (Compact on Mobile) */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="h-8 sm:h-9 inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 rounded-full bg-slate-100 hover:bg-slate-200/90 border border-slate-200 text-slate-700 text-xs font-heading font-semibold transition-all cursor-pointer active:scale-95 shadow-2xs whitespace-nowrap"
                title="Tilni tanlash"
                aria-label="Tilni tanlash"
              >
                <IoGlobeOutline className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{currentLang.short}</span>
                <IoChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl py-1.5 z-50 animate-fade-in ring-1 ring-black/5">
                  <div className="px-3.5 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1 font-semibold">
                    Tilni tanlang
                  </div>
                  {LANG_OPTIONS.map((opt) => (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => {
                        setLang(opt.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-heading font-medium transition-colors text-left ${
                        lang === opt.code
                          ? 'text-emerald-700 bg-emerald-50/80 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{opt.flag}</span>
                        <span>{opt.label}</span>
                      </span>
                      {lang === opt.code && <IoCheckmark className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Emergency Panic Button */}
            <PanicButton compact={false} />

            {/* Mobile Hamburger Toggle (Always cleanly visible on mobile) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-8 sm:h-9 w-8 sm:w-9 lg:hidden inline-flex items-center justify-center rounded-xl text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/90 border border-slate-200 transition-colors cursor-pointer text-lg shrink-0"
              aria-label={isMobileMenuOpen ? "Menyuni yopish" : "Menyuni ochish"}
            >
              {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Full Suite & Hotlines */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-xl px-4 py-4 space-y-4 shadow-2xl animate-fade-in max-h-[calc(100vh-60px)] overflow-y-auto">
            
            {/* Mobile Brand Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <img src={logoImg} alt="Himoya AI" className="h-7 w-auto object-contain" />
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                CIVIC PLATFORM
              </span>
            </div>

            {/* Mobile Stealth & Privacy Action Cards (Prominently featured for mobile safety) */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setIsFakeCallOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-emerald-600 font-heading font-bold text-xs mb-1">
                  <IoCall className="w-4 h-4" />
                  <span>{t('action_fake_call') || "Soxta qo‘ng‘iroq"}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-sans leading-tight">
                  Noqulay vaziyatdan chiqish
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleStealthMode();
                  setIsMobileMenuOpen(false);
                }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-left transition-all group"
              >
                <div className="flex items-center gap-2 text-slate-700 group-hover:text-amber-800 font-heading font-bold text-xs mb-1">
                  <IoRestaurant className="w-4 h-4" />
                  <span>{t('action_stealth') || "Niqob rejimi"}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-sans leading-tight">
                  Retseptlar bilan niqoblash
                </p>
              </button>
            </div>

            {/* Primary Nav Links */}
            <div className="space-y-1 pt-1">
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-heading font-semibold transition-all ${
                      isActive
                        ? 'text-slate-950 bg-slate-100 border border-slate-300 font-bold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`
                  }
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon && <item.icon className="w-4 h-4 text-slate-500" />}
                    <span>{item.label}</span>
                  </span>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.badge}
                      </span>
                    )}
                    {item.pulse && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                    <IoChevronForward className="w-4 h-4 text-slate-400" />
                  </div>
                </NavLink>
              ))}
            </div>

            {/* Mobile Quick Emergency Hotlines */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold px-1">
                Favqulodda bepul aloqa
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:1146"
                  className="px-3 py-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200/90 text-emerald-800 text-xs font-heading font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors"
                >
                  <IoCall className="w-3.5 h-3.5 text-emerald-600" />
                  <span>1146 Ishonch</span>
                </a>
                <a
                  href="tel:102"
                  className="px-3 py-2.5 rounded-xl bg-rose-50/90 border border-rose-200/90 text-rose-800 text-xs font-heading font-bold flex items-center justify-center gap-2 hover:bg-rose-100 transition-colors"
                >
                  <MdSecurity className="w-3.5 h-3.5 text-rose-600" />
                  <span>102 IIB</span>
                </a>
              </div>
            </div>

            {/* Mobile Soxta qo'ng'iroq action */}
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsFakeCallOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-900 text-xs font-heading font-bold flex items-center justify-center gap-2 hover:bg-emerald-100 transition-colors shadow-2xs"
              >
                <IoCall className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>{t('action_fake_call') || "Soxta qo‘ng‘iroq"} (Kiruvchi qo‘ng‘iroq)</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Fake Call Modal */}
      <FakeCallModal isOpen={isFakeCallOpen} onClose={() => setIsFakeCallOpen(false)} />
    </>
  );
}