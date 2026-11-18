import React from 'react';
import { Link } from 'react-router-dom';
import { EyeOff, Database, HeartHandshake, ArrowRight, ShieldCheck, MapPin, Home as HomeIcon, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="py-6 sm:py-12 flex flex-col items-center text-center">
      {/* Subtle indicator tag */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surfaceSubtle-light text-brand-700 border border-brand-200/60 dark:bg-surfaceSubtle-dark dark:text-brand-300 dark:border-brand-800/60 mb-5">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Maxfiy va xolis yordam tizimi</span>
      </div>

      {/* Main Headline: Covers ALL situations, not only family */}
      <h1 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-ink-primary-light dark:text-ink-primary-dark tracking-tight leading-[1.2] max-w-xl mb-4">
        Xavfsiz bo‘lmagan har qanday vaziyatda yordam
      </h1>

      {/* Reassuring and inclusive subheadline */}
      <p className="text-sm sm:text-base md:text-lg text-ink-secondary-light dark:text-ink-secondary-dark font-sans leading-relaxed max-w-lg mb-4">
        Siz yolg‘iz emassiz. O‘z so‘zlaringiz bilan tasvirlang — xavf darajasini xolis baholaymiz, ayblamaymiz va qayerga murojaat qilishni aniq ko‘rsatamiz.
      </p>

      {/* Clear scope guarantee */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surfaceSubtle-light/90 dark:bg-surfaceSubtle-dark/90 border border-borderSubtle-light dark:border-borderSubtle-dark text-xs sm:text-sm text-ink-primary-light dark:text-ink-primary-dark font-medium mb-8">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Bu xizmat oilada ham, ko‘chada ham, internetda ham ishlaydi.</span>
      </div>

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

      {/* Scope Highlights: Family, Public/Street, Online */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full max-w-lg text-left text-xs sm:text-sm">
        <div className="p-3 rounded-xl border border-borderSubtle-light bg-surface-light dark:border-borderSubtle-dark dark:bg-surface-dark flex items-start gap-2.5">
          <HomeIcon className="w-4 h-4 text-brand-600 dark:text-brand-300 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-ink-primary-light dark:text-ink-primary-dark block">Oilada va uyda</span>
            <span className="text-[11px] text-ink-secondary-light dark:text-ink-secondary-dark leading-tight">Bosim, kaltaklash, pul yoki aloqa nazorati</span>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-borderSubtle-light bg-surface-light dark:border-borderSubtle-dark dark:bg-surface-dark flex items-start gap-2.5">
          <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-300 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-ink-primary-light dark:text-ink-primary-dark block">Ko‘chada va transportda</span>
            <span className="text-[11px] text-ink-secondary-light dark:text-ink-secondary-dark leading-tight">Taksi, orqadan ergashish, begona ta'qibi</span>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-borderSubtle-light bg-surface-light dark:border-borderSubtle-dark dark:bg-surface-dark flex items-start gap-2.5">
          <Globe className="w-4 h-4 text-brand-600 dark:text-brand-300 mt-0.5 shrink-0" />
          <div>
            <span className="font-semibold text-ink-primary-light dark:text-ink-primary-dark block">Internetda va o‘qishda</span>
            <span className="text-[11px] text-ink-secondary-light dark:text-ink-secondary-dark leading-tight">Surat bilan shantaj, bolani aldash, tahdid</span>
          </div>
        </div>
      </div>

      {/* Three Trust Points: Anonim, Hech narsa saqlanmaydi, Bepul */}
      <div className="mt-8 sm:mt-10 pt-6 border-t border-borderSubtle-light dark:border-borderSubtle-dark w-full max-w-md">
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
