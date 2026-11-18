import React from 'react';
import { Phone, Building2, Scale, HeartHandshake, Shield, Globe, Users } from 'lucide-react';

export const CONTACT_REGISTRY = {
  hotline_1146: {
    id: 'hotline_1146',
    title: '1146 — Ayollar va bolalar ishonch telefoni',
    phone: '1146',
    phoneDisplay: '1146',
    badge: '24/7 &bull; Bepul',
    desc: "Tazyiq, zo'ravonlik yoki shantajga uchragan xotin-qizlar va bolalar uchun davlat ishonch telefoni. Mutaxassislar bilan to'liq maxfiy suhbat.",
    icon: Phone,
    highlight: true,
  },
  police_102: {
    id: 'police_102',
    title: '102 — Ichki ishlar organi',
    phone: '102',
    phoneDisplay: '102',
    badge: 'Favqulodda tezkor',
    desc: "Hayotga bevosita xavf, jismoniy zo'ravonlik, ta'qib qilish yoki mashinadan tushirmaslik holatlarida patrul chaqirish.",
    icon: Shield,
    highlight: false,
  },
  inson_center: {
    id: 'inson_center',
    title: '"Inson" ijtimoiy xizmatlar markazlari',
    phone: '1140',
    phoneDisplay: '1140 / Mahalliy markaz',
    badge: 'Davlat xizmati',
    desc: "30 kunlik bepul Himoya orderi rasmiylashtirish, vaqtinchalik xavfsiz boshpana (shelter) va ijtimoiy hamrohlik.",
    icon: Building2,
    highlight: false,
  },
  legal: {
    id: 'legal',
    title: '"Madad" bepul yuridik yordam portali',
    phone: '1008',
    phoneDisplay: '1008',
    badge: 'Huquqiy ko‘mak',
    desc: "Himoya orderi olish, shantaj va tahdidlar yuzasidan ariza berish bo'yicha bepul professional huquqshunos maslahati.",
    icon: Scale,
    highlight: false,
  },
  psychologist: {
    id: 'psychologist',
    title: 'Reabilitatsiya va moslashuv markazi',
    phone: '1146',
    phoneDisplay: '1146 orqali',
    badge: 'Ruhiy ko‘mak',
    desc: "Ruhiy bosim, qo'rquv, aybdorlik hissi yoki depressiyani yengish uchun tajribali psixologlar ko'magi.",
    icon: HeartHandshake,
    highlight: false,
  },
  cyber_102: {
    id: 'cyber_102',
    title: 'IIV Kiberxavfsizlik markazi',
    phone: '1102',
    phoneDisplay: '1102',
    badge: 'Kiberxavfsizlik',
    desc: "Shaxsiy suratlarni tarqatish bilan shantaj qilish (sextortion), akkaunt buzish va internetdagi tahdidlar bo'yicha tezkor murojaat.",
    icon: Globe,
    highlight: true,
  },
  trusted_adult: {
    id: 'trusted_adult',
    title: 'Ishonchli katta yoshli inson',
    phone: '1146',
    phoneDisplay: '1146 / Oila',
    badge: 'Bolalar himoyasi',
    desc: "Ota-onangiz, yaqin qarindoshingiz yoki maktabdagi ishonchli o'qituvchingizga ayting. Uyat yoki ayb aslo sizda emas.",
    icon: Users,
    highlight: true,
  },
};

export default function ContactCard({ contactKey }) {
  const data = CONTACT_REGISTRY[contactKey];
  if (!data) return null;

  const IconComp = data.icon;

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-borderSubtle-light bg-surface-light dark:border-borderSubtle-dark dark:bg-surface-dark shadow-soft transition-colors flex flex-col justify-between gap-3">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surfaceSubtle-light dark:bg-surfaceSubtle-dark flex items-center justify-center text-brand-600 dark:text-brand-300 shrink-0">
              <IconComp className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-ink-primary-light dark:text-ink-primary-dark">
              {data.title}
            </h3>
          </div>
          <span
            className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-surfaceSubtle-light text-ink-secondary-light border border-borderSubtle-light dark:bg-surfaceSubtle-dark dark:text-ink-secondary-dark dark:border-borderSubtle-dark shrink-0"
            dangerouslySetInnerHTML={{ __html: data.badge }}
          />
        </div>
        <p className="text-xs sm:text-sm text-ink-secondary-light dark:text-ink-secondary-dark leading-relaxed">
          {data.desc}
        </p>
      </div>

      <div className="pt-2 border-t border-borderSubtle-light dark:border-borderSubtle-dark flex items-center justify-between">
        <span className="text-xs text-ink-muted-light dark:text-ink-muted-dark">
          Bog'lanish:
        </span>
        <a
          href={`tel:${data.phone}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium text-xs sm:text-sm rounded-lg border border-brand-200 transition-colors focus:ring-2 focus:ring-brand-500 focus:outline-none dark:bg-brand-900/40 dark:text-brand-200 dark:border-brand-700/60 min-h-[44px]"
          aria-label={`${data.title} ga qo‘ng‘iroq qilish (${data.phoneDisplay})`}
        >
          <Phone className="w-3.5 h-3.5 text-brand-600 dark:text-brand-300" />
          <span>Qo‘ng‘iroq: {data.phoneDisplay}</span>
        </a>
      </div>
    </div>
  );
}
