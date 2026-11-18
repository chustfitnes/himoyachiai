import React from 'react';
import { Link } from 'react-router-dom';
import { EyeOff, Database, HeartHandshake, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="py-8 sm:py-14 flex flex-col items-center text-center">
      {/* Subtle indicator tag */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surfaceSubtle-light text-brand-700 border border-brand-200/60 dark:bg-surfaceSubtle-dark dark:text-brand-300 dark:border-brand-800/60 mb-6">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Maxfiy va xolis yordam tizimi</span>
      </div>

      {/* Main Headline: Editorial serif, warm, serious, empathetic */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-ink-primary-light dark:text-ink-primary-dark tracking-tight leading-[1.2] max-w-lg mb-4">
        Siz yolg‘iz emassiz. Vaziyatingizni xolis baholang.
      </h1>

      {/* One gentle explanatory sentence */}
      <p className="text-base sm:text-lg text-ink-secondary-light dark:text-ink-secondary-dark font-sans leading-relaxed max-w-md mb-8 sm:mb-10">
        Oilaviy bosim yoki nazorat ostidamisiz? O‘z so‘zlaringiz bilan tasvirlang — xavf darajasini aniqlab, qayerga murojaat qilishni ko‘rsatamiz.
      </p>

      {/* Primary Action Button: "Vaziyatni tasvirlash" */}
      <div className="w-full sm:w-auto">
        <Link
          to="/describe"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 bg-brand-500 hover:bg-brand-600 text-white font-medium text-base sm:text-lg rounded-2xl shadow-soft transition-all transform active:scale-[0.98] focus:ring-4 focus:ring-brand-500/30 focus:outline-none min-h-[48px]"
        >
          <span>Vaziyatni tasvirlash</span>
          <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </Link>
      </div>

      {/* Three Trust Points: Anonim, Hech narsa saqlanmaydi, Bepul */}
      <div className="mt-10 sm:mt-14 pt-8 border-t border-borderSubtle-light dark:border-borderSubtle-dark w-full max-w-md">
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-surfaceSubtle-light dark:bg-surfaceSubtle-dark flex items-center justify-center text-ink-secondary-light dark:text-ink-secondary-dark mb-2">
              <EyeOff className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-ink-primary-light dark:text-ink-primary-dark">
              100% Anonim
            </span>
            <span className="text-[11px] text-ink-muted-light dark:text-ink-muted-dark mt-0.5">
              Ism so‘ralmaydi
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-surfaceSubtle-light dark:bg-surfaceSubtle-dark flex items-center justify-center text-ink-secondary-light dark:text-ink-secondary-dark mb-2">
              <Database className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-ink-primary-light dark:text-ink-primary-dark">
              Saqlanmaydi
            </span>
            <span className="text-[11px] text-ink-muted-light dark:text-ink-muted-dark mt-0.5">
              Xotiradan o‘chadi
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-surfaceSubtle-light dark:bg-surfaceSubtle-dark flex items-center justify-center text-ink-secondary-light dark:text-ink-secondary-dark mb-2">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-ink-primary-light dark:text-ink-primary-dark">
              To‘liq bepul
            </span>
            <span className="text-[11px] text-ink-muted-light dark:text-ink-muted-dark mt-0.5">
              Kunu-tun ochiq
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
