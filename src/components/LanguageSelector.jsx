import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';

const LANGUAGES = [
  { code: 'uz', label: 'O‘zbekcha', sub: 'Lotin alifbosi' },
  { code: 'uz_cyr', label: 'Ўзбекча', sub: 'Кирилл алифбоси' },
  { code: 'ru', label: 'Русский', sub: 'Официальный язык' },
];

export default function LanguageSelector({ compact = false }) {
  const { lang, setLang } = useAssessment();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const currentLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const selectLanguage = (code) => {
    setLang(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Tilni tanlash (Language)"
        className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 hover:bg-slate-200/80 active:bg-slate-200 text-slate-800 text-xs font-heading font-medium transition-all cursor-pointer shadow-2xs ${
          compact ? 'px-2.5 py-1.5' : 'px-3 py-1.5'
        }`}
      >
        <Globe className="w-3.5 h-3.5 text-slate-600 shrink-0" />
        <span className="font-semibold">{currentLang.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-slate-700' : ''
          }`}
        />
      </button>

      {/* Accessible Dropdown Card */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 mt-1.5 w-52 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 animate-fade-in focus:outline-none"
        >
          <div className="px-3 py-1 border-b border-slate-100 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
              Tilni tanlang // Language
            </span>
          </div>

          {LANGUAGES.map((item) => {
            const isSelected = item.code === lang;
            return (
              <button
                key={item.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => selectLanguage(item.code)}
                className={`w-full px-3 py-2 text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-slate-100 font-bold text-slate-950'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950 font-medium'
                }`}
              >
                <div className="flex flex-col">
                  <span className="leading-tight">{item.label}</span>
                  <span className="text-[10px] text-slate-400 font-normal leading-tight">
                    {item.sub}
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
