import React from 'react';
import { Phone, Building2, Scale, HeartHandshake, Shield, Globe, Users } from 'lucide-react';

export const CONTACT_REGISTRY = {
  hotline_1146: {
    id: 'hotline_1146',
    title: '1146 — Ayollar va bolalar ishonch telefoni',
    phone: '1146',
    phoneDisplay: '1146',
    badge: '24/7 • Bepul',
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
    desc: "Telegram, Instagram orqali shaxsiy fotosuratlarni tarqatish, akkauntni buzish, tovlamachilik va intim shantaj holatlari bo'yicha.",
    icon: Globe,
    highlight: false,
  },
};

export default function ContactCard({ contactKey }) {
  const item = CONTACT_REGISTRY[contactKey];
  if (!item) return null;

  const IconComponent = item.icon || Phone;

  return (
    <div
      className={`card-senior-interactive p-5 sm:p-6 flex flex-col justify-between space-y-4 ${
        item.highlight
          ? 'border-emerald-300 bg-emerald-50/30'
          : 'bg-white'
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                item.highlight
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <IconComponent className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-slate-900 leading-snug">
              {item.title}
            </h3>
          </div>
          <span
            className={`text-[10px] font-heading font-bold px-2.5 py-1 rounded-full border whitespace-nowrap shrink-0 ${
              item.highlight
                ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {item.badge}
          </span>
        </div>

        <p className="text-xs font-sans text-slate-600 leading-relaxed">
          {item.desc}
        </p>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-base font-mono font-bold text-slate-900">
          {item.phoneDisplay}
        </span>
        <a
          href={`tel:${item.phone}`}
          className={`px-4 py-2 rounded-xl text-xs font-heading font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 ${
            item.highlight
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Qo‘ng‘iroq</span>
        </a>
      </div>
    </div>
  );
}
