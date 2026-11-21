import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShieldCheck, Car, FolderLock, PhoneCall } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

export default function MobileBottomBar() {
  const { t } = useAssessment();

  const NAV_ITEMS = [
    { to: '/', label: t('mobile_nav_home'), icon: Home, end: true },
    { to: '/describe', label: t('mobile_nav_analyze'), icon: ShieldCheck },
    { to: '/safewalk', label: t('mobile_nav_safewalk'), icon: Car },
    { to: '/evidence', label: t('mobile_nav_evidence'), icon: FolderLock },
  ];

  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
      aria-label="Mobil pastki menyu"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center gap-1 transition-colors select-none ${
                  isActive
                    ? 'text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-700 font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      isActive ? 'bg-slate-100 text-slate-950' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <span className="text-[10px] leading-none font-sans tracking-tight">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}

        {/* Instant SOS Dial Button (5th item) */}
        <a
          href="tel:102"
          className="flex flex-col items-center justify-center gap-1 text-rose-600 hover:text-rose-700 transition-colors select-none"
          aria-label="102 ga shoshilinch qo‘ng‘iroq"
        >
          <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shadow-2xs">
            <PhoneCall className="w-4 h-4 shrink-0 animate-pulse" />
          </div>
          <span className="text-[10px] leading-none font-heading font-bold tracking-tight text-rose-700">
            {t('mobile_nav_sos')}
          </span>
        </a>
      </div>
    </nav>
  );
}
