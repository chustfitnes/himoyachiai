import React from 'react';
import { ShieldCheck, EyeOff, Trash2, Globe, Send, AlertTriangle, Layers, Lock, Cpu, ServerOff } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="py-4 sm:py-8 max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-fade-in text-slate-900">
      
      {/* Title */}
      <div className="card-senior p-6 sm:p-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Xavfsizlik & Maxfiylik Bayonnomasi</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight text-slate-900">
          Maxfiylik va Xavfsizlik Kafolati
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
          Biz sizning to‘liq maxfiyligingiz va xavfsizligingizni qanday ta’minlashimiz haqida ochiq texnik bayonnoma.
        </p>
      </div>

      {/* Architecture Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Zero-Log Policy */}
        <div className="p-6 rounded-2xl card-senior space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <ServerOff className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-base text-slate-900">
            Ma’lumotlar bazasi mavjud emas (Zero-Log)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            Siz kiritgan holat tasviri va tahlil natijalari serverimizning doimiy xotirasida (diskda) hech qachon saqlanmaydi. Bizda MySQL, MongoDB, PostgreSQL yoki boshqa ma’lumotlar bazasi mutlaqo mavjud emas.
          </p>
        </div>

        {/* RAM-Only Processing */}
        <div className="p-6 rounded-2xl card-senior space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-base text-slate-900">
            Faqat operativ xotirada (RAM-only)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            Matningiz sun’iy intellektga yuborilayotgan millisekundlardagina serverning operativ xotirasida (RAM) turadi va tahlil yakunlanishi bilan bir zumda o‘chiriladi.
          </p>
        </div>

        {/* No local storage or cookies */}
        <div className="p-6 rounded-2xl card-senior space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <EyeOff className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-base text-slate-900">
            Brauzerda iz qoldirmaydi
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            Tizim brauzerning <code className="text-xs bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono">localStorage</code> yoki <code className="text-xs bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono">cookies</code> omborlariga hech qanday shaxsiy matn yoki natijalarni yozmaydi.
          </p>
        </div>

        {/* Equal Protection */}
        <div className="p-6 rounded-2xl card-senior space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Layers className="w-5 h-5" />
          </div>
          <h2 className="font-heading font-bold text-base text-slate-900">
            Har qanday vaziyatda xolis yordam
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
            HimoyaAI nafaqat oiladagi tazyiq, balki ko‘chada ta’qib, taksida xavf, ish yoki o‘qish joyidagi bosim hamda kiber-makondagi shantaj bo‘yicha ham birdek xolis ko‘mak beradi.
          </p>
        </div>
      </div>

      {/* Emergency Exit Shortcut Note */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5 text-xs text-slate-600 font-sans">
        <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p>
          <strong>Tezkor Chiqish (Panic Button):</strong> Agar kutilmaganda xonaga boshqa shaxs kirib qolsa, klaviaturadagi <kbd className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 font-mono text-[11px]">Esc</kbd> tugmasini 2 marta bosing yoki yuqori o‘ng burchakdagi "Chiqish" tugmasini bosing — sayt darhol neytral qidiruv tizimiga yo‘naltiriladi va barcha ma'lumotlar o‘chiriladi.
        </p>
      </div>
    </div>
  );
}
