import React, { useState, useEffect, useRef } from 'react';
import { 
  IoCall, 
  IoMic, 
  IoMicOff, 
  IoKeypad, 
  IoVolumeHigh, 
  IoVolumeMute, 
  IoPersonAdd, 
  IoVideocam, 
  IoPeople, 
  IoAlarm, 
  IoChatbubbleEllipses, 
  IoClose,
  IoHeart, 
  IoCarSport, 
  IoBriefcase, 
  IoPerson, 
  IoShieldCheckmark,
  IoFlash,
  IoCheckmarkCircle,
  IoPlay,
  IoChevronDown
} from 'react-icons/io5';
import { MdCallEnd, MdPhoneInTalk } from 'react-icons/md';

const CALLER_PRESETS = [
  { 
    id: 'mom', 
    name: 'Onam ❤️', 
    number: '+998 (90) 845-21-14',
    subtitle: 'uyali aloqa', 
    badge: 'Mobil',
    icon: IoHeart,
    avatarBg: 'from-rose-500 to-pink-600',
    gender: 'female',
    script: "Alo, qizim qayerdasan? Men pastda kutib turibman, tezroq chiq, uyga borishimiz kerak!",
    replyHint: "«Xo'p oyi, 2 daqiqada tushyapman, eshik oldiga chiqing» deb ayting."
  },
  { 
    id: 'dad', 
    name: 'Dadam', 
    number: '+998 (97) 765-43-21',
    subtitle: 'uyali aloqa', 
    badge: 'Oila',
    icon: IoShieldCheckmark,
    avatarBg: 'from-emerald-600 to-teal-700',
    gender: 'male',
    script: "Alo, qizim, qayerdasan? Mashinada yetib kelyapman, 2 daqiqada yo'l chetiga chiq, olib ketaman.",
    replyHint: "«Dadam olib ketgani keldilar, men ketishim kerak» deb ayting."
  },
  { 
    id: 'friend', 
    name: 'Dugonam (Madina)', 
    number: '+998 (93) 312-90-45',
    subtitle: 'Telegram Audio', 
    badge: 'Telegram',
    icon: IoPerson,
    avatarBg: 'from-indigo-500 to-purple-600',
    gender: 'female',
    script: "Salom! Yetib keldingmi? Seni kafeda hamma kutib o'tiribdi, tezroq kel, hamma shu yerda!",
    replyHint: "«Hozir yetib boraman, taksidan tushyapman» deb ayting."
  },
  { 
    id: 'taxi', 
    name: 'Taksi Haydovchisi', 
    number: '+998 (71) 200-00-11',
    subtitle: 'Yandex Go', 
    badge: 'Yandex Go',
    icon: IoCarSport,
    avatarBg: 'from-amber-500 to-yellow-600',
    gender: 'male',
    script: "Assalomu alaykum, manzilga yetib keldim, oq Chevrolet Gentra 01 A 777 BA, sizni kutmoqdaman.",
    replyHint: "«Rahmat, hozir chiqaman» deb joyni darhol tark eting."
  },
  { 
    id: 'work', 
    name: 'Ishxona / Rahbar', 
    number: '+998 (78) 150-20-30',
    subtitle: 'shoshilinch vazifa', 
    badge: 'Ishxona',
    icon: IoBriefcase,
    avatarBg: 'from-blue-600 to-cyan-700',
    gender: 'male',
    script: "Assalomu alaykum, shoshilinch hisobot bo'yicha darhol kompyuterni ochishingiz kerak, tekshiruv ketyapti.",
    replyHint: "«Hozir yetib boraman, shoshilinch ishim chiqib qoldi» deb ketishingiz mumkin."
  },
  { 
    id: 'sos', 
    name: 'Tezkor Yordam 1146', 
    number: '1146',
    subtitle: 'Favqulodda aloqa', 
    badge: 'Davlat',
    icon: IoFlash,
    avatarBg: 'from-rose-600 to-red-700',
    gender: 'female',
    script: "Assalomu alaykum, 1146 ishonch tarmog'i operatori. Xavfsiz joyga o'ting, sizga yordam yo'naltirildi.",
    replyHint: "«Tushundim, darhol xavfsiz joyga o'tyapman» deb ayting."
  }
];

