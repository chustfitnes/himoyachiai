import React from 'react';
import { ShieldCheck, Phone, ShieldAlert, Lock, HeartHandshake } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmergencyFooter() {
  return (
    <footer
      className="mt-auto border-t border-slate-200/80 bg-white/80 backdrop-blur-sm py-8 pb-safe text-slate-900"
      aria-label="Favqulodda yordam va ma'lumotlar"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* National Hotlines Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <a
            href="tel:1146"
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-200 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 group-hover:text-emerald-700 block">
                Ishonch telefoni
              </span>
              <span className="text-lg font-heading font-extrabold text-slate-900 group-hover:text-emerald-800">
                1146
              </span>
            </div>
            <Phone className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
          </a>

          <a
            href="tel:102"
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-200 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 group-hover:text-rose-700 block">
                Ichki Ishlar (IIB)
              </span>
              <span className="text-lg font-heading font-extrabold text-slate-900 group-hover:text-rose-800">
                102
              </span>
            </div>
            <ShieldAlert className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
          </a>

          <a
            href="tel:1102"
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 group-hover:text-slate-700 block">
                Kiberxavfsizlik
              </span>
              <span className="text-lg font-heading font-extrabold text-slate-900 group-hover:text-slate-800">
                1102
              </span>
            </div>
            <Lock className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </a>

          <a
            href="tel:1140"
            className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 group-hover:text-slate-700 block">
                «Inson» Markazlari
              </span>
              <span className="text-lg font-heading font-extrabold text-slate-900 group-hover:text-slate-800">
                1140
              </span>
            </div>
            <HeartHandshake className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </a>
        </div>

        {/* Footer Meta Details */}
        <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
            <span className="font-heading font-medium text-slate-700">
              HimoyaAI — O‘zbekiston xotin-qizlari va bolalari uchun xolis anonim tizim.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400 font-medium">
            <Link to="/privacy" className="hover:text-slate-700 transition-colors">
              Zero-Log Kafolati
            </Link>
            <span>•</span>
            <Link to="/resources" className="hover:text-slate-700 transition-colors">
              Davlat Reabilitatsiya Markazlari
            </Link>
            <span>•</span>
            <span className="font-mono text-[11px] text-slate-400">
              RAM-Only Security
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
