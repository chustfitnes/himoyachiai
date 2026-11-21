import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TRANSLATIONS } from '../i18n/translations';

const AssessmentContext = createContext(null);

export function AssessmentProvider({ children }) {
  // CRITICAL PRIVACY ARCHITECTURE:
  // All state is strictly in-memory (RAM) inside React state.
  // NO localStorage, NO sessionStorage, NO IndexedDB is ever touched for messages or results!
  const [inputText, setInputText] = useState('');
  const [selectedChips, setSelectedChips] = useState([]);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lang, setLang] = useState('uz'); // 'uz' | 'uz_cyr' | 'ru'
  const [isStealthMode, setIsStealthMode] = useState(false);

  const toggleStealthMode = useCallback(() => {
    setIsStealthMode((prev) => !prev);
  }, []);

  const t = useCallback((key) => {
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.uz?.[key] || key;
  }, [lang]);

  // Clean Light Theme by default (World Standard, High Contrast, Crisp)
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
    root.style.backgroundColor = '#F8FAFC';
    const meta = document.getElementById('theme-color-meta');
    if (meta) meta.setAttribute('content', '#FFFFFF');
  }, []);

  const toggleTheme = useCallback(() => {
    // Kept for interface compatibility
    setIsDarkMode(false);
  }, []);

  // Clear all in-memory sensitive data
  const clearAllData = useCallback(() => {
    setInputText('');
    setSelectedChips([]);
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  // Panic button execution: clears all memory and redirects away immediately
  const triggerPanicEscape = useCallback(() => {
    clearAllData();
    window.location.replace('https://www.google.com');
  }, [clearAllData]);

  // Double-escape key listener for emergency exit
  useEffect(() => {
    let lastEscPress = 0;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEscPress < 600) {
          triggerPanicEscape();
        } else {
          lastEscPress = now;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerPanicEscape]);

  // Telegram Mini App lifecycle hooks
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      try {
        tg.ready();
        tg.expand();
        tg.setHeaderColor?.('#FFFFFF');
        tg.setBackgroundColor?.('#F8FAFC');
      } catch (err) {
        console.debug('Telegram WebApp initialization skipped outside Telegram');
      }
    }
  }, []);

  const value = {
    inputText,
    setInputText,
    selectedChips,
    setSelectedChips,
    result,
    setResult,
    isLoading,
    setIsLoading,
    error,
    setError,
    clearAllData,
    triggerPanicEscape,
    isDarkMode,
    toggleTheme,
    lang,
    setLang,
    t,
    isStealthMode,
    setIsStealthMode,
    toggleStealthMode,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

export function useAssessment() {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
