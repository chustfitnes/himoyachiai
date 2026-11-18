import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import RiskIndicator from '../components/RiskIndicator';
import SosAlertCard from '../components/SosAlertCard';
import ContactCard from '../components/ContactCard';
import { RotateCcw, XCircle, ChevronRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function Result() {
  const navigate = useNavigate();
  const { result, clearAllData } = useAssessment();

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
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-xl text-sm transition-colors"
        >
          <span>Vaziyatni tasvirlash</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const { risk_percent, level, summary, signs, next_steps, contacts } = result;
  const isRed = level === 'red';

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

      {/* 3. Situation Summary */}
      <div className="p-5 sm:p-6 rounded-2xl border border-borderSubtle-light bg-surface-light dark:border-borderSubtle-dark dark:bg-surface-dark shadow-soft">
        <h2 className="text-base sm:text-lg font-serif font-bold text-ink-primary-light dark:text-ink-primary-dark mb-2">
          Vaziyat umumiy xulosasi
        </h2>
        <p className="text-sm sm:text-base text-ink-secondary-light dark:text-ink-secondary-dark leading-relaxed">
          {summary}
        </p>
      </div>

      {/* 4. Identified Signs */}
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

      {/* 5. Recommended Concrete Next Steps (Ordered List) */}
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

      {/* 6. Who to Contact (Kimga murojaat qilish) */}
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

      {/* 7. Secondary Actions: "Yangi tahlil" & "Natijani yopish" */}
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
