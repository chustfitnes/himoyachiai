import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import { requestRiskAssessment } from '../services/api';
import VoiceInput from '../components/VoiceInput';
import QuickScreenerModal from '../components/QuickScreenerModal';
import { 
  Loader2, 
  ArrowRight, 
  Check, 
  Sparkles, 
  HelpCircle, 
  Baby, 
  ShieldCheck, 
  AlertTriangle,
  Lock,
  Terminal,
  Zap,
  RotateCcw,
  Volume2
} from 'lucide-react';

const FAMILY_CHIPS = [
  'Tahdid',
  'Pul nazorati',
  'Kaltaklash',
  'Telefon/aloqa nazorati',
  "Yolg'izlantirish",
];

const PUBLIC_ONLINE_CHIPS = [
  "Taksi yoki yo'lda bezovta qilish",
  "Orqamdan ergashish, kuzatish",
  "Rasmlarimni tarqatish bilan qo'rqitish (shantaj)",
  "Internetda tahdid yoki tovlamachilik",
  "Bolani yoki qizchani aldash, yo'ldan ozdirish",
  "Ish yoki o'qish joyida bosim",
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
    t,
  } = useAssessment();

  const [validationMsg, setValidationMsg] = useState('');
  const [streamPhase, setStreamPhase] = useState('');
  const [isScreenerOpen, setIsScreenerOpen] = useState(false);
  const [isChildMode, setIsChildMode] = useState(false);

  const toggleChip = (chip) => {
    setSelectedChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleVoiceTranscript = (transcriptText) => {
    setInputText((prev) => (prev ? `${prev} ${transcriptText}` : transcriptText));
    if (validationMsg) setValidationMsg('');
    if (error) setError(null);
  };

  const handleTextChange = (e) => {
    setInputText(e.target.value);
    if (validationMsg) setValidationMsg('');
    if (error) setError(null);
  };

  // Clinical / Legal Demo Presets for Rapid Evaluation
  const setDemoSample = (type) => {
    if (type === 'green') {
      setInputText("Bugun ishda va oilada juda qattiq charchadim, o‘zimni yolg‘iz va tushkun his qilyapman.");
      setSelectedChips([]);
    } else if (type === 'yellow') {
      setInputText("Erim pulimni tortib oladi, hech qayerga chiqarmaydi, telefonimni tekshirib doim haqorat qiladi.");
      setSelectedChips(["Pul nazorati", "Telefon/aloqa nazorati"]);
    } else if (type === 'red') {
      setInputText("Erim pichoq bilan tashlanib, o‘ldiraman deb bo‘g‘di, hozir xonada qulflanib o‘tiribman!");
      setSelectedChips(["Tahdid", "Kaltaklash"]);
    }
    if (validationMsg) setValidationMsg('');
    if (error) setError(null);
  };

  const clearForm = () => {
    setInputText('');
    setSelectedChips([]);
    setValidationMsg('');
    setError(null);
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
    setStreamPhase("Huquqiy mezonlar va xavfsizlik filtrlari tahlil qilinmoqda...");

    try {
      const assessmentData = await requestRiskAssessment(
        trimmed,
        selectedChips,
        (phaseText) => setStreamPhase(phaseText)
      );
      setResult(assessmentData);
      navigate('/result');
    } catch {
      setError("Tahlil jarayonida kutilmagan xato yuz berdi. Iltimos, qayta urinib ko'ring yoki to'g'ridan-to'g'ri 1146 ga bog'laning.");
    } finally {
      setIsLoading(false);
      setStreamPhase('');
    }
  };

  return (
    <div className="py-4 sm:py-8 max-w-4xl mx-auto space-y-6 animate-fade-in text-slate-900">
      
      {/* Clean Institutional Stepper Bar */}
      <div className="flex items-center justify-between px-2 text-xs font-heading font-bold text-slate-400">
        <div className="flex items-center gap-2 text-slate-900">
          <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] font-mono">1</span>
          <span>{t('step_1')}</span>
        </div>
        <div className="h-0.5 flex-1 mx-4 bg-slate-200" />
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[11px] font-mono">2</span>
          <span>{t('step_2')}</span>
        </div>
        <div className="h-0.5 flex-1 mx-4 bg-slate-200" />
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[11px] font-mono">3</span>
          <span>{t('step_3')}</span>
        </div>
      </div>

      {/* Header Card */}
      <div className="card-senior p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-slate-100 text-slate-800 border border-slate-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{t('describe_badge')}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight text-slate-950">
              {isChildMode ? t('describe_title_child') : t('describe_title')}
            </h1>
            <p className="text-xs sm:text-sm font-sans text-slate-600 mt-1 max-w-xl leading-relaxed">
              {isChildMode 
                ? t('describe_subtitle_child')
                : t('describe_subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Child Mode Switcher */}
            <button
              type="button"
              onClick={() => setIsChildMode(!isChildMode)}
              className={`px-3.5 py-2 rounded-xl text-xs font-heading font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                isChildMode
                  ? 'bg-amber-100 text-amber-950 border-amber-300 font-bold'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Baby className="w-4 h-4 text-amber-700" />
              <span>{isChildMode ? t('btn_child_mode_on') : t('btn_child_mode_off')}</span>
            </button>

            {/* Quick Screener Link */}
            <button
              type="button"
              onClick={() => setIsScreenerOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-heading font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <HelpCircle className="w-4 h-4 text-slate-600" />
              <span>{t('btn_screener')}</span>
            </button>
          </div>
        </div>

        {/* Discreet Scenario Presets (For rapid reference) */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-slate-400">
            Tezkor namunaviy misollar:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setDemoSample('green')}
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-sans transition-colors cursor-pointer"
            >
              1. Hissiy zo‘riqish
            </button>
            <button
              type="button"
              onClick={() => setDemoSample('yellow')}
              className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-sans transition-colors cursor-pointer"
            >
              2. Tazyiq va nazorat
            </button>
            <button
              type="button"
              onClick={() => setDemoSample('red')}
              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-sans font-medium transition-colors cursor-pointer"
            >
              3. Jismoniy xavf
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Categorized Chips Cloud */}
        <div className="card-senior p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <span className="block text-xs font-heading font-bold uppercase tracking-wider text-slate-800">
              Holatga oid belgilar (tegishlisini tanlang):
            </span>
            {selectedChips.length > 0 && (
              <span className="text-xs font-mono text-emerald-800 font-semibold">
                Tanlandi: {selectedChips.length} ta
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Group 1: Family */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-heading font-bold text-slate-900 block">
                Oila va yaqinlar doirasida
              </span>
              <div className="flex flex-wrap gap-2">
                {FAMILY_CHIPS.map((chip) => {
                  const isSelected = selectedChips.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleChip(chip)}
                      className={`px-3 py-1.5 text-xs rounded-lg font-heading font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                      <span>{chip}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Group 2: Public / Online */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <span className="text-xs font-heading font-bold text-slate-900 block">
                Jamoat joylari, transport va raqamli makon
              </span>
              <div className="flex flex-wrap gap-2">
                {PUBLIC_ONLINE_CHIPS.map((chip) => {
                  const isSelected = selectedChips.includes(chip);
                  return (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => toggleChip(chip)}
                      className={`px-3 py-1.5 text-xs rounded-lg font-heading font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 text-emerald-400" />}
                      <span>{chip}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Text Area & Voice Input Hub */}
        <div className="card-senior p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-heading font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-700" />
              <span>{t('textarea_label')}</span>
            </label>
            <div className="flex items-center gap-2">
              {inputText && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                  title="Matnni tozalash"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Tozalash</span>
                </button>
              )}
              <VoiceInput onTranscript={handleVoiceTranscript} disabled={isLoading} />
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={6}
              value={inputText}
              onChange={handleTextChange}
              disabled={isLoading}
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              placeholder={
                isChildMode
                  ? t('textarea_placeholder_child')
                  : t('textarea_placeholder')
              }
              className="w-full p-4 sm:p-5 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:border-slate-800 focus:ring-4 focus:ring-slate-900/10 outline-none leading-relaxed transition-all font-sans bg-white shadow-xs"
            />
            
            {/* Character count counter */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1.5 px-1">
              <span>{t('char_min_hint')}</span>
              <span>{inputText.length} belgi</span>
            </div>
          </div>

          {validationMsg && (
            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{validationMsg}</span>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-bold text-rose-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Privacy Guarantee Note */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-sans">
            <ShieldCheck className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
            <p>
              <strong>{t('privacy_banner_title')}</strong> {t('privacy_banner_desc')}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2.5 transform active:scale-[0.99] disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
              <span>{streamPhase || t('btn_analyzing')}</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>{t('btn_analyze_submit')}</span>
              <ArrowRight className="w-5 h-5 ml-1 text-slate-400" />
            </>
          )}
        </button>
      </form>

      <QuickScreenerModal isOpen={isScreenerOpen} onClose={() => setIsScreenerOpen(false)} />
    </div>
  );
}
