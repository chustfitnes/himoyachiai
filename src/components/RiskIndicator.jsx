import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function RiskIndicator({ percent = 0, level = 'green' }) {
  const safePercent = Math.min(100, Math.max(0, percent));

  let config = {
    label: "Past Xavf Darajasi",
    subtitle: "Hissiy zo‘riqish yoki tushunmovchilik, bevosita jismoniy tahdid aniqlanmadi",
    icon: ShieldCheck,
    colorClass: "text-emerald-700",
    bgClass: "bg-emerald-50/70",
    borderClass: "border-emerald-200",
    badgeClass: "badge-status-green",
    barColor: "#059669",
  };

  if (level === 'red') {
    config = {
      label: "Yuqori Xavf Darajasi (Shoshilinch)",
      subtitle: "Jismoniy xavf yoki hayotga bevosita tajovuz belgilari aniqlandi",
      icon: ShieldAlert,
      colorClass: "text-rose-700",
      bgClass: "bg-rose-50/70",
      borderClass: "border-rose-200",
      badgeClass: "badge-status-red",
      barColor: "#E11D48",
    };
  } else if (level === 'yellow') {
    config = {
      label: "O‘rta Xavf Darajasi",
      subtitle: "Ruhiy bosim, moliyaviy yoki aloqa nazorati (tazyiq) alomatlari",
      icon: AlertTriangle,
      colorClass: "text-amber-800",
      bgClass: "bg-amber-50/70",
      borderClass: "border-amber-200",
      badgeClass: "badge-status-yellow",
      barColor: "#D97706",
    };
  }

  const IconComponent = config.icon;

  // SVG circular calculation
  const size = 110;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safePercent / 100) * circumference;

  return (
    <div
      className={`p-6 rounded-2xl border ${config.bgClass} ${config.borderClass} transition-all shadow-xs`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Circular Progress Gauge */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#E2E8F0"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Value ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={config.barColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          {/* Centered Percentage Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-2xl sm:text-3xl font-heading font-extrabold ${config.colorClass}`}>
              {safePercent}%
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">
              Xavf
            </span>
          </div>
        </div>

        {/* Level Details */}
        <div className="flex-1 text-center sm:text-left space-y-1.5">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-bold border ${config.badgeClass}`}>
            <IconComponent className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{config.label}</span>
          </div>
          <p className="text-sm sm:text-base text-slate-900 font-heading font-bold leading-snug">
            {config.subtitle}
          </p>
          <p className="text-xs text-slate-500 font-sans">
            Tizim xulosasi deterministik xavfsizlik filtrlari va O‘zR qonunchiligi asosida xolis shakllantirildi.
          </p>
        </div>
      </div>
    </div>
  );
}
