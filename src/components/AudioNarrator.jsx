import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';

export default function AudioNarrator({ textToRead }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlay = () => {
    if (!isSupported || !textToRead) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95; // calm cadence
    utterance.pitch = 1.0;
    utterance.lang = 'uz-UZ';

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  if (!isSupported) return null;

  return (
    <div className="inline-flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-heading font-semibold">
      {!isPlaying ? (
        <button
          onClick={handlePlay}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-emerald-800 hover:text-emerald-900 bg-white hover:bg-emerald-50 border border-slate-200/60 hover:border-emerald-200 transition-all cursor-pointer shadow-xs"
          title="Xulosani ovozli eshitish"
        >
          <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Ovozli eshitish</span>
        </button>
      ) : (
        <>
          <button
            onClick={isPaused ? handlePlay : handlePause}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold cursor-pointer transition-colors shadow-xs"
            title={isPaused ? "Davom ettirish" : "Pauza"}
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isPaused ? "Davom ettirish" : "Pauza"}</span>
          </button>

          <button
            onClick={handleStop}
            type="button"
            className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
            title="To'xtatish"
          >
            <VolumeX className="w-4 h-4 text-rose-500" />
          </button>
        </>
      )}
    </div>
  );
}
