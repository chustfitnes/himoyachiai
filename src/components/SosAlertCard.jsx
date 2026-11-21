import React from 'react';
import { PhoneCall, AlertOctagon, ShieldAlert, Check } from 'lucide-react';

export default function SosAlertCard() {
  return (
    <div
      className="p-6 rounded-2xl bg-gradient-to-br from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-600/20 space-y-4 animate-fade-in"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/20">
          <AlertOctagon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-heading font-extrabold tracking-tight">
            Shoshilinch Xavfsizlik Chorasi
          </h2>
          <p className="text-xs sm:text-sm text-rose-100 font-sans">
            Sizning hayotingiz yoki xavfsizligingizga bevosita tajovuz bo‘lishi mumkin
          </p>
        </div>
      </div>

      {/* Immediate Call Buttons: 102 and 1146 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <a
          href="tel:102"
          className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white text-rose-700 font-heading font-bold rounded-xl hover:bg-rose-50 transition-all shadow-sm active:scale-95 text-sm sm:text-base cursor-pointer"
        >
          <PhoneCall className="w-5 h-5 text-rose-600" />
          <span>102 — Ichki ishlar (IIB)</span>
        </a>

        <a
          href="tel:1146"
          className="flex items-center justify-center gap-2 px-5 py-3.5 bg-rose-800 hover:bg-rose-900 text-white font-heading font-bold rounded-xl border border-white/30 transition-all shadow-sm active:scale-95 text-sm sm:text-base cursor-pointer"
        >
          <PhoneCall className="w-5 h-5 text-rose-200" />
          <span>1146 — Ishonch telefoni (24/7)</span>
        </a>
      </div>

      {/* Short Safety Steps */}
      <div className="pt-3 border-t border-rose-500/60">
        <p className="text-xs font-heading font-bold uppercase tracking-wider text-rose-200 mb-2">
          Zudlik bilan bajariladigan choralar:
        </p>
        <ul className="text-xs sm:text-sm space-y-1.5 text-rose-50 font-sans">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
            <span>Chiqish eshigiga yaqin xavfsiz xonaga o‘ting (oshxona va hammomdan saqlaning).</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
            <span>Telefoningizni doim to‘liq quvvatda va yoningizda saqlang.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
            <span>Ishonchli qo‘shningiz yoki yaqiningizga xavf signali haqida darhol xabar bering.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
