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
  IoShieldCheckmark,
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
    { to: '/', label: t('nav_home') || 'Asosiy', icon: IoHome, end: true },
    { to: '/describe', label: t('nav_describe') || 'AI Diagnostika', icon: IoSparkles, badge: 'AI' },
    { to: '/safewalk', label: t('nav_safewalk') || 'SafeWalk', icon: IoCarSport, pulse: true },
    { to: '/evidence', label: t('nav_evidence') || 'Dalillar Seyfi', icon: IoLockClosed },
    { to: '/safety-plan', label: t('nav_safety_plan') || 'Xavfsizlik Rejasi', icon: IoDocumentText },
    { to: '/resources', label: t('nav_resources') || 'Yordam (1146)', icon: IoCall },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 lg:gap-6">
          
          {/* Brand Identity: Official Himoya AI Civic Logo */}
          <div className="flex items-center shrink-0">
            <Link
              to="/"
              className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg transition-transform active:scale-[0.98]"
              aria-label="Himoya platformasi bosh sahifasi"
            >
              <img
                src={logoImg}
                alt="Himoya AI Civic"
                className="h-9 sm:h-10 md:h-11 w-auto max-w-[160px] sm:max-w-[210px] object-contain select-none transition-opacity group-hover:opacity-90"
              />
            </Link>
          </div>

          {/* Desktop Navigation: Centered, Harmonized, Responsive */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5 justify-center flex-1 mx-2" aria-label="Asosiy menyu">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-2.5 py-1.5 xl:px-3.5 xl:py-2 rounded-full text-xs xl:text-[13px] font-heading whitespace-nowrap transition-all duration-150 select-none ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/80 font-medium'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.icon && (
                      <item.icon
                        className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                          isActive ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      />
                    )}
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

          {/* Right Action Dock: Pixel-balanced 36px controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Fake Call Trigger */}
            <button
              type="button"
              onClick={() => setIsFakeCallOpen(true)}
              className="h-9 inline-flex items-center gap-1.5 px-2.5 sm:px-3 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/90 text-slate-700 text-xs font-heading font-semibold transition-all cursor-pointer active:scale-95 whitespace-nowrap shadow-xs group"
              title={t('action_fake_call_tip') || t('fake_call_tip') || "Noqulay vaziyatdan chiqish uchun soxta qo'ng'iroq"}
              aria-label={t('action_fake_call') || "Soxta qo‘ng‘iroq"}
            >
              <IoCall className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform shrink-0" />
              <span className="hidden 2xl:inline">{t('action_fake_call') || 'Soxta qo‘ng‘iroq'}</span>
            </button>

            {/* Stealth Disguise Button */}
            <button
              type="button"
              onClick={toggleStealthMode}
              className="h-9 inline-flex items-center gap-1.5 px-2.5 sm:px-3 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/90 text-slate-700 text-xs font-heading font-semibold transition-all cursor-pointer active:scale-95 whitespace-nowrap shadow-xs group"
              title={t('action_stealth_tip') || t('stealth_tip') || "Niqob rejimini yoqish (oshpazlik retseptlari)"}
              aria-label="Niqob rejimini yoqish"
            >
              <IoRestaurant className="w-3.5 h-3.5 text-slate-600 group-hover:scale-110 transition-transform shrink-0" />
              <span className="hidden 2xl:inline text-slate-700">{t('action_stealth') || t('stealth_btn_short') || "Niqob"}</span>
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="h-9 inline-flex items-center gap-1.5 px-2.5 sm:px-3 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/90 text-slate-700 text-xs font-heading font-semibold transition-all cursor-pointer active:scale-95 shadow-xs whitespace-nowrap"
                title="Tilni tanlash"
                aria-label="Tilni tanlash"
              >
                <IoGlobeOutline className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="font-semibold">{currentLang.short}</span>
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

            {/* World-Class Emergency Exit Button */}
            <PanicButton compact={false} />

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-9 w-9 lg:hidden inline-flex items-center justify-center rounded-xl text-slate-700 hover:text-slate-950 bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200/90 transition-colors cursor-pointer text-lg"
              aria-label={isMobileMenuOpen ? "Menyuni yopish" : "Menyuni ochish"}
            >
              {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Full Suite & Hotlines */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-4 shadow-xl animate-fade-in">
            
            {/* Mobile Brand Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <img src={logoImg} alt="Himoya AI" className="h-8 w-auto object-contain" />
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                CIVIC PLATFORM
              </span>
            </div>

            {/* Primary Nav Links */}
            <div className="space-y-1">
              {NAV_LINKS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-heading font-semibold transition-all ${
                      isActive
                        ? 'text-emerald-800 bg-emerald-50/90 border border-emerald-200/80'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  <span className="flex items-center gap-2.5">
                    {item.icon && <item.icon className="w-4 h-4 text-slate-500" />}
                    <span>{item.label}</span>
                  </span>
                  <IoChevronForward className="w-4 h-4 text-slate-400" />
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
                  <MdSecurity className="w-4 h-4 text-rose-600" />
                  <span>102 IIB</span>
                </a>
              </div>
            </div>

            {/* Mobile Privacy & Disguise Actions */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsFakeCallOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-heading font-medium flex items-center justify-center gap-1.5"
              >
                <IoCall className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('action_fake_call') || "Soxta qo‘ng‘iroq"}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  toggleStealthMode();
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-heading font-medium flex items-center justify-center gap-1.5"
              >
                <IoRestaurant className="w-3.5 h-3.5 text-slate-600" />
                <span>{t('action_stealth') || "Niqob rejimi"}</span>
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
