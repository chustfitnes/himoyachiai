import React from 'react';
import { LogOut } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

export default function PanicButton({ compact = false }) {
  const { triggerPanicEscape } = useAssessment();

  return (
    <button
      type="button"
      onClick={triggerPanicEscape}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 active:bg-rose-700 text-rose-700 hover:text-white border border-rose-200/90 text-xs font-heading font-bold transition-all cursor-pointer shadow-xs active:scale-95 group"
      title="Tezkor Chiqish: Sahifani yopadi va Google'ga o'tkazadi (Esc tugmasini 2 marta bosing)"
      aria-label="Tezkor chiqish tugmasi"
    >
      <LogOut className="w-3.5 h-3.5 shrink-0 group-hover:rotate-12 transition-transform" />
      <span>Chiqish</span>
      <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-rose-100 group-hover:bg-rose-700 group-hover:text-white text-rose-800 border border-rose-200/80 transition-colors">
        Esc
      </kbd>
    </button>
  );
}
