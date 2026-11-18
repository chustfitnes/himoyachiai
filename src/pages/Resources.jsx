import React from 'react';
import ContactCard from '../components/ContactCard';
import { Shield, FileCheck, Clock, CheckCircle2 } from 'lucide-react';

export default function Resources() {
  return (
    <div className="py-4 sm:py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink-primary-light dark:text-ink-primary-dark tracking-tight">
          Yordam resurslari va tashkilotlar
        </h1>
        <p className="text-xs sm:text-sm text-ink-secondary-light dark:text-ink-secondary-dark mt-1 font-sans">
          Oilada, ko‘chada, taksida yoki internetda tazyiqqa uchraganda murojaat qilish mumkin bo‘lgan rasmiy davlat va nodavlat xizmatlari.
        </p>
      </div>

      {/* Directory of Services with tap-to-call buttons */}
      <div className="space-y-4">
        <ContactCard contactKey="hotline_1146" />
        <ContactCard contactKey="police_102" />
        <ContactCard contactKey="cyber_102" />
        <ContactCard contactKey="inson_center" />
        <ContactCard contactKey="legal" />
        <ContactCard contactKey="psychologist" />
      </div>

      {/* Educational Guide: "Himoya orderi" tartibi */}
      <div className="p-5 sm:p-6 rounded-2xl border border-brand-200 bg-brand-50/50 dark:border-brand-800/80 dark:bg-brand-950/20 shadow-soft">
        <div className="flex items-center gap-2 mb-3">
          <FileCheck className="w-5 h-5 text-brand-600 dark:text-brand-300" />
          <h2 className="text-base sm:text-lg font-serif font-bold text-ink-primary-light dark:text-ink-primary-dark">
            Himoya orderi nima va u qanday olinadi?
          </h2>
        </div>

        <p className="text-xs sm:text-sm text-ink-secondary-light dark:text-ink-secondary-dark leading-relaxed mb-4">
          O‘zbekiston Respublikasining "Xotin-qizlarni tazyiq va zo‘ravonlikdan himoya qilish to‘g‘risida"gi qonuniga binoan, har bir ayol va qiz davlatdan bepul Himoya orderi olish huquqiga ega.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-brand-200/60 dark:border-brand-800/60 text-xs sm:text-sm">
          <div className="space-y-1">
            <span className="font-semibold text-ink-primary-light dark:text-ink-primary-dark flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-600 dark:text-brand-300" />
              Muddat va bepullik
            </span>
            <p className="text-ink-secondary-light dark:text-ink-secondary-dark text-xs">
              30 kunga beriladi va hech qanday to‘lov talab etilmaydi. Zarur bo‘lsa, yana 30 kunga uzaytiriladi.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-ink-primary-light dark:text-ink-primary-dark flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-brand-600 dark:text-brand-300" />
              Qayerdan olinadi?
            </span>
            <p className="text-ink-secondary-light dark:text-ink-secondary-dark text-xs">
              Mahalla profilaktika inspektori (uchastkovoy) yoki "Inson" ijtimoiy xizmatlar markazi orqali 24 soat ichida beriladi.
            </p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-ink-primary-light dark:text-ink-primary-dark flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-300" />
              Nimalarni cheklaydi?
            </span>
            <p className="text-ink-secondary-light dark:text-ink-secondary-dark text-xs">
              Tajovuzkorning yaqinlashishi, qo‘ng‘iroq qilishi, xabar yozishi va tahdid qilishi qat’iy taqiqlanadi. Buzilsa — qonuniy jazo qo‘llaniladi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
