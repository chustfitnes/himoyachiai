import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { requestRiskAssessment } from '../services/api';
import { Loader2, ArrowRight, Check } from 'lucide-react';

const QUICK_CHIPS = [
  'Tahdid',
  'Pul nazorati',
  'Kaltaklash',
  'Telefon/aloqa nazorati',
  "Yolg'izlantirish",
];

export default function Describe() {
  const navigate = useNavigate();
  const {
    inputText,
    setInputText,
    selectedChips,
    setSelectedChips,
    setResult,
    isLoading,
    setIsLoading,
    error,
    setError,
  } = useAssessment();

  const [validationMsg, setValidationMsg] = useState('');

  const toggleChip = (chip) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    if (validationMsg) setValidationMsg('');
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmed = inputText.trim();
    if (!trimmed && selectedChips.length === 0) {
      setValidationMsg("Iltimos, nima sodir bo'layotganini yozing yoki kamida bitta toifani tanlang.");
      return;
    }

    if (trimmed && trimmed.length < 5 && selectedChips.length === 0) {
      setValidationMsg("Iltimos, vaziyatingizni biroz batafsilroq yozing (kamida 5 ta belgi).");
      return;
    }

    setIsLoading(true);
    setError(null);
    setValidationMsg('');

    try {
      const assessmentData = await requestRiskAssessment(trimmed, selectedChips);
      setResult(assessmentData);
      navigate('/result');
    } catch (err) {
      setError("Tahlil jarayonida kutilmagan xato yuz berdi. Iltimos, qayta urinib ko'ring yoki to'g'ridan-to'g'ri 1146 ga bog'laning.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-4 sm:py-8">
      {/* Calm Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-ink-primary-light dark:text-ink-primary-dark tracking-tight">
          Vaziyatingizni tasvirlang
        </h1>
        <p className="text-sm text-ink-secondary-light dark:text-ink-secondary-dark mt-1 font-sans">
          Hech qanday ma'lumot saqlanmaydi. O'zbek yoki rus tilida, lotin yoki kirill alifbosida yoza olasiz.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Optional Quick-Select Chips */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted-light dark:text-ink-muted-dark mb-2.5">
            Holatingizga xos belgilar (ixtiyoriy):
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_CHIPS.map((chip) => {
              const isSelected = selectedChips.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => toggleChip(chip)}
                  disabled={isLoading}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm rounded-xl font-medium border transition-all min-h-[44px] ${
                    isSelected
                      ? 'bg-brand-50 border-brand-500 text-brand-700 dark:bg-brand-900/40 dark:border-brand-500 dark:text-brand-200'
                      : 'bg-surface-light border-borderSubtle-light text-ink-secondary-light hover:border-brand-200 dark:bg-surface-dark dark:border-borderSubtle-dark dark:text-ink-secondary-dark'
                  }`}
                  aria-pressed={isSelected}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-300" />}
                  <span>{chip}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Large Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="situation-text"
              className="text-xs font-semibold uppercase tracking-wider text-ink-muted-light dark:text-ink-muted-dark"
            >
              Nima sodir bo'layotganini o'z so'zlaringiz bilan yozing:
            </label>
            <span className="text-[11px] text-ink-muted-light dark:text-ink-muted-dark font-mono">
              {inputText.length} / 2000
            </span>
          </div>

          <div className="relative">
            <textarea
              id="situation-text"
              rows={7}
              value={inputText}
              onChange={handleTextChange}
              disabled={isLoading}
              maxLength={2000}
              placeholder="Masalan: Uyda doimiy baqir-chaqir, pulimni olib qo'yadi, ko'chaga yoki qarindoshlarimnikiga borishimga ruxsat bermaydi, qo'l ko'tarish bilan tahdid qiladi..."
              className="w-full p-4 text-sm sm:text-base rounded-2xl bg-surface-light border border-borderSubtle-light text-ink-primary-light placeholder:text-ink-muted-light/60 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-colors dark:bg-surface-dark dark:border-borderSubtle-dark dark:text-ink-primary-dark dark:placeholder:text-ink-muted-dark/50 shadow-soft leading-relaxed"
            />
          </div>

          {/* Gentle character hint */}
          <p className="text-xs text-ink-muted-light dark:text-ink-muted-dark mt-2">
            Maslahat: qisqacha bo'lsa ham asosiy holatni yozing. To'g'ri grammatika yoki aniq atamalar shart emas.
          </p>

          {/* Validation Message */}
          {validationMsg && (
            <p className="mt-2 text-xs sm:text-sm text-amber-700 dark:text-amber-300 font-medium bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-2.5 rounded-xl">
              {validationMsg}
            </p>
          )}

          {/* Error Message */}
          {error && (
            <p className="mt-2 text-xs sm:text-sm text-red-700 dark:text-red-300 font-medium bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 p-2.5 rounded-xl">
              {error}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-medium text-base rounded-2xl shadow-soft transition-all transform active:scale-[0.99] focus:ring-4 focus:ring-brand-500/30 focus:outline-none min-h-[48px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Vaziyatingiz tahlil qilinmoqda, sabr qiling...</span>
              </>
            ) : (
              <>
                <span>Tahlil qilish</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
