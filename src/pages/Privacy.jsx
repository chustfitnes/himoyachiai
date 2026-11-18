import React from 'react';
import { ShieldCheck, EyeOff, Trash2, Globe, Send, AlertTriangle, Layers } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="py-4 sm:py-8 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink-primary-light dark:text-ink-primary-dark tracking-tight">
          Maxfiylik va xavfsizlik kafolati
        </h1>
        <p className="text-xs sm:text-sm text-ink-secondary-light dark:text-ink-secondary-dark mt-1 font-sans">
          Biz sizning to‘liq maxfiyligingiz va xavfsizligingizni qanday ta’minlashimiz haqida ochiq bayon.
        </p>
      </div>

      {/* Zero-Log Policy Cards */}
      <div className="space-y-4">
        {/* Coverage Scope: Every Situation */}
        <div className="p-5 rounded-2xl border border-borderSubtle-light bg-surface-light dark:border-borderSubtle-dark dark:bg-surface-dark shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center text-brand-600 dark:text-brand-300">
              <Layers className="w-4 h-4" />
            </div>
            <h2 className="font-serif font-bold text-base text-ink-primary-light dark:text-ink-primary-dark">
              Har qanday vaziyatda teng himoya
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary-light dark:text-ink-secondary-dark leading-relaxed">
            HimoyaAI nafaqat oiladagi tazyiq, balki ko‘chada (ta'qib qilish, taksida ushlab turish), ish yoki o‘qish joyidagi bosim hamda internetdagi xavflar (suratlar bilan shantaj, bolalarni aldash) bo‘yicha ham birdek xolis ko‘mak beradi.
          </p>
        </div>

        {/* Memory Only */}
        <div className="p-5 rounded-2xl border border-borderSubtle-light bg-surface-light dark:border-borderSubtle-dark dark:bg-surface-dark shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-300">
              <EyeOff className="w-4 h-4" />
            </div>
            <h2 className="font-serif font-bold text-base text-ink-primary-light dark:text-ink-primary-dark">
              Ma'lumotlar bazasi mavjud emas (Zero-Log Policy)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary-light dark:text-ink-secondary-dark leading-relaxed">
            Siz kiritgan holat tasviri va tahlil natijalari faqat qurilmangizning vaqtinchalik operativ xotirasida (RAM) turadi. Bizning serverlarimizda hech qanday ma'lumotlar bazasi yo'q, xabarlar jurnali (logs) yuritilmaydi va sahifa yopilgach xotiradan butunlay yo‘qoladi.
          </p>
        </div>

        {/* No local storage / cookies */}
        <div className="p-5 rounded-2xl border border-borderSubtle-light bg-surface-light dark:border-borderSubtle-dark dark:bg-surface-dark shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center text-brand-600 dark:text-brand-300">
              <Trash2 className="w-4 h-4" />
            </div>
            <h2 className="font-serif font-bold text-base text-ink-primary-light dark:text-ink-primary-dark">
              Brauzer xotirasiga yozilmaydi
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary-light dark:text-ink-secondary-dark leading-relaxed">
            Ilova brauzerning <code className="text-xs bg-surfaceSubtle-light dark:bg-surfaceSubtle-dark px-1.5 py-0.5 rounded">localStorage</code> yoki <code className="text-xs bg-surfaceSubtle-light dark:bg-surfaceSubtle-dark px-1.5 py-0.5 rounded">cookies</code> omborlariga hech qanday shaxsiy matn yoki natijalarni saqlamaydi.
          </p>
        </div>

        {/* Telegram Mini App Safety */}
        <div className="p-5 rounded-2xl border border-borderSubtle-light bg-surface-light dark:border-borderSubtle-dark dark:bg-surface-dark shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center text-sky-600 dark:text-sky-300">
              <Send className="w-4 h-4" />
            </div>
            <h2 className="font-serif font-bold text-base text-ink-primary-light dark:text-ink-primary-dark">
              Telegram Mini App xavfsizligi
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary-light dark:text-ink-secondary-dark leading-relaxed">
            Telegram ichida ochilganda ilova telefonga alohida dastur sifatida o‘rnatilmaydi va ilovalar ro‘yxatida ko‘rinmaydi. Foydalangandan so‘ng Telegram chat tarixini tozalash (Clear history) kifoya qiladi.
          </p>
        </div>

        {/* Browser History & Incognito Advice */}
        <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/60 dark:border-amber-800/80 dark:bg-amber-950/30 shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-amber-700 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h2 className="font-serif font-bold text-base text-ink-primary-light dark:text-ink-primary-dark">
              Brauzer tarixi va Inkognito (maxfiy) rejim
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary-light dark:text-ink-secondary-dark leading-relaxed mb-3">
            Telefoningiz brauzeri siz tashrif buyurgan sayt manzilini "Tarix" (History) bo‘limida ko‘rsatishi mumkin.
          </p>
          <div className="text-xs text-ink-secondary-light dark:text-ink-secondary-dark space-y-1.5 pl-3 border-l-2 border-amber-400">
            <p><strong>Tavsiya:</strong> Ilovaga kirishdan oldin brauzeringizda <em>"Inkognito rejim" (Incognito / Yangi maxfiy vkladka)</em> oching.</p>
            <p>Xavf tug‘ilganda yuqori burchakdagi <strong>"Tezkor chiqish"</strong> tugmasini bosing yoki klaviaturada <strong>Esc</strong> tugmasini ikki marta tez bosing.</p>
          </div>
        </div>

        {/* Camouflage tab title notice */}
        <div className="p-5 rounded-2xl border border-borderSubtle-light bg-surface-light dark:border-borderSubtle-dark dark:bg-surface-dark shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-300">
              <Globe className="w-4 h-4" />
            </div>
            <h2 className="font-serif font-bold text-base text-ink-primary-light dark:text-ink-primary-dark">
              Niqoblangan sarlavha (Kamuflaj)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary-light dark:text-ink-secondary-dark leading-relaxed">
            Brauzer vkladkalari va ko‘rinishi begonalar e’tiborini tortmasligi uchun sahifaning tashqi sarlavhasi betaraf <em>"Eslatmalar — Shaxsiy qaydlar"</em> ko‘rinishida niqoblangan.
          </p>
        </div>
      </div>
    </div>
  );
}
