import React from 'react';
import { Phone, AlertCircle } from 'lucide-react';

export default function EmergencyFooter() {
  return (
    <footer
      className="mt-auto border-t border-borderSubtle-light bg-surfaceSubtle-light/70 dark:border-borderSubtle-dark dark:bg-surfaceSubtle-dark/70 py-4 transition-colors"
      aria-label="Favqulodda yordam raqamlari"
    >
      <div className="max-w-reading mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-ink-secondary-light dark:text-ink-secondary-dark">
            <AlertCircle className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
            <span>Shoshilinch holatda darhol bog‘laning:</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <a
              href="tel:1146"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface-light border border-borderSubtle-light text-ink-primary-light font-medium rounded-xl hover:border-brand-500 hover:text-brand-600 transition-colors focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-surface-dark dark:border-borderSubtle-dark dark:text-ink-primary-dark dark:hover:border-brand-400 min-h-[44px]"
              aria-label="1146 ishonch telefoniga qo'ng'iroq qilish (bepul, 24/7)"
            >
              <Phone className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>1146</span>
              <span className="text-[11px] text-ink-muted-light dark:text-ink-muted-dark">Ishonch</span>
            </a>

            <a
              href="tel:102"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50/80 border border-red-200 text-red-700 font-semibold rounded-xl hover:bg-red-100 transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none dark:bg-red-950/40 dark:border-red-900/60 dark:text-red-300 min-h-[44px]"
              aria-label="102 ichki ishlar xizmatiga qo'ng'iroq qilish"
            >
              <Phone className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span>102</span>
              <span className="text-[11px] font-normal text-red-600/80 dark:text-red-400/80">Ichki ishlar</span>
            </a>
          </div>
        </div>

        <div className="mt-3 text-center text-[11px] text-ink-muted-light dark:text-ink-muted-dark">
          HimoyaAI &bull; Raqamli avlod qizlari tanlovi uchun maxsus &bull; Hech qanday shaxsiy ma'lumot saqlanmaydi
        </div>
      </div>
    </footer>
  );
}
