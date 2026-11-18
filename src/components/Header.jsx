import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { ShieldCheck, Moon, Sun } from 'lucide-react';
import { useAssessment } from '../context/AssessmentContext';
import PanicButton from './PanicButton';

export default function Header() {
  const { isDarkMode, toggleTheme } = useAssessment();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-borderSubtle-light bg-canvas-light/95 backdrop-blur-md transition-colors dark:border-borderSubtle-dark dark:bg-canvas-dark/95">
      <div className="max-w-reading mx-auto px-4 sm:px-6">
        {/* Top row: Brand + Theme Toggle + Panic Button */}
        <div className="h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 group text-ink-primary-light dark:text-ink-primary-dark focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg p-0.5 shrink-0"
            aria-label="HimoyaAI bosh sahifasi"
          >
            <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-200 dark:bg-brand-800/40 dark:border-brand-700 flex items-center justify-center text-brand-600 dark:text-brand-200 transition-colors">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-semibold text-base sm:text-lg tracking-tight leading-none">
                HimoyaAI
              </span>
              <span className="text-[10px] text-ink-secondary-light dark:text-ink-secondary-dark mt-0.5 font-sans leading-none">
                Dastlabki ko'mak
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center gap-1.5" aria-label="Asosiy menyu">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors font-medium min-h-[38px] flex items-center ${
                  isActive
                    ? 'text-brand-700 bg-brand-50 dark:text-brand-200 dark:bg-brand-900/40'
                    : 'text-ink-secondary-light hover:text-ink-primary-light dark:text-ink-secondary-dark dark:hover:text-ink-primary-dark'
                }`
              }
            >
              Bosh sahifa
            </NavLink>

            <NavLink
              to="/resources"
              className={({ isActive }) =>
                `px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors font-medium min-h-[38px] flex items-center ${
                  isActive
                    ? 'text-brand-700 bg-brand-50 dark:text-brand-200 dark:bg-brand-900/40'
                    : 'text-ink-secondary-light hover:text-ink-primary-light dark:text-ink-secondary-dark dark:hover:text-ink-primary-dark'
                }`
              }
            >
              Resurslar
            </NavLink>

            <NavLink
              to="/privacy"
              className={({ isActive }) =>
                `px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors font-medium min-h-[38px] flex items-center ${
                  isActive
                    ? 'text-brand-700 bg-brand-50 dark:text-brand-200 dark:bg-brand-900/40'
                    : 'text-ink-secondary-light hover:text-ink-primary-light dark:text-ink-secondary-dark dark:hover:text-ink-primary-dark'
                }`
              }
            >
              Maxfiylik
            </NavLink>
          </nav>

          {/* Right actions: Theme Toggle + Panic Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 text-ink-secondary-light hover:text-ink-primary-light dark:text-ink-secondary-dark dark:hover:text-ink-primary-dark rounded-xl hover:bg-surfaceSubtle-light dark:hover:bg-surfaceSubtle-dark transition-colors focus:ring-2 focus:ring-brand-500 focus:outline-none min-h-[38px] min-w-[38px] flex items-center justify-center"
              aria-label={isDarkMode ? "Yorug' rejimga o'tish" : "Qorong'i rejimga o'tish"}
              title={isDarkMode ? "Yorug' rejim" : "Qorong'i rejim"}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Panic Button integrated cleanly */}
            <PanicButton />
          </div>
        </div>

        {/* Mobile Navigation bar: perfectly positioned below brand row on <= 640px */}
        <nav className="sm:hidden flex items-center justify-around py-2 border-t border-borderSubtle-light/60 dark:border-borderSubtle-dark/60 text-xs font-medium" aria-label="Mobil menyu">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg transition-colors min-h-[36px] flex items-center ${
                isActive
                  ? 'text-brand-700 bg-brand-50 font-semibold dark:text-brand-200 dark:bg-brand-900/40'
                  : 'text-ink-secondary-light dark:text-ink-secondary-dark'
              }`
            }
          >
            Bosh sahifa
          </NavLink>

          <NavLink
            to="/resources"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg transition-colors min-h-[36px] flex items-center ${
                isActive
                  ? 'text-brand-700 bg-brand-50 font-semibold dark:text-brand-200 dark:bg-brand-900/40'
                  : 'text-ink-secondary-light dark:text-ink-secondary-dark'
              }`
            }
          >
            Resurslar
          </NavLink>

          <NavLink
            to="/privacy"
            className={({ isActive }) =>
              `px-3 py-1.5 rounded-lg transition-colors min-h-[36px] flex items-center ${
                isActive
                  ? 'text-brand-700 bg-brand-50 font-semibold dark:text-brand-200 dark:bg-brand-900/40'
                  : 'text-ink-secondary-light dark:text-ink-secondary-dark'
              }`
            }
          >
            Maxfiylik
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
