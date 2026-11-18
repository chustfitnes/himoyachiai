import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

  // Theme state: defaults to user system preference or Telegram theme
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check Telegram theme first if available
    if (window.Telegram?.WebApp?.colorScheme) {
      return window.Telegram.WebApp.colorScheme === 'dark';
    }
    // Otherwise check media query
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      const meta = document.getElementById('theme-color-meta');
      if (meta) meta.setAttribute('content', '#16181A');
    } else {
      root.classList.remove('dark');
      const meta = document.getElementById('theme-color-meta');
      if (meta) meta.setAttribute('content', '#FAF8F5');
    }
  }, [isDarkMode]);

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
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
    // Neutral destination that wipes navigation history stack forward/back
    window.location.replace('https://www.google.com');
  }, [clearAllData]);

  // Double-escape key listener for emergency exit
  useEffect(() => {
    let lastEscPress = 0;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEscPress < 600) {
          // Double press detected within 600ms
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

        // Sync theme with Telegram
        if (tg.themeParams && tg.colorScheme) {
          setIsDarkMode(tg.colorScheme === 'dark');
        }

        tg.onEvent?.('themeChanged', () => {
          if (tg.colorScheme) {
            setIsDarkMode(tg.colorScheme === 'dark');
          }
        });
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
