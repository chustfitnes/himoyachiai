import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { requestRiskAssessment } from '../services/api';
import { ShieldCheck, HelpCircle, X, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const QUESTIONS = [
  {
    id: 'q1',
    text: "Sizga nisbatan yaqin vaqt ichida jismoniy tajovuz, qo'l ko'tarish yoki jarohat yetkazish holati bo'ldimi?",
    chip: "Kaltaklash",
    weight: 'red',
  },
  {
    id: 'q2',
    text: "Sizga o'ldirish, bo'g'ish, pichoq yoki og'ir jarohat yetkazish bilan to'g'ridan-to'g'ri tahdid qilindimi?",
    chip: "Tahdid",
    weight: 'red',
  },
  {
    id: 'q3',
    text: "Taksida yoki yo'lda mashinadan tushirmaslik, eshikni qulflab olish yoki begona shaxs ta'qibi kuzatilyaptimi?",
    chip: "Taksi yoki yo'lda bezovta qilish",
    weight: 'red',
  },
  {
    id: 'q4',
    text: "Shaxsiy suratlaringizni tarqatish bilan pul talab qilish (shantaj) yoki pasport/telefoningizni olib qo'yish bormi?",
    chip: "Rasmlarimni tarqatish bilan qo'rqitish (shantaj)",
    weight: 'yellow',
  },
  {
    id: 'q5',
    text: "Ushbu xavfli holat voyaga yetmagan yosh bolaga yoki o'quvchi qizga nisbatan sodir bo'lyaptimi?",
    chip: "Bolani yoki qizchani aldash, yo'ldan ozdirish",
    weight: 'red',
  },
];

export default function QuickScreenerModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { setResult, setIsLoading, isLoading, setInputText, setSelectedChips } = useAssessment();
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (qId, val) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / QUESTIONS.length) * 100);

  const handleSubmit = async () => {
    setLoading(true);
    setIsLoading(true);

    const affirmativeQuestions = QUESTIONS.filter((q) => answers[q.id] === true);
    const chips = affirmativeQuestions.map((q) => q.chip);
    const constructedText = affirmativeQuestions.length > 0
      ? affirmativeQuestions.map((q) => q.text).join(' ')
      : "Holat yuzasidan 1 daqiqalik ekspress test topshirildi, jiddiy xavf belgilari inkor etildi.";

    setSelectedChips(chips);
    setInputText(constructedText);

    try {
      const assessmentData = await requestRiskAssessment(constructedText, chips);
      setResult(assessmentData);
      onClose();
      navigate('/result');
    } catch {
      // fallback
    } finally {
      setLoading(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900">
      <div className="w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-slate-900 text-base">
                1 Daqiqalik Tezkor Test
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                Matn yozmasdan xavf darajasini darhol aniqlang
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-mono font-bold text-slate-600">
            <span>Javob berildi:</span>
            <span>{answeredCount} / {QUESTIONS.length} ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-3.5">
          {QUESTIONS.map((q, idx) => {
            const currentAns = answers[q.id];
            return (
              <div key={q.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <p className="text-xs sm:text-sm font-sans font-medium text-slate-800 leading-snug">
                  <span className="font-heading font-bold text-slate-900 mr-1.5">{idx + 1}.</span>
                  {q.text}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelect(q.id, true)}
                    className={`flex-1 py-2 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                      currentAns === true
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Ha, bor
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelect(q.id, false)}
                    className={`flex-1 py-2 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                      currentAns === false
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Yo‘q, bo‘lmagan
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="button"
            disabled={answeredCount === 0 || loading}
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Natija tayyorlanmoqda...</span>
              </>
            ) : (
              <>
                <span>Xavf Darajasini Aniqlash ({answeredCount}/{QUESTIONS.length})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
