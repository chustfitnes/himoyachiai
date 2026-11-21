import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

export default function OfficialTopBanner() {
  const { t } = useAssessment();

  return (
    <div className="w-full bg-slate-950 text-slate-300 text-[11px] font-sans border-b border-slate-800/80 py-1 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-hidden">
        {/* Left: Official State Identifier */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          {/* Subtle Uzbekistan Flag Mini Pill */}
          <span className="inline-flex items-center justify-center w-3.5 h-2.5 rounded-xs overflow-hidden border border-white/20 shrink-0 shadow-2xs">
            <span className="w-full h-full flex flex-col">
              <span className="h-1/3 bg-[#0099B5]" />
              <span className="h-1/3 bg-white" />
              <span className="h-1/3 bg-[#1EB53A]" />
            </span>
          </span>
          <span className="font-medium text-slate-300 truncate">
            <span className="sm:hidden">O‘zR • Huquqiy Himoya Tizimi</span>
            <span className="hidden sm:inline">{t('official_banner_text')}</span>
          </span>
        </div>

        {/* Right: Security & Hotlines Guarantee */}
        <div className="flex items-center gap-2 sm:gap-3 text-slate-400 shrink-0 text-[10px] sm:text-[11px]">
          <span className="flex items-center gap-1 text-emerald-400 font-medium whitespace-nowrap">
            <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="hidden xs:inline">{t('official_banner_guarantee')}</span>
            <span className="xs:hidden">Zero-Log</span>
          </span>
          <span className="text-slate-600 hidden lg:inline">•</span>
          <span className="hidden lg:inline font-mono text-[10px] text-slate-400 whitespace-nowrap">
            {t('official_banner_integration')}
          </span>
        </div>
      </div>
    </div>
  );
}
