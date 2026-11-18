import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function RiskIndicator({ percent = 0, level = 'green' }) {
  const safePercent = Math.min(100, Math.max(0, percent));

  // Determine styling, icon, and semantic label
  let config = {
    label: "Past xavf darajasi",
    subtitle: "Hissiy zo'riqish yoki tushunmovchilik, bevosita tahdid aniqlanmadi",
    icon: ShieldCheck,
    colorClass: "text-emerald-700 dark:text-emerald-300",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/40",
    borderClass: "border-emerald-200 dark:border-emerald-800",
    barColor: "#10B981",
    barBg: "#D1FAE5",
  };

  if (level === 'red') {
    config = {
      label: "Yuqori xavf darajasi (Shoshilinch)",
      subtitle: "Jismoniy xavf yoki hayotga tahdid belgilari mavjud",
      icon: ShieldAlert,
      colorClass: "text-red-700 dark:text-red-300",
      bgClass: "bg-red-50 dark:bg-red-950/40",
      borderClass: "border-red-200 dark:border-red-800",
      barColor: "#EF4444",
      barBg: "#FEE2E2",
    };
  } else if (level === 'yellow') {
    config = {
      label: "O'rta xavf darajasi",
      subtitle: "Ruhiy bosim, moliyaviy yoki aloqa nazorati alomatlari",
      icon: AlertTriangle,
      colorClass: "text-amber-800 dark:text-amber-300",
      bgClass: "bg-amber-50 dark:bg-amber-950/40",
      borderClass: "border-amber-200 dark:border-amber-800",
      barColor: "#F59E0B",
      barBg: "#FEF3C7",
    };
  }

  const IconComponent = config.icon;

  // SVG circular calculation
  const size = 110;
  const strokeWidth = 9;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safePercent / 100) * circumference;

  return (
    <div
      className={`p-5 sm:p-6 rounded-2xl border ${config.bgClass} ${config.borderClass} transition-colors`}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
        {/* Circular Progress Gauge */}
        <div className="relative shrink-0 flex items-center justify-center">
          <svg width={size} height={size} className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-black/10 dark:text-white/10"
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
              className="transition-all duration-700 ease-out"
            />
          </svg>

          {/* Centered Percentage Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`text-2xl sm:text-3xl font-serif font-bold ${config.colorClass}`}>
              {safePercent}%
            </span>
            <span className="text-[10px] uppercase font-sans tracking-wider text-ink-muted-light dark:text-ink-muted-dark">
              Xavf
            </span>
          </div>
        </div>

        {/* Level Details (Accessibility: Color + Icon + Text together) */}
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-semibold mb-2 bg-white/70 dark:bg-black/30 border border-black/5 dark:border-white/10">
            <IconComponent className={`w-4 h-4 ${config.colorClass}`} aria-hidden="true" />
            <span className={config.colorClass}>{config.label}</span>
          </div>
          <p className="text-sm sm:text-base text-ink-primary-light dark:text-ink-primary-dark font-medium leading-snug">
            {config.subtitle}
          </p>
          <p className="text-xs text-ink-secondary-light dark:text-ink-secondary-dark mt-1">
            Avtomatik dastlabki baholash &bull; Mutaxassis ko‘rigi o‘rnini bosmaydi
          </p>
        </div>
      </div>
    </div>
  );
}
