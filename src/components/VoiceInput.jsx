import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

export default function VoiceInput({ onTranscript, disabled = false, language = 'uz-UZ' }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMessage('');
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }

      if (finalTranscript) {
        onTranscript(finalTranscript.trim());
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition notice:', event.error);
      if (event.error === 'not-allowed') {
        setErrorMessage("Mikrofondan foydalanishga ruxsat berilmadi.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscript, language]);

  const toggleListening = () => {
    if (!isSupported || disabled) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setErrorMessage('');
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Failed to start speech recognition:', err);
      }
    }
  };

  if (!isSupported) {
    return null; // Gracefully degrade if browser doesn't have Web Speech API
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        aria-label={isListening ? "Ovozli yozishni to'xtatish" : "Ovoz orqali aytib berish"}
        title={isListening ? "Ovoz yozilmoqda... To'xtatish uchun bosing" : "Ovoz orqali aytib berish (Mikrofon)"}
        className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-heading font-semibold transition-all shadow-xs ${
          isListening
            ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/30 ring-2 ring-rose-400'
            : 'bg-white text-slate-700 hover:text-emerald-700 hover:bg-emerald-50/50 border border-slate-200'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
      >
        {isListening ? (
          <>
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <Mic className="w-3.5 h-3.5 shrink-0" />
            <span>Tinglanmoqda... (to‘xtatish)</span>
          </>
        ) : (
          <>
            <Mic className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
            <span>Ovoz orqali aytish</span>
          </>
        )}
      </button>

      {errorMessage && (
        <div className="absolute top-full right-0 mt-1.5 flex items-center gap-1 text-[11px] text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200 z-10 whitespace-nowrap shadow-md">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
