import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckSquare, 
  Square, 
  Printer, 
  AlertTriangle, 
  Phone, 
  FileDown, 
  Lock, 
  Home as HomeIcon, 
  MapPin, 
  Smartphone, 
  Users,
  CheckCircle2
} from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

const SAFETY_SECTIONS = [
  {
    id: 'bag',
    title: "1. Favqulodda xavfsizlik sumkasi (Go-Bag)",
    icon: HomeIcon,
    desc: "Zudlik bilan xavfsiz joyga ketishga to'g'ri kelsa, tayyor turishi kerak bo'lgan asosiy buyumlar:",
    items: [
      { id: 'b1', text: "Shaxsiy pasport va bolalarning tug'ilganlik haqidagi guvohnomalari (asli yoki telefoningizdagi xavfsiz fotosurati)" },
      { id: 'b2', text: "Zarur dori-darmonlar (agar doimiy ichiladigan dori bo'lsa) va gigiyena vositalari" },
      { id: 'b3', text: "Bir oz naqd pul (bank kartalari bloklanishi yoki kuzatilishi mumkin)" },
      { id: 'b4', text: "Uy va agar bor bo'lsa mashinaning zaxira kaliti" },
      { id: 'b5', text: "Telefon quvvatlagich (powerbank yoki zaryadka kabeli)" },
    ],
  },
  {
    id: 'codeword',
    title: "2. Ishonchli aloqa va maxfiy so'z (Code Word)",
    icon: Phone,
    desc: "Boshqalar eshitganda sezilmaydigan, lekin yaqinlaringizga xavf haqida bildirish usuli:",
    items: [
      { id: 'c1', text: "Eng yaqin dugonangiz yoki qarindoshingiz bilan maxfiy kod so'z belgilang (masalan: 'Kitobimni olib kelishni unutibman' = Menga tezda yordam kerak, 102 ga qo'ng'iroq qil)" },
      { id: 'c2', text: "Bolangiz bo'lsa, unga ham bu maxfiy so'zni o'rgating: u xavfni sezsa shu so'zni aytadi" },
      { id: 'c3', text: "Telefoningiz tezkor terish (speed dial) tugmasiga 1146 yoki 102 ni sozlab qo'ying" },
    ],
  },
  {
    id: 'streetsafety',
    title: "3. Ko'chada va taksida xavfsizlik",
    icon: MapPin,
    desc: "Taksida yoki notanish yo'lda kutilmagan bosim paydo bo'lganda:",
    items: [
      { id: 's1', text: "Taksiga o'tirganda darhol yaqiningizga Telegram orqali jonli lokatsiya (Live location) yuboring" },
      { id: 's2', text: "Mashina davlat raqamini va rangini xabarda yozib qoldiring" },
      { id: 's3', text: "Agar eshik qulflansa yoki notanish yo'lga burilsa: tortishmang, odamlar ko'p bo'lgan yorug' joyda (do'kon, bekat) to'xtatishni qat'iy talab qiling" },
      { id: 's4', text: "Hushyorlikni oshiring va zudlik bilan 102 ga terib ovoz chiqarib gapiring: 'Men shu mashinadaman, haydovchi to'xtatmayapti'" },
    ],
  },
  {
    id: 'digitalsafety',
    title: "4. Raqamli va kiber xavfsizlik",
    icon: Smartphone,
    desc: "Shaxsiy suratlarni tarqatish tahdidi yoki telefon tekshiruvi xavfida:",
    items: [
      { id: 'd1', text: "Telegram sozlamalaridan 'Active Sessions' (Faol seanslar)ni tekshiring va shubhali qurilmalarni o'chiring" },
      { id: 'd2', text: "Shantajchiga hech qachon pul to'lamang va savdolashmang — bu bosimni oshiradi" },
      { id: 'd3', text: "Barcha tahdidli xabarlar, akkaunt havolalari va fotosuratlarning skrinshotini saqlab oling (dalil uchun)" },
      { id: 'd4', text: "IIV Kiberxavfsizlik markaziga (1102) murojaat qiling va akkauntni bloklang" },
    ],
  },
];

export default function SafetyPlan() {
  const [checkedItems, setCheckedItems] = useState({});

  const toggleItem = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const totalItems = SAFETY_SECTIONS.reduce((acc, sec) => acc + sec.items.length, 0);
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((checkedCount / totalItems) * 100);

  return (
    <div className="py-2 sm:py-8 max-w-4xl mx-auto space-y-4 sm:space-y-6 animate-fade-in text-slate-900">
      
      {/* Title */}
      <div className="card-senior p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-heading font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1.5 sm:mb-2">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
              <span>Interaktiv Tayyorgarlik Rejasi</span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight text-slate-900">
              Shaxsiy Xavfsizlik Rejasi
            </h1>
            <p className="text-xs sm:text-sm font-sans text-slate-600 mt-1 max-w-xl leading-relaxed">
              Favqulodda vaziyatda dovdirab qolmaslik uchun har bir qadamni oldindan rejalashtiring. Ushbu nazorat ro‘yxati sizga va bolalaringizga zudlik bilan xavfsiz joyga yetib olishga yordam beradi.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 w-full sm:w-auto transition-colors cursor-pointer shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Chop etish (PDF)</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="pt-3 sm:pt-4 border-t border-slate-100 space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-xs font-heading font-bold">
            <span className="text-slate-700">Tayyorgarlik darajasi:</span>
            <span className="text-emerald-700 font-mono">{checkedCount}/{totalItems} ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 sm:h-2.5 overflow-hidden border border-slate-200">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Safety Sections */}
      <div className="space-y-4 sm:space-y-6">
        {SAFETY_SECTIONS.map((sec) => {
          const SectionIcon = sec.icon;
          return (
            <div key={sec.id} className="card-senior p-4 sm:p-6 lg:p-8 space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <SectionIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-base text-slate-900">
                    {sec.title}
                  </h2>
                  <p className="text-xs font-sans text-slate-500">
                    {sec.desc}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {sec.items.map((item) => {
                  const isChecked = !!checkedItems[item.id];
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-emerald-50/60 border-emerald-300 text-slate-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                      )}
                      <span className={`text-xs sm:text-sm font-sans leading-relaxed ${isChecked ? 'line-through text-slate-500' : ''}`}>
                        {item.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
