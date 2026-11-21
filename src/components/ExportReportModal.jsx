import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FileText, Printer, Copy, Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function ExportReportModal({ isOpen, onClose, result }) {
  const [copied, setCopied] = useState(false);

  // Senior Level: Lock body scroll to prevent background jitter
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Senior Level: Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !result) return null;

  const level = result.risk_level || result.level || 'green';
  const risk_percent = result.confidence_pct ?? result.risk_percent ?? 90;
  const summary = result.playbook?.action_summary || result.summary || "Vaziyatingiz bo‘yicha vakolatli xizmatlarga murojaat qilish tavsiya etiladi.";
  const signs = result.signals || result.signs || [];
  const next_steps = result.playbook?.steps 
    ? result.playbook.steps.map(s => `${s.title}: ${s.desc}`) 
    : (result.next_steps || []);

  const currentDate = new Date().toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const levelText =
    level === 'red'
      ? 'YUQORI XAVF (QIZIL)'
      : level === 'yellow'
      ? "O'RTA XAVF (SARIQ)"
      : 'PAST XAVF (YASHIL)';

  const formattedReportText = `================================================
HIMOYA-AI: ANONIM XAVFSIZLIK VA VAZIYATNI BAHOLASH BAYONNOMASI
Sana: ${currentDate}
Xavf darajasi: ${levelText} (${risk_percent}%)
================================================

VAZIYAT XULOSASI:
${summary}

ANIQLANGAN XAVF BELGILARI:
${signs.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

TAVSIYA ETILGAN TEZKOR QADAMLAR:
${next_steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')}

RASMIY ISHONCH RAQAMLARI:
- 1146: Ayollar va bolalar ishonch telefoni (24/7, bepul)
- 102: Ichki ishlar organi (favqulodda xavfda)
- 1102: IIV Kiberxavfsizlik markazi (shaxsiy rasmlar bilan shantaj)
- 1008: "Madad" bepul professional yuridik yordami

Eslatma: Ushbu xulosa dastlabki baholash bo'lib, profilaktika inspektori yoki "Inson" markaziga murojaat qilishda asos sifatida foydalanilishi mumkin.
================================================`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedReportText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="report-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in text-slate-900 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto my-auto ring-1 ring-black/5"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 id="report-modal-title" className="text-base sm:text-lg font-heading font-bold text-slate-900">
                Xavfsizlik Bayonnomasi
              </h2>
              <span className="text-[11px] text-slate-500 font-sans">
                Dalil va rasmiy idoralar uchun rasmiy xulosa
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Card Area */}
        <div id="printable-report" className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs sm:text-sm">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
            <span className="font-heading font-bold text-slate-900">
              HimoyaAI Baholash Xulosasi
            </span>
            <span className="text-[11px] text-slate-500 font-mono">
              {currentDate}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">
              Daraja:
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-heading font-bold ${
                level === 'red'
                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                  : level === 'yellow'
                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              {levelText} — {risk_percent}%
            </span>
          </div>

          <div>
            <span className="font-heading font-bold text-slate-900 block mb-1">
              Xulosa:
            </span>
            <p className="text-slate-700 font-sans leading-relaxed">
              {summary}
            </p>
          </div>

          {signs.length > 0 && (
            <div>
              <span className="font-heading font-bold text-slate-900 block mb-1">
                Aniqlangan belgilar:
              </span>
              <ul className="list-disc pl-4 space-y-1 text-slate-700 font-sans">
                {signs.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 font-sans leading-relaxed">
            Ushbu hisobot xolis avtomatik tahlil bo‘lib, ichki ishlar xodimiga yoki «Inson» markazi mutaxassisiga vaziyatni tezkor tushuntirish uchun mo‘ljallangan.
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 mt-5">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-heading font-semibold transition-all shadow-xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Nusxa olindi!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Nusxa olish</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-heading font-bold shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Chop etish / PDF</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
