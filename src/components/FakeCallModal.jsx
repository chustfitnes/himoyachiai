import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, PhoneCall, Volume2, User, Clock, CheckCircle2, X } from 'lucide-react';

const CALLER_PRESETS = [
  { id: 'mom', name: 'Onam ❤️', subtitle: 'Mobil qo‘ng‘iroq', script: "Alo, qizim qayerdasan? Men pastda kutib turibman, tezroq chiq, do'kondan narsa olishimiz kerak edi!" },
  { id: 'friend', name: 'Dugonam (Madina)', subtitle: 'Telegram audio', script: "Salom! Yetib keldingmi? Seni kutib o'tiribmiz, tezroq kel, hamma shu yerda!" },
  { id: 'taxi', name: 'Taksi Haydovchisi', subtitle: 'Yandex Go', script: "Assalomu alaykum, manzilga yetib keldim, oq Chevrolet Gentra 01 A 777 BA, kutmoqdaman." },
  { id: 'work', name: 'Ishxona / Rahbar', subtitle: 'Favqulodda vazifa', script: "Assalomu alaykum, shoshilinch hisobot bo'yicha darhol kompyuterni ochishingiz kerak." },
];

export default function FakeCallModal({ isOpen, onClose }) {
  const [caller, setCaller] = useState(CALLER_PRESETS[0]);
  const [callState, setCallState] = useState('config'); // 'config' | 'countdown' | 'ringing' | 'connected'
  const [countdownSec, setCountdownSec] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);

  // Play realistic phone ringtone via Web Audio API
  const playRingtone = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      let isRinging = true;
      const ringInterval = setInterval(() => {
        if (!audioContextRef.current) {
          clearInterval(ringInterval);
          return;
        }
        isRinging = !isRinging;
        gain.gain.setValueAtTime(isRinging ? 0.1 : 0, ctx.currentTime);
      }, 1000);

      return () => {
        clearInterval(ringInterval);
        try { osc.stop(); } catch {}
      };
    } catch {}
  };

  const stopRingtone = () => {
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
  };

  const startCallTrigger = (delaySeconds) => {
    if (delaySeconds === 0) {
      setCallState('ringing');
      playRingtone();
    } else {
      setCountdownSec(delaySeconds);
      setCallState('countdown');
    }
  };

  useEffect(() => {
    if (callState === 'countdown' && countdownSec > 0) {
      timerRef.current = setTimeout(() => {
        setCountdownSec((prev) => prev - 1);
      }, 1000);
    } else if (callState === 'countdown' && countdownSec === 0) {
      setCallState('ringing');
      playRingtone();
    }
    return () => clearTimeout(timerRef.current);
  }, [callState, countdownSec]);

  useEffect(() => {
    let durationInterval;
    if (callState === 'connected') {
      durationInterval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(caller.script);
        utterance.lang = 'uz-UZ';
        utterance.rate = 0.95;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      setCallDuration(0);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => clearInterval(durationInterval);
  }, [callState, caller.script]);

  const handleAccept = () => {
    stopRingtone();
    setCallState('connected');
  };

  const handleDecline = () => {
    stopRingtone();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setCallState('config');
    onClose();
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-900">
      
      {/* 1. Configuration Screen (Clean Light Modal) */}
      {callState === 'config' && (
        <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-base">
                  Soxta Kiruvchi Qo‘ng‘iroq
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  Noqulay vaziyatdan xushmuomala qochish vositasi
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-heading font-bold text-slate-600 uppercase tracking-wider block">
              Kim qo‘ng‘iroq qilsin?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CALLER_PRESETS.map((p) => {
                const isSelected = caller.id === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setCaller(p)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-heading font-bold text-sm">
                      <User className="w-4 h-4 text-emerald-600" />
                      <span>{p.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      {p.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trigger Delays */}
          <div className="space-y-2">
            <label className="text-xs font-heading font-bold text-slate-600 uppercase tracking-wider block">
              Qachon jiringlasin?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => startCallTrigger(0)}
                className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-xs transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Darhol</span>
              </button>

              <button
                type="button"
                onClick={() => startCallTrigger(10)}
                className="py-3 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-heading font-semibold text-xs flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Clock className="w-4 h-4 text-slate-500" />
                <span>10 soniyadan so‘ng</span>
              </button>

              <button
                type="button"
                onClick={() => startCallTrigger(30)}
                className="py-3 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-heading font-semibold text-xs flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Clock className="w-4 h-4 text-slate-500" />
                <span>30 soniyadan so‘ng</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center leading-relaxed">
            Qo‘ng‘iroq vaqtida telefoningiz real qo‘ng‘iroq kabi jiringlaydi va ovozli suhbat simulyatsiya qilinadi.
          </p>
        </div>
      )}

      {/* 2. Countdown Waiting State */}
      {callState === 'countdown' && (
        <div className="w-full max-w-sm bg-white rounded-2xl p-8 text-center space-y-6 shadow-2xl border border-slate-200">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 mx-auto flex items-center justify-center animate-pulse">
            <Clock className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-heading font-bold text-xl text-slate-900">
              Taymer ishga tushdi
            </h3>
            <p className="text-4xl font-mono font-extrabold text-amber-600">
              {countdownSec}s
            </p>
            <p className="text-xs text-slate-500">
              {caller.name} sizga bir necha soniyadan so‘ng qo‘ng‘iroq qiladi. Telefonni tayyorlab turing.
            </p>
          </div>
          <button
            onClick={() => setCallState('config')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-heading font-semibold transition-colors cursor-pointer"
          >
            Bekor qilish
          </button>
        </div>
      )}

      {/* 3. Realistic Smartphone Incoming Call Screen */}
      {(callState === 'ringing' || callState === 'connected') && (
        <div className="w-full max-w-sm h-[620px] bg-slate-950 rounded-[44px] p-8 flex flex-col justify-between text-white shadow-2xl border-4 border-slate-800 relative overflow-hidden">
          
          {/* Top Notch / Dynamic Island */}
          <div className="w-28 h-5 bg-black rounded-full mx-auto" />

          {/* Caller Details */}
          <div className="text-center space-y-3 pt-6">
            <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 mx-auto flex items-center justify-center text-3xl shadow-lg">
              {caller.id === 'mom' ? '❤️' : caller.id === 'taxi' ? '🚖' : caller.id === 'work' ? '💼' : '👩'}
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-white tracking-tight">
                {caller.name}
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                {callState === 'connected' ? formatTimer(callDuration) : caller.subtitle}
              </p>
            </div>

            {callState === 'connected' && (
              <div className="pt-4 px-4">
                <div className="p-3.5 rounded-2xl bg-white/10 text-xs font-sans italic text-slate-200 leading-relaxed">
                  "{caller.script}"
                </div>
              </div>
            )}
          </div>

          {/* Call Controls */}
          {callState === 'ringing' ? (
            <div className="flex items-center justify-around pb-6">
              {/* Decline Button */}
              <button
                type="button"
                onClick={handleDecline}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                <PhoneOff className="w-7 h-7" />
              </button>

              {/* Accept Button */}
              <button
                type="button"
                onClick={handleAccept}
                className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer animate-bounce"
              >
                <Phone className="w-7 h-7" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center pb-6">
              {/* End Call Button */}
              <button
                type="button"
                onClick={handleDecline}
                className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                <PhoneOff className="w-7 h-7" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
