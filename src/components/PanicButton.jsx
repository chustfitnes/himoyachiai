import React from 'react';
import { IoLogOut } from 'react-icons/io5';
import { useAssessment } from '../context/AssessmentContext';

export default function PanicButton({ compact = false, className = '' }) {
  const { triggerPanicEscape, t } = useAssessment();

  const label = t('panic_exit_short') || t('action_panic') || 'Chiqish';

  return (
    <button
      type="button"
      onClick={triggerPanicEscape}
      className={`h-9 inline-flex items-center gap-1.5 px-3 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white font-heading font-bold text-xs shadow-xs hover:shadow-rose-600/25 ring-1 ring-rose-500/40 transition-all cursor-pointer active:scale-95 whitespace-nowrap group shrink-0 ${className}`}
      title={t('panic_tip') || t('action_panic_tip') || "Tezkor Chiqish: Sahifani yopadi va Google'ga yo'naltiradi (Esc tugmasini 2 marta bosing)"}
      aria-label="Tezkor favqulodda chiqish tugmasi"
    >
      <IoLogOut className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
      <span>{label}</span>
      <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-white/20 text-white/95 leading-none shadow-2xs">
        Esc
      </kbd>
    </button>
  );
}
