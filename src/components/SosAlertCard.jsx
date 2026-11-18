import React from 'react';
import { PhoneCall, AlertOctagon, ShieldAlert, Check } from 'lucide-react';

export default function SosAlertCard() {
  return (
    <div
      className="p-5 sm:p-6 rounded-2xl bg-red-600 text-white shadow-soft-lg space-y-4 animate-fade-in"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <AlertOctagon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-serif font-bold tracking-tight">
            Shoshilinch xavfsizlik chorasi
          </h2>
          <p className="text-xs sm:text-sm text-red-100 font-sans">
            Sizning hayotingiz yoki xavfsizligingiz xavf ostida bo‘lishi mumkin
          </p>
        </div>
      </div>

      {/* Immediate Call Buttons: 102 and 1146 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        <a
          href="tel:102"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-white text-red-700 font-bold rounded-xl hover:bg-red-50 transition-colors shadow-sm focus:ring-4 focus:ring-white/50 focus:outline-none min-h-[48px] text-base"
        >
          <PhoneCall className="w-5 h-5 text-red-600" />
          <span>102 — Ichki ishlar</span>
        </a>

        <a
          href="tel:1146"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-xl border border-white/30 transition-colors focus:ring-4 focus:ring-white/40 focus:outline-none min-h-[48px] text-base"
        >
          <PhoneCall className="w-5 h-5 text-red-200" />
          <span>1146 — Ishonch telefoni</span>
        </a>
      </div>

      {/* Short Safety Steps */}
      <div className="pt-2 border-t border-red-500/60">
        <p className="text-xs font-semibold uppercase tracking-wider text-red-200 mb-2">
          Tezkor xavfsizlik choralari:
        </p>
        <ul className="text-xs sm:text-sm space-y-1.5 text-red-50">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-red-200 shrink-0 mt-0.5" />
            <span>Chiqish eshigiga yaqin xavfsiz xonaga o'ting (oshxona va hammomdan saqlaning).</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-red-200 shrink-0 mt-0.5" />
            <span>Telefoningizni doim to'liq quvvatda va yoningizda saqlang.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-red-200 shrink-0 mt-0.5" />
            <span>Ishonchli qo'shningiz yoki yaqiningizga oldindan xavf signali haqida kelishib oling.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
