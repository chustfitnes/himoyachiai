import React from 'react';
import { LogOut } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

export default function PanicButton({ className = '' }) {
  const { triggerPanicEscape } = useAssessment();

  return (
    <button
      onClick={triggerPanicEscape}
      type="button"
      className={`group inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-xl transition-all active:scale-95 focus:ring-2 focus:ring-red-500 focus:outline-none dark:bg-red-950/50 dark:text-red-200 dark:border-red-900/60 shadow-sm min-h-[38px] ${className}`}
      title="Sahifani darhol yopish va Google qidiruviga o'tish (Esc tugmasini 2 marta bosing)"
      aria-label="Tezkor chiqish: sahifani darhol yopish"
    >
      <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 dark:text-red-400 group-hover:scale-105 transition-transform shrink-0" />
      <span>Tezkor chiqish</span>
      <span className="hidden md:inline-block text-[10px] font-mono opacity-70 bg-red-200/50 dark:bg-red-900/40 px-1 py-0.5 rounded ml-0.5">
        2x Esc
      </span>
    </button>
  );
}
