import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import RiskIndicator from '../components/RiskIndicator';
import SosAlertCard from '../components/SosAlertCard';
import ContactCard from '../components/ContactCard';
import {
  RotateCcw,
  XCircle,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  HeartHandshake,
  HelpCircle,
  ShieldAlert,
  Compass,
} from 'lucide-react';

export default function Result() {
  const navigate = useNavigate();
  const { result, clearAllData } = useAssessment();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  // Scroll to top upon viewing result
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Empty state if accessed directly without data
  if (!result) {
    return (
      <div className="py-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-surfaceSubtle-light dark:bg-surfaceSubtle-dark flex items-center justify-center mx-auto text-ink-muted-light dark:text-ink-muted-dark mb-4">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-serif font-bold text-ink-primary-light dark:text-ink-primary-dark mb-2">
          Hozircha tahlil natijasi yo‘q
        </h2>
        <p className="text-sm text-ink-secondary-light dark:text-ink-secondary-dark max-w-sm mx-auto mb-6">
          Vaziyatingizni xolis baholash uchun avval holatni qisqacha tasvirlab bering.
        </p>
        <Link
          to="/describe"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl text-sm transition-colors min-h-[44px]"
        >
          <span>Vaziyatni tasvirlash</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const { risk_percent, level, summary, signs, next_steps, contacts } = result;
  const isRed = level === 'red';
  const isYellow = level === 'yellow';

  const handleNewAnalysis = () => {
    clearAllData();
    navigate('/describe');
  };

  const handleClose = () => {
    clearAllData();
    navigate('/');
  };

  return (
    <div className="py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* 1. CRITICAL: In RED state, SOS Card is at the VERY TOP above everything */}
      {isRed && <SosAlertCard />}

      {/* 2. Visual Risk Indicator with Circular Gauge + Accessible Labels */}
      <RiskIndicator percent={risk_percent} level={level} />

      {/* 3. Reassurance block: "Ayb sizda emas" (for Yellow and Red) */}
      {(isRed || isYellow) && (
        <div className="p-4 sm:p-5 rounded-2xl border border-brand-200 bg-brand-50/60 dark:border-brand-800/80 dark:bg-brand-950/30 shadow-soft">
          <div className="flex items-center gap-2 mb-2 text-brand-700 dark:text-brand-300">
            <HeartHandshake className="w-5 h-5 shrink-0" />
            <h2 className="font-serif font-bold text-base sm:text-lg">
              Ayb sizda emas
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-ink-secondary-light dark:text-ink-secondary-dark leading-relaxed">
            Tazyiq, shantaj yoki zo‘ravonlik sodir etgan shaxs to‘liq javobgardir. Yordam so‘rash — ayb yoki uyat emas. Har bir qadamni o‘zingizga qulay va xavfsiz sur'atda amalga oshirishingiz mumkin.
          </p>
        </div>
      )}

      {/* 4. Situation Summary */}
      <div className="p-5 sm:p-6 rounded-2xl border border-borderSubtle-light bg-surface-light dark:border-borderSubtle-dark dark:bg-surface-dark shadow-soft">
        <h2 className="text-base sm:text-lg font-serif font-bold text-ink-primary-light dark:text-ink-primary-dark mb-2">
          Vaziyat umumiy xulosasi
        </h2>
        <p className="text-sm sm:text-base text-ink-secondary-light dark:text-ink-secondary-dark leading-relaxed">
          {summary}
        </p>
      </div>

      {/* 5. Identified Signs */}
      {signs && signs.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl border border-borderSubtle-light bg-surface-light dark:border-borderSubtle-dark dark:bg-surface-dark shadow-soft">
          <h2 className="text-base sm:text-lg font-serif font-bold text-ink-primary-light dark:text-ink-primary-dark mb-3">
            Aniqlangan asosiy belgilar
          </h2>
          <ul className="space-y-2">
            {signs.map((sign, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-secondary-light dark:text-ink-secondary-dark"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0" />
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 6. Step-by-Step, You Choose Path (Special for Yellow Level) */}
      {isYellow && (
        <div className="p-5 sm:p-6 rounded-2xl border border-amber-200 bg-amber-50/50 dark:border-amber-800/80 dark:bg-amber-950/20 shadow-soft">
          <div className="flex items-center gap-2 mb-2 text-amber-800 dark:text-amber-300">
            <Compass className="w-5 h-5 shrink-0" />
            <h2 className="font-serif font-bold text-base sm:text-lg">
              Qadam-baqadam — qaror o‘z qo‘lingizda
            </h2>
          </div>
          <p className="text-xs text-ink-secondary-light dark:text-ink-secondary-dark mb-3">
            Ichki ishlarga borish majburiy shart emas. Siz o‘zingiz tayyor bo‘lgan bosqichdan boshlashingiz mumkin:
          </p>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/70 dark:bg-black/30 border border-amber-200/50 dark:border-amber-900/40">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 font-bold text-xs flex items-center justify-center shrink-0">1</span>
              <div>
                <span className="font-semibold text-ink-primary-light dark:text-ink-primary-dark block">Anonim suhbat:</span>
                <span className="text-ink-secondary-light dark:text-ink-secondary-dark">1146 ishonch telefoni yoki psixologga qo‘ng‘iroq qilib, ismingizni aytmasdan maslahat oling.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/70 dark:bg-black/30 border border-amber-200/50 dark:border-amber-900/40">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 font-bold text-xs flex items-center justify-center shrink-0">2</span>
              <div>
                <span className="font-semibold text-ink-primary-light dark:text-ink-primary-dark block">Yuridik huquqlarni bilish:</span>
                <span className="text-ink-secondary-light dark:text-ink-secondary-dark">"Madad" portali (1008) orqali bepul huquqiy yordam oling va dalillarni xavfsiz saqlang.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/70 dark:bg-black/30 border border-amber-200/50 dark:border-amber-900/40">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 font-bold text-xs flex items-center justify-center shrink-0">3</span>
              <div>
                <span className="font-semibold text-ink-primary-light dark:text-ink-primary-dark block">Mustaqil qaror:</span>
                <span className="text-ink-secondary-light dark:text-ink-secondary-dark">O‘zingizni tayyor his qilganingizda rasmiy ariza berish yoki Himoya orderi olishni tanlang.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Recommended Concrete Next Steps (Ordered List) */}
      {next_steps && next_steps.length > 0 && (
        <div className="p-5 sm:p-6 rounded-2xl border border-borderSubtle-light bg-surface-light dark:border-borderSubtle-dark dark:bg-surface-dark shadow-soft">
          <h2 className="text-base sm:text-lg font-serif font-bold text-ink-primary-light dark:text-ink-primary-dark mb-3">
            Amaliy xavfsizlik qadamlari
          </h2>
          <ol className="space-y-3">
            {next_steps.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-xs sm:text-sm text-ink-secondary-light dark:text-ink-secondary-dark leading-relaxed"
              >
                <span className="w-5 h-5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 font-semibold text-xs flex items-center justify-center shrink-0 mt-0.5 border border-brand-200 dark:border-brand-800">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* 8. Expandable Accordion: "102 ga qo'ng'iroq qilsam nima bo'ladi?" */}
      <div className="rounded-2xl border border-borderSubtle-light bg-surface-light dark:border-borderSubtle-dark dark:bg-surface-dark shadow-soft overflow-hidden">
        <button
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          type="button"
          className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 text-left hover:bg-surfaceSubtle-light dark:hover:bg-surfaceSubtle-dark transition-colors focus:ring-2 focus:ring-brand-500 focus:outline-none min-h-[44px]"
          aria-expanded={isAccordionOpen}
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-5 h-5 text-brand-600 dark:text-brand-300 shrink-0" />
            <span className="font-serif font-bold text-sm sm:text-base text-ink-primary-light dark:text-ink-primary-dark">
              102 ga qo‘ng‘iroq qilsam nima bo‘ladi?
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-ink-muted-light dark:text-ink-muted-dark transition-transform duration-200 shrink-0 ${
              isAccordionOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isAccordionOpen && (
          <div className="p-4 sm:p-5 pt-0 border-t border-borderSubtle-light dark:border-borderSubtle-dark text-xs sm:text-sm text-ink-secondary-light dark:text-ink-secondary-dark space-y-2.5 leading-relaxed bg-surfaceSubtle-light/40 dark:bg-surfaceSubtle-dark/40">
            <p>
              Qo‘ng‘iroq qilganingizda navbatchi operator quyidagi tartibda ishlaydi:
            </p>
            <ol className="list-decimal list-inside space-y-1 pl-1">
              <li>Siz nima sodir bo‘layotganini va hozirgi aniq manzilingizni qisqacha aytasiz.</li>
              <li>Operator darhol eng yaqin patrul mashinasiga yoki mahalla profilaktika inspektoriga xabar beradi.</li>
              <li>Xodimlar yetib kelguncha odamlar ko‘p, yorug‘ va xavfsiz joyda turishingiz so‘raladi.</li>
            </ol>
            <p className="text-[11px] text-ink-muted-light dark:text-ink-muted-dark pt-1 border-t border-borderSubtle-light dark:border-borderSubtle-dark">
              <em>Eslatma:</em> Agar hozir politsiyaga qo‘ng‘iroq qilishga tayyor bo‘lmasangiz, avval <strong>1146 ishonch telefoniga</strong> yoki psixologga qo‘ng‘iroq qilib, xavfsiz vaziyatda maslahatlashib olishingiz mumkin.
            </p>
          </div>
        )}
      </div>

      {/* 9. Who to Contact (Kimga murojaat qilish) */}
      <div>
        <h2 className="text-lg sm:text-xl font-serif font-bold text-ink-primary-light dark:text-ink-primary-dark mb-3">
          Kimga murojaat qilish kerak?
        </h2>
        <div className="space-y-3">
          {contacts && contacts.length > 0 ? (
            contacts.map((key) => <ContactCard key={key} contactKey={key} />)
          ) : (
            <>
              <ContactCard contactKey="hotline_1146" />
              <ContactCard contactKey="inson_center" />
            </>
          )}
        </div>
      </div>

      {/* 10. Secondary Actions: "Yangi tahlil" & "Natijani yopish" */}
      <div className="pt-4 border-t border-borderSubtle-light dark:border-borderSubtle-dark flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={handleNewAnalysis}
          type="button"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-borderSubtle-light bg-surface-light hover:bg-surfaceSubtle-light text-ink-primary-light font-medium text-sm transition-colors dark:border-borderSubtle-dark dark:bg-surface-dark dark:text-ink-primary-dark dark:hover:bg-surfaceSubtle-dark min-h-[44px]"
        >
          <RotateCcw className="w-4 h-4 text-ink-secondary-light dark:text-ink-secondary-dark" />
          <span>Yangi tahlil</span>
        </button>

        <button
          onClick={handleClose}
          type="button"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-transparent text-ink-secondary-light hover:text-ink-primary-light hover:bg-surfaceSubtle-light text-sm font-medium transition-colors dark:text-ink-secondary-dark dark:hover:text-ink-primary-dark dark:hover:bg-surfaceSubtle-dark min-h-[44px]"
        >
          <XCircle className="w-4 h-4" />
          <span>Natijani yopish (Xotirani tozalash)</span>
        </button>
      </div>
    </div>
  );
}
