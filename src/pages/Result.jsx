import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import RiskIndicator from '../components/RiskIndicator';
import ExportReportModal from '../components/ExportReportModal';
import AudioNarrator from '../components/AudioNarrator';
import {
  RotateCcw,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  FileDown,
  ClipboardList,
  Scale,
  PhoneCall,
  CheckCircle2,
  Circle,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function Result() {
  const navigate = useNavigate();
  const { result, clearAllData } = useAssessment();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!result) {
    return (
      <div className="py-16 text-center space-y-5 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-2xl font-heading font-extrabold text-slate-900">
            Hozircha tahlil natijasi yo‘q
          </h2>
          <p className="text-sm font-sans text-slate-600 leading-relaxed">
            Vaziyatingizni xolis baholash va qonuniy yo‘l xaritasini olish uchun avval holatni qisqacha tasvirlab bering.
          </p>
        </div>
        <Link
          to="/describe"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20"
        >
          <span>Vaziyatni tasvirlash</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const risk_level = result.risk_level || result.level || 'green';
  const confidence_pct = result.confidence_pct ?? result.risk_percent ?? 92;
  const signals = result.signals || result.signs || [];
  const actionSummary = result.playbook?.action_summary || result.summary || "Vaziyatingiz bo‘yicha vakolatli davlat va nodavlat xizmatlariga murojaat qilish tavsiya etiladi.";
  const stepsList = result.playbook?.steps || (Array.isArray(result.next_steps) ? result.next_steps.map((st, i) => (typeof st === 'string' ? { title: `${i + 1}-qadam`, desc: st } : st)) : []);

  const isRed = risk_level === 'red';
  const isYellow = risk_level === 'yellow';
  const isGreen = risk_level === 'green';

  const riskLabel = isRed 
    ? "Yuqori Xavf (Zudlik bilan choralar)" 
    : isYellow 
    ? "O‘rta Xavf (Tazyiq va Nazorat)" 
    : "Past Xavf (Neytral / Tavsiyaviy)";

  const calculatedPercent = isRed 
    ? Math.max(85, confidence_pct) 
    : isYellow 
    ? Math.max(50, confidence_pct) 
    : Math.min(30, confidence_pct);

  const toggleStep = (index) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const checkedCount = Object.values(completedSteps).filter(Boolean).length;

  const handleStartOver = () => {
    clearAllData();
    navigate('/describe');
  };

  return (
    <div className="py-2 sm:py-8 max-w-4xl mx-auto space-y-4 sm:space-y-8 animate-fade-in text-slate-900">
      
      {/* 1. High Risk Emergency Alert Banner */}
      {isRed && (
        <div className="p-4 sm:p-6 rounded-2xl bg-rose-50 border border-rose-200/90 shadow-sm space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldAlert className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <span className="text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-rose-700 block">
                  OGOHLANTIRISH // JIDDIY XAVF HOLATI
                </span>
                <h2 className="text-base sm:text-xl font-heading font-extrabold text-rose-950 leading-snug">
                  Hayotingiz yoki sog‘lig‘ingizga bevosita tajovuz mavjud!
                </h2>
                <p className="text-xs sm:text-sm font-sans text-rose-800 mt-1">
                  Kutib o‘tirmang: zudlik bilan xavfsiz joyga o‘ting va 102 yoki 1146 bilan bog‘laning.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:flex items-center gap-2 w-full sm:w-auto shrink-0">
              <a
                href="tel:102"
                className="px-3 sm:px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span>102 (IIB)</span>
              </a>
              <a
                href="tel:1146"
                className="px-3 sm:px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <PhoneCall className="w-4 h-4 shrink-0" />
                <span>1146 (Ishonch)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Risk Indicator Gauge */}
      <RiskIndicator percent={calculatedPercent} level={risk_level} />

      {/* 3. Detailed Institutional Legal Evaluation Card */}
      <div className="card-senior p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                Rasmiy Huquqiy & Xavfsizlik Xulosasi
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                REF-{Date.now().toString().slice(-6)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-950 mt-1">
              {riskLabel}
            </h1>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-heading font-bold bg-slate-100 text-slate-900 border border-slate-200">
              Ishonchlilik: {confidence_pct || 95}%
            </span>
            <AudioNarrator
              textToRead={`${riskLabel}. ${actionSummary}`}
            />
          </div>
        </div>

        {/* Detected Signals / Risk Categories */}
        {signals.length > 0 && (
          <div className="space-y-2.5">
            <span className="text-xs font-heading font-bold text-slate-700 uppercase tracking-wider block">
              Aniqlangan Asosiy Xavf Omillari:
            </span>
            <div className="flex flex-wrap gap-2">
              {signals.map((sig, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-heading font-medium text-slate-800 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  <span>{sig}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Legal Action Summary */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2.5">
          <h3 className="font-heading font-bold text-sm text-slate-950 flex items-center gap-2">
            <Scale className="w-4 h-4 text-slate-700 shrink-0" />
            <span>Tavsiya Etilgan Huquqiy Yo‘l Xaritasi:</span>
          </h3>
          <p className="text-xs sm:text-sm font-sans text-slate-700 leading-relaxed pl-6">
            {actionSummary}
          </p>
        </div>
      </div>

      {/* 4. Interactive Action Steps (Checklist) */}
      {stepsList.length > 0 && (
        <div className="card-senior p-6 sm:p-8 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-emerald-600" />
                <span>Ketma-ket Amallar (Sizning Xavfsizlik Rejangiz):</span>
              </h2>
              <p className="text-xs text-slate-500 font-sans mt-0.5">
                Bajarilgan bosqichlarni belgilang:
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {checkedCount} / {stepsList.length} bajarildi
            </span>
          </div>

          <div className="space-y-3">
            {stepsList.map((st, idx) => {
              const isChecked = !!completedSteps[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isChecked
                      ? 'bg-emerald-50/50 border-emerald-200 opacity-80'
                      : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 shrink-0 text-emerald-600 focus:outline-none"
                    aria-label={isChecked ? "Belgilangan" : "Belgilash"}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                    )}
                  </button>

                  <div className="space-y-0.5">
                    <h4 className={`font-heading font-bold text-sm ${
                      isChecked ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}>
                      {st.title}
                    </h4>
                    <p className={`text-xs sm:text-sm font-sans leading-relaxed ${
                      isChecked ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {st.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Senior Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={handleStartOver}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 text-slate-700 font-heading font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Yangi matn kiritish (Xotirani tozalash)</span>
        </button>

        <div className="grid grid-cols-2 sm:flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 sm:px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <FileDown className="w-4 h-4 shrink-0" />
            <span className="truncate">Hisobot (PDF)</span>
          </button>

          <Link
            to="/resources"
            className="px-4 sm:px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 sm:gap-2 shadow-xs transition-colors"
          >
            <span className="truncate">Yordam Markazlari</span>
            <ChevronRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>
      </div>

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        result={result}
      />
    </div>
  );
}