// Realistic DTMF dual-tone frequencies for keypad
const DTMF_FREQS = {
  '1': [697, 1209], '2': [697, 1336], '3': [697, 1477],
  '4': [770, 1209], '5': [770, 1336], '6': [770, 1477],
  '7': [852, 1209], '8': [852, 1336], '9': [852, 1477],
  '*': [941, 1209], '0': [941, 1336], '#': [941, 1477]
};

const KEYPAD_ROWS = [
  [{ num: '1', sub: '' }, { num: '2', sub: 'ABC' }, { num: '3', sub: 'DEF' }],
  [{ num: '4', sub: 'GHI' }, { num: '5', sub: 'JKL' }, { num: '6', sub: 'MNO' }],
  [{ num: '7', sub: 'PQRS' }, { num: '8', sub: 'TUV' }, { num: '9', sub: 'WXYZ' }],
  [{ num: '*', sub: '' }, { num: '0', sub: '+' }, { num: '#', sub: '' }]
];

export default function FakeCallModal({ isOpen, onClose }) {
  const [caller, setCaller] = useState(CALLER_PRESETS[0]);
  const [callState, setCallState] = useState('config'); // 'config' | 'countdown' | 'ringing' | 'connected'
  const [selectedDelay, setSelectedDelay] = useState(0);
  const [countdownSec, setCountdownSec] = useState(0);
  const [callDuration, setCallDuration] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showPrompter, setShowPrompter] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  const timerRef = useRef(null);
  const audioContextRef = useRef(null);

  // Update live clock for status bar
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio API Acoustic Marimba Ringtone
  const startRealisticRingtone = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      let isPlaying = true;
      const notes = [
        { f: 659.25, d: 0.14 },
        { f: 830.61, d: 0.14 },
        { f: 987.77, d: 0.14 },
        { f: 1318.51, d: 0.18 },
        { f: 987.77, d: 0.14 },
        { f: 1318.51, d: 0.28 },
      ];

      const playPhrase = () => {
        if (!isPlaying || ctx.state === 'closed') return;
        const now = ctx.currentTime;
        notes.forEach((n, idx) => {
          const t = now + idx * 0.14;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(n.f, t);

          gain.gain.setValueAtTime(0.24, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + n.d + 0.15);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t);
          osc.stop(t + n.d + 0.15);
        });
      };

      playPhrase();
      const interval = setInterval(() => {
        if (!isPlaying || !audioContextRef.current) {
          clearInterval(interval);
          return;
        }
        playPhrase();
      }, 2300);

      if ('vibrate' in navigator) {
        try {
          navigator.vibrate([400, 200, 400, 200, 400, 1000]);
        } catch {}
      }

      return () => {
        isPlaying = false;
        clearInterval(interval);
        try { ctx.close(); } catch {}
      };
    } catch {
      return () => {};
    }
  };

  const stopRingtone = () => {
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
  };

  // Play DTMF tone on keypad press
  const playDtmf = (digit) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const freqs = DTMF_FREQS[digit];
      if (!freqs) return;

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = freqs[0];
      osc2.frequency.value = freqs[1];
      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.18);
      osc2.stop(now + 0.18);
    } catch {}
  };

  // Preview synthetic voice
  const previewSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(caller.script);
      utterance.rate = 0.96;
      utterance.pitch = caller.gender === 'female' ? 1.15 : 0.92;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startCallTrigger = (delaySeconds) => {
    if (delaySeconds === 0) {
      setCallState('ringing');
      startRealisticRingtone();
    } else {
      setCountdownSec(delaySeconds);
      setCallState('countdown');
    }
  };

  // Countdown timer
  useEffect(() => {
    if (callState === 'countdown' && countdownSec > 0) {
      timerRef.current = setTimeout(() => {
        setCountdownSec((prev) => prev - 1);
      }, 1000);
    } else if (callState === 'countdown' && countdownSec === 0) {
      setCallState('ringing');
      startRealisticRingtone();
    }
    return () => clearTimeout(timerRef.current);
  }, [callState, countdownSec]);

  // Connected call duration and speech synthesis
  useEffect(() => {
    let durationInterval;
    if (callState === 'connected') {
      durationInterval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(caller.script);
        utterance.rate = 0.96;
        utterance.pitch = caller.gender === 'female' ? 1.15 : 0.92;
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
  }, [callState, caller.script, caller.gender]);

  const handleAccept = () => {
    stopRingtone();
    setCallState('connected');
  };

  const handleDecline = () => {
    stopRingtone();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setCallState('config');
    setShowKeypad(false);
    setShowPrompter(false);
    setIsMuted(false);
    setIsSpeakerOn(false);
    onClose();
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in text-slate-900 select-none">
      
      {/* =========================================================================
          1. CONFIGURATION SCREEN: Senior-Level React-Icons Control Modal
          ========================================================================= */}
      {callState === 'config' && (
        <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200/90 max-h-[95vh] overflow-y-auto">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 shrink-0 text-xl">
                <MdPhoneInTalk />
              </div>
              <div>
                <h3 className="font-heading font-black text-slate-950 text-base sm:text-lg tracking-tight leading-tight">
                  Soxta Kiruvchi Qo‘ng‘iroq
                </h3>
                <p className="text-xs text-slate-500 font-sans mt-0.5">
                  Xavfli yoki noqulay vaziyatdan xushmuomala chiqib ketish
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer text-xl"
              aria-label="Yopish"
            >
              <IoClose />
            </button>
          </div>

          {/* Symmetrical 6-Item Grid */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-heading font-bold text-slate-500 uppercase tracking-wider block">
              Kim qo‘ng‘iroq qilsin? (Profilni tanlang)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {CALLER_PRESETS.map((p) => {
                const isSelected = caller.id === p.id;
                const IconComponent = p.icon;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setCaller(p)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-1 ring-emerald-500/30'
                        : 'border-slate-200/90 bg-white hover:bg-slate-50/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.avatarBg} text-white flex items-center justify-center text-lg shadow-xs shrink-0`}>
                        <IconComponent />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-sm text-slate-900 truncate">
                            {p.name}
                          </span>
                          {isSelected && (
                            <IoCheckmarkCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-1 text-base" />
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono block mt-0.5">
                          {p.number}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trigger Delay Options */}
          <div className="space-y-2.5">
            <label className="text-[11px] font-heading font-bold text-slate-500 uppercase tracking-wider block">
              Qachon jiringlasin? (Taymer)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { sec: 0, label: 'Darhol' },
                { sec: 10, label: '10 soniya' },
                { sec: 30, label: '30 soniya' },
                { sec: 60, label: '1 daqiqa' },
              ].map((item) => (
                <button
                  key={item.sec}
                  type="button"
                  onClick={() => setSelectedDelay(item.sec)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-heading font-semibold transition-all cursor-pointer text-center ${
                    selectedDelay === item.sec
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Spoken Script & Audio Test */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span className="font-heading font-bold text-slate-700">Qo‘ng‘iroqdagi ovozli so‘zlar:</span>
              <button
                type="button"
                onClick={previewSpeech}
                className="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
              >
                <IoPlay className="text-xs" />
                <span>Ovozni sinash</span>
              </button>
            </div>
            <p className="text-xs text-slate-700 italic leading-relaxed">
              "{caller.script}"
            </p>
            <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500">
              <span className="font-bold text-slate-700">Bahona tavsiyasi: </span>
              {caller.replyHint}
            </div>
          </div>

          {/* Launch Primary CTA */}
          <button
            type="button"
            onClick={() => startCallTrigger(selectedDelay)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-[0.99] text-white font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <IoCall className="text-lg" />
            <span>
              {selectedDelay === 0 ? "Qo‘ng‘iroqni hozir boshlash" : `${selectedDelay} soniyadan so‘ng jiringlatish`}
            </span>
          </button>
        </div>
      )}

      {/* =========================================================================
          2. COUNTDOWN WAITING SCREEN
          ========================================================================= */}
      {callState === 'countdown' && (
        <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-center space-y-6 shadow-2xl border border-slate-200">
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-amber-200 animate-ping opacity-25" />
            <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-mono font-black text-3xl shadow-inner">
              {countdownSec}
            </div>
          </div>
          <div className="space-y-1.5">
            <h3 className="font-heading font-extrabold text-xl text-slate-900 tracking-tight">
              Taymer faollashdi
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-800">{caller.name}</strong> sizga {countdownSec} soniyadan so‘ng qo‘ng‘iroq qiladi. Telefoningizni tayyorlab turing.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => startCallTrigger(0)}
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-heading font-bold transition-colors cursor-pointer"
            >
              Hozir jiringlasin
            </button>
            <button
              type="button"
              onClick={() => setCallState('config')}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-heading font-semibold transition-colors cursor-pointer"
            >
              Bekor qilish
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          3 & 4. REALISTIC iPHONE 16 PRO PHONE SCREEN (Ringing & Connected)
          ========================================================================= */}
      {(callState === 'ringing' || callState === 'connected') && (
        <div className="w-full sm:max-w-[380px] h-full sm:h-[730px] max-h-[100vh] sm:max-h-[92vh] bg-gradient-to-b from-slate-900 via-[#0a0f1d] to-black sm:rounded-[52px] sm:border-[10px] sm:border-slate-800/90 shadow-[0_25px_70px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.1)] flex flex-col justify-between p-6 sm:p-7 relative overflow-hidden select-none text-white">
          
          {/* Top Notch / Dynamic Island */}
          <div className="relative z-20 flex flex-col items-center">
            <div className="w-28 h-7 bg-black rounded-full flex items-center justify-between px-3 text-[10px] text-white/50 shadow-inner ring-1 ring-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-slate-700" />
              </div>
              {callState === 'connected' && (
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {formatTimer(callDuration)}
                  </span>
                </div>
              )}
            </div>

            {/* iOS Status Bar */}
            <div className="w-full flex items-center justify-between text-xs text-white/80 font-medium px-2 pt-2">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-xs tracking-tight">{currentTimeStr || '09:45'}</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Cellular 4 bars SVG */}
                <svg className="w-4 h-3 fill-current text-white/90" viewBox="0 0 16 12">
                  <rect x="0" y="9" width="2.5" height="3" rx="0.5" />
                  <rect x="4" y="6" width="2.5" height="6" rx="0.5" />
                  <rect x="8" y="3" width="2.5" height="9" rx="0.5" />
                  <rect x="12" y="0" width="2.5" height="12" rx="0.5" />
                </svg>
                {/* 5G Label */}
                <span className="text-[10px] font-bold font-mono">5G</span>
                {/* Battery SVG */}
                <div className="w-5 h-2.5 border border-white/80 rounded-xs p-0.5 flex items-center">
                  <div className="h-full w-full bg-white rounded-2xs" />
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              RINGING STATE (Realistic iOS Incoming Call with Solid Apple Glyphs)
              ========================================================================= */}
          {callState === 'ringing' && (
            <>
              {/* Caller Identity */}
              <div className="text-center space-y-4 pt-4 my-auto">
                <div className="relative w-28 h-28 sm:w-32 sm:h-32 mx-auto">
                  {/* Subtle pulsing glow rings */}
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-60" />
                  <div className="absolute -inset-2 rounded-full bg-emerald-500/10 animate-pulse" />
                  <div className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br ${caller.avatarBg} border-2 border-white/20 flex items-center justify-center text-4xl sm:text-5xl shadow-2xl text-white`}>
                    <caller.icon />
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-3xl font-heading font-black text-white tracking-tight leading-tight">
                    {caller.name}
                  </h2>
                  <p className="text-sm font-sans text-white/70 tracking-wide">
                    {caller.subtitle}
                  </p>
                  <p className="text-xs font-mono text-white/40 tracking-wider">
                    {caller.number}
                  </p>
                </div>
              </div>

              {/* iOS Middle Action Row */}
              <div className="grid grid-cols-2 gap-8 px-6 pb-6 text-center text-white/80">
                <button
                  type="button"
                  className="flex flex-col items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-xl border border-white/10 flex items-center justify-center text-xl text-white shadow-sm transition-all">
                    <IoAlarm />
                  </div>
                  <span className="text-[11px] font-sans font-medium text-white/80">Eslatish</span>
                </button>

                <button
                  type="button"
                  className="flex flex-col items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 backdrop-blur-xl border border-white/10 flex items-center justify-center text-xl text-white shadow-sm transition-all">
                    <IoChatbubbleEllipses />
                  </div>
                  <span className="text-[11px] font-sans font-medium text-white/80">Xabar</span>
                </button>
              </div>

              {/* Solid Apple CallKit Decline / Accept Buttons */}
              <div className="flex items-center justify-around px-4 pb-4">
                {/* Decline Button (Solid Red with MdCallEnd) */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDecline}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#FF3B30] hover:bg-[#E02D23] active:scale-90 flex items-center justify-center text-white shadow-2xl shadow-rose-900/50 transition-all cursor-pointer"
                    aria-label="Rad etish"
                  >
                    <MdCallEnd className="w-9 h-9 text-white" />
                  </button>
                  <span className="text-xs font-heading font-semibold text-white/90">Rad etish</span>
                </div>

                {/* Accept Button (Solid Green with IoCall) */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={handleAccept}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#34C759] hover:bg-[#2EB84E] active:scale-90 flex items-center justify-center text-white shadow-2xl shadow-emerald-900/50 transition-all cursor-pointer animate-pulse"
                    aria-label="Javob berish"
                  >
                    <IoCall className="w-9 h-9 text-white" />
                  </button>
                  <span className="text-xs font-heading font-semibold text-white/90">Javob berish</span>
                </div>
              </div>
            </>
          )}

          {/* =========================================================================
              CONNECTED STATE (Realistic iOS 6-Button Control Pad with Genuine Glass Circles)
              ========================================================================= */}
          {callState === 'connected' && (
            <>
              {/* Caller Info & Duration Header */}
              <div className="text-center space-y-1 pt-3">
                <h2 className="text-2xl font-heading font-extrabold text-white tracking-tight">
                  {caller.name}
                </h2>
                <p className="text-sm font-mono text-white/70">
                  {formatTimer(callDuration)}
                </p>

                {/* Smart Prompter Pill (Shpargalka) */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowPrompter(!showPrompter)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white/80 text-[11px] font-sans border border-white/10 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{showPrompter ? "Shpargalkani yashirish" : "💡 Nima deyish kerak? (Shpargalka)"}</span>
                    <IoChevronDown className={`text-xs transition-transform ${showPrompter ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Expandable Discreet Prompt */}
                  {showPrompter && (
                    <div className="mt-2 mx-auto max-w-[320px] p-3 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/15 text-left space-y-1.5 animate-fade-in shadow-2xl">
                      <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                        Qo‘ng‘iroqchi aytmoqda:
                      </div>
                      <p className="text-xs text-white/95 leading-relaxed italic">
                        "{caller.script}"
                      </p>
                      <div className="pt-1.5 border-t border-white/10 text-[11px] text-emerald-300">
                        <strong className="text-white">Tavsiya: </strong>
                        {caller.replyHint}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Avatar with speaking wave */}
              <div className="my-auto py-2">
                <div className="relative w-20 h-20 mx-auto">
                  {isSpeaking && (
                    <div className="absolute inset-0 rounded-full border-2 border-emerald-400 animate-ping opacity-75" />
                  )}
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${caller.avatarBg} border-2 border-white/20 flex items-center justify-center text-3xl shadow-xl mx-auto text-white`}>
                    <caller.icon />
                  </div>
                </div>
              </div>

              {/* Real iOS 6-Button In-Call Control Pad OR Keypad */}
              {!showKeypad ? (
                <div className="grid grid-cols-3 gap-y-4 gap-x-2 px-2 pb-6">
                  {/* 1. Mute */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className={`w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full flex items-center justify-center transition-all cursor-pointer text-2xl ${
                        isMuted 
                          ? 'bg-white text-slate-950 shadow-xl scale-105' 
                          : 'bg-white/15 hover:bg-white/25 active:scale-95 text-white backdrop-blur-xl border border-white/10 shadow-sm'
                      }`}
                      aria-label="Mikrofonni o'chirish"
                    >
                      {isMuted ? <IoMicOff /> : <IoMic />}
                    </button>
                    <span className="text-[11px] font-sans font-medium text-white/80">Ovoz</span>
                  </div>

                  {/* 2. Keypad */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowKeypad(true)}
                      className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all cursor-pointer text-2xl shadow-sm"
                      aria-label="Klaviatura"
                    >
                      <IoKeypad />
                    </button>
                    <span className="text-[11px] font-sans font-medium text-white/80">Klaviatura</span>
                  </div>

                  {/* 3. Speaker */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                      className={`w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full flex items-center justify-center transition-all cursor-pointer text-2xl ${
                        isSpeakerOn 
                          ? 'bg-white text-slate-950 shadow-xl scale-105' 
                          : 'bg-white/15 hover:bg-white/25 active:scale-95 text-white backdrop-blur-xl border border-white/10 shadow-sm'
                      }`}
                      aria-label="Dinamik"
                    >
                      {isSpeakerOn ? <IoVolumeHigh /> : <IoVolumeMute />}
                    </button>
                    <span className="text-[11px] font-sans font-medium text-white/80">Dinamik</span>
                  </div>

                  {/* 4. Add Call */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all cursor-pointer text-2xl shadow-sm"
                    >
                      <IoPersonAdd />
                    </button>
                    <span className="text-[11px] font-sans font-medium text-white/80">Qo‘shish</span>
                  </div>

                  {/* 5. FaceTime */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all cursor-pointer text-2xl shadow-sm"
                    >
                      <IoVideocam />
                    </button>
                    <span className="text-[11px] font-sans font-medium text-white/80">FaceTime</span>
                  </div>

                  {/* 6. Contacts */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      className="w-16 h-16 sm:w-[68px] sm:h-[68px] rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all cursor-pointer text-2xl shadow-sm"
                    >
                      <IoPeople />
                    </button>
                    <span className="text-[11px] font-sans font-medium text-white/80">Kontaktlar</span>
                  </div>
                </div>
              ) : (
                /* Authentic iOS In-Call Keypad with DTMF dual-tones */
                <div className="space-y-2 pb-4">
                  <div className="space-y-2 px-6">
                    {KEYPAD_ROWS.map((row, rIdx) => (
                      <div key={rIdx} className="grid grid-cols-3 gap-3">
                        {row.map((btn) => (
                          <button
                            key={btn.num}
                            type="button"
                            onClick={() => playDtmf(btn.num)}
                            className="w-15 h-15 sm:w-16 sm:h-16 mx-auto rounded-full bg-white/15 hover:bg-white/25 active:bg-white/40 flex flex-col items-center justify-center transition-all cursor-pointer active:scale-95 shadow-sm"
                          >
                            <span className="text-xl sm:text-2xl font-heading font-medium leading-none text-white">
                              {btn.num}
                            </span>
                            {btn.sub && (
                              <span className="text-[8px] font-mono tracking-widest text-white/60 mt-0.5">
                                {btn.sub}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setShowKeypad(false)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer px-3 py-1 rounded-full bg-white/10"
                    >
                      Yashirish
                    </button>
                  </div>
                </div>
              )}

              {/* End Call Button (Solid Red with MdCallEnd) */}
              <div className="flex items-center justify-center pb-3">
                <button
                  type="button"
                  onClick={handleDecline}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#FF3B30] hover:bg-[#E02D23] active:scale-90 flex items-center justify-center text-white shadow-2xl shadow-rose-900/60 transition-all cursor-pointer"
                  aria-label="Qo'ng'iroqni tugatish"
                >
                  <MdCallEnd className="w-9 h-9 text-white" />
                </button>
              </div>
            </>
          )}

          {/* Bottom Home Indicator Bar (iOS) */}
          <div className="w-32 h-1 bg-white/40 rounded-full mx-auto mt-2" />
        </div>
      )}
    </div>
  );
}
