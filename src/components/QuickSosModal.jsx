import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertCircle, MapPin, Send, Copy, Check, X, Phone, Loader2, Share2, ShieldAlert } from 'lucide-react';

export default function QuickSosModal({ isOpen, onClose }) {
  const [coords, setCoords] = useState(null);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [locError, setLocError] = useState('');
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

  if (!isOpen) return null;

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocError("Qurilmangiz geolokatsiyani qo'llab-quvvatlamaydi.");
      return;
    }

    setLoadingLoc(true);
    setLocError('');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
        });
        setLoadingLoc(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLocError("Joylashuvni aniqlashga ruxsat berilmadi yoki xato yuz berdi.");
        setLoadingLoc(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const mapsUrl = coords
    ? `https://maps.google.com/?q=${coords.lat},${coords.lng}`
    : '';

  const sosMessage = coords
    ? `Menga shoshilinch yordam kerak! Joylashuvim: ${mapsUrl} Iltimos, darhol 102 yoki 1146 ga xabar bering!`
    : `Menga shoshilinch yordam kerak! Iltimos, darhol 102 yoki 1146 ga xabar bering!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sosMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const smsLink = `sms:?body=${encodeURIComponent(sosMessage)}`;
  const telegramShareLink = `https://t.me/share/url?url=${encodeURIComponent(mapsUrl || 'Xavfsiz joyda emasman')}&text=${encodeURIComponent(sosMessage)}`;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-fade-in text-slate-900 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-auto ring-1 ring-black/5"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 id="sos-modal-title" className="font-heading font-bold text-slate-900 text-base">
                Tezkor SOS Signal
              </h3>
              <p className="text-xs text-slate-500 font-sans">
                1-bosishda lokatsiya va xabar tayyorlash
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

        {/* Location fetching */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-heading font-bold text-slate-700 uppercase tracking-wider">
              Jonli Joylashuv (GPS):
            </span>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={loadingLoc}
              className="text-xs font-heading font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{loadingLoc ? "Aniqlanmoqda..." : coords ? "Yangilash" : "Koordinatani olish"}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-mono text-slate-700">
            {coords ? (
              <span className="text-emerald-700 font-bold">
                ✓ Joylashuv: {coords.lat}, {coords.lng}
              </span>
            ) : (
              <span className="text-slate-500">
                Koordinata olinmagan (ixtiyoriy). Tugmani bossangiz aniq xarita havolasi qo‘shiladi.
              </span>
            )}
          </div>
          {locError && <p className="text-xs text-rose-600 font-medium">{locError}</p>}
        </div>

        {/* SOS Message Preview */}
        <div className="space-y-1.5">
          <label className="text-xs font-heading font-bold text-slate-700 uppercase tracking-wider block">
            Yuboriladigan xabar matni:
          </label>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-sans text-slate-800 leading-relaxed">
            {sosMessage}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href={smsLink}
            className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Send className="w-4 h-4" />
            <span>SMS yuborish</span>
          </a>

          <a
            href={telegramShareLink}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Telegramga</span>
          </a>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? "Nusxalandi!" : "Matnni nusxalash"}</span>
        </button>

        {/* Direct Call Bar */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
          <a
            href="tel:102"
            className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>102 (IIB)</span>
          </a>

          <a
            href="tel:1146"
            className="py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>1146 (Ishonch)</span>
          </a>
        </div>
      </div>
    </div>,
    document.body
  );
}
