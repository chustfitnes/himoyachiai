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
    { to: '/describe', label: 'AI Diagnostika' },
    { to: '/safewalk', label: 'SafeWalk' },
    { to: '/evidence', label: 'Dalillar Seyfi' },
    { to: '/safety-plan', label: 'Reja' },
    { to: '/resources', label: 'Yordam (1146)' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Trust Tag */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus:outline-none shrink-0"
            aria-label="HimoyaAI bosh sahifasi"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg text-slate-900 tracking-tight leading-tight">
                Himoya<span className="text-emerald-600">AI</span>
              </span>
              <span className="text-[10px] font-mono tracking-tight text-slate-400 font-medium leading-none hidden sm:block">
                O‘zbekiston • Zero-Log
              </span>
            </div>
          </Link>

          {/* Senior Desktop Navigation Pill */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60" aria-label="Asosiy menyu">
            {NAV_LINKS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Quick Action Dock */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            
            {/* Fake Call Trigger */}
            <button
              onClick={() => setIsFakeCallOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-amber-900 text-xs font-heading font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
              title="Soxta qo'ng'iroq simulyatori: Noqulay yoki xavfli vaziyatdan bahona bilan chiqib ketish uchun telefoningizga qo'ng'iroq simulyatsiyasi"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden sm:inline">Soxta qo‘ng‘iroq</span>
            </button>

            {/* Stealth disguise button */}
            <button
              onClick={toggleStealthMode}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 bg-slate-100/70 hover:bg-slate-200/80 border border-slate-200/60 transition-all cursor-pointer active:scale-95"
              title="Niqob rejimi: Saytni oshxona retseptlari ko'rinishiga bir zumda aylantiradi"
              aria-label="Niqob rejimini yoqish"
            >
              <Utensils className="w-4 h-4 text-slate-600" />
            </button>

            {/* Language toggle */}
            <button
              onClick={cycleLang}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-600 hover:text-slate-900 bg-slate-100/70 hover:bg-slate-200/80 border border-slate-200/60 transition-all cursor-pointer active:scale-95"
              title="Tilni o'zgartirish (O'zbekcha / Ўзбекча / Русский)"
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
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/60 transition-colors cursor-pointer"
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
