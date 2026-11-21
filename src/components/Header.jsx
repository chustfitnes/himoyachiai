import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  PhoneCall, 
  Car, 
  FolderLock, 
  Sparkles, 
  Menu, 
  X,
  FileText,
  Utensils,
  LogOut,
  Lock,
  ChevronRight,
  Phone
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import PanicButton from './PanicButton';
import FakeCallModal from './FakeCallModal';

export default function Header() {
  const { lang, setLang, toggleStealthMode } = useAssessment();
  const [isFakeCallOpen, setIsFakeCallOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cycleLang = () => {
    if (lang === 'uz') setLang('uz_cyr');
    else if (lang === 'uz_cyr') setLang('ru');
    else setLang('uz');
  };

  const langLabel = lang === 'uz' ? 'Oʻz' : lang === 'uz_cyr' ? 'Ўз' : 'Ру';

  const NAV_LINKS = [
    { to: '/', label: 'Bosh sahifa', end: true },
    { to: '/describe', label: 'Vaziyatni baholash' },
    { to: '/safewalk', label: 'SafeWalk' },
    { to: '/evidence', label: 'Dalillar Seyfi' },
    { to: '/safety-plan', label: 'Xavfsizlik rejasi' },
    { to: '/resources', label: 'Yordam markazlari (1146)' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Identity & Institutional Subtitle */}
          <Link
            to="/"
            className="flex items-center gap-3 group focus:outline-none shrink-0"
            aria-label="Himoya platformasi bosh sahifasi"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0 border border-slate-800 shadow-xs group-hover:bg-slate-800 transition-colors">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-lg text-slate-950 tracking-tight leading-none">
                  HIMOYA
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 leading-none">
                  CIVIC
                </span>
              </div>
              <span className="text-[10px] font-sans font-medium text-slate-500 tracking-normal leading-tight mt-0.5 hidden sm:block">
                O‘zbekiston Respublikasi • Huquqiy Himoya Tizimi
              </span>
            </div>
          </Link>

          {/* Senior Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80" aria-label="Asosiy menyu">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Discreet Action Dock */}
          <div className="flex items-center gap-2">
            
            {/* Fake Call Trigger (Restrained, discreet style) */}
            <button
              onClick={() => setIsFakeCallOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 text-xs font-heading font-medium transition-all cursor-pointer active:scale-95"
              title="Soxta qo‘ng‘iroq: Noqulay vaziyatdan chiqib ketish uchun kiruvchi qo‘ng‘iroq simulyatsiyasi"
            >
              <PhoneCall className="w-3.5 h-3.5 text-slate-600 shrink-0" />
              <span className="hidden xl:inline">Soxta qo‘ng‘iroq</span>
            </button>

            {/* Stealth disguise button */}
            <button
              onClick={toggleStealthMode}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all cursor-pointer active:scale-95"
              title="Niqob rejimi: Saytni oshxona retseptlari ko‘rinishiga o‘tkazish"
              aria-label="Niqob rejimini yoqish"
            >
              <Utensils className="w-4 h-4 text-slate-600" />
            </button>

            {/* Language toggle */}
            <button
              onClick={cycleLang}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all cursor-pointer active:scale-95"
              title="Tilni tanlash (O‘zbekcha / Ўзбекча / Русский)"
            >
              {langLabel}
            </button>

            {/* Emergency Exit Button */}
            <div className="shrink-0">
              <PanicButton compact={true} />
            </div>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/70 transition-colors cursor-pointer"
              aria-label="Menyuni ochish"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu with Quick Hotlines */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 py-4 space-y-3 shadow-lg">
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
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/70'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`
                  }
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </NavLink>
              ))}
            </div>

            {/* Mobile Quick Hotline Bar */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <a
                href="tel:1146"
                className="px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-heading font-bold flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>1146 Ishonch</span>
              </a>
              <a
                href="tel:102"
                className="px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-heading font-bold flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-rose-600" />
                <span>102 IIB</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Fake Call Modal */}
      <FakeCallModal isOpen={isFakeCallOpen} onClose={() => setIsFakeCallOpen(false)} />
    </>
  );
}
