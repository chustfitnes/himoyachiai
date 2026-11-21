import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAssessment } from '../context/AssessmentContext';
import QuickScreenerModal from '../components/QuickScreenerModal';
import QuickSosModal from '../components/QuickSosModal';
import FakeCallModal from '../components/FakeCallModal';
import {
  ShieldCheck,
  ShieldAlert,
  Car,
  FolderLock,
  PhoneCall,
  Clock,
  Sparkles,
  ArrowRight,
  Lock,
  Scale,
  FileText,
  HelpCircle,
  Zap,
  ChevronDown,
  Terminal,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ExternalLink,
  Info
} from 'lucide-react';

export default function Home() {
  const { t } = useAssessment();
  const [isScreenerOpen, setIsScreenerOpen] = useState(false);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isFakeCallOpen, setIsFakeCallOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  // Live Interactive Scenario Studio State
  const [activeScenario, setActiveScenario] = useState('red');

  const SCENARIOS = {
    green: {
      id: 'green',
      badge: t('sc_green_badge'),
      score: 18,
      title: t('sc_green_title'),
      caseText: t('sc_green_case'),
      legalCitation: t('sc_green_legal'),
      actionText: t('sc_green_action'),
      badgeClass: 'badge-status-green',
      progressColor: 'bg-emerald-600',
      textColor: 'text-emerald-800',
    },
    yellow: {
      id: 'yellow',
      badge: t('sc_yellow_badge'),
      score: 68,
      title: t('sc_yellow_title'),
      caseText: t('sc_yellow_case'),
      legalCitation: t('sc_yellow_legal'),
      actionText: t('sc_yellow_action'),
      badgeClass: 'badge-status-yellow',
      progressColor: 'bg-amber-600',
      textColor: 'text-amber-900',
    },
    red: {
      id: 'red',
      badge: t('sc_red_badge'),
      score: 98,
      title: t('sc_red_title'),
      caseText: t('sc_red_case'),
      legalCitation: t('sc_red_legal'),
      actionText: t('sc_red_action'),
      badgeClass: 'badge-status-red',
      progressColor: 'bg-rose-600',
      textColor: 'text-rose-900',
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const FAQS = [
    {
      q: t('faq_q1'),
      a: t('faq_a1'),
    },
    {
      q: t('faq_q2'),
      a: t('faq_a2'),
    },
    {
      q: t('faq_q3'),
      a: t('faq_a3'),
    },
    {
      q: t('faq_q4'),
      a: t('faq_a4'),
    }
  ];

  const currentPreset = SCENARIOS[activeScenario];

  return (
    <div className="py-6 sm:py-12 space-y-20 animate-fade-in text-slate-900">
      
      {/* 1. HERO SECTION (Executive Civic Authority) */}
      <section className="text-center space-y-5 sm:space-y-7 max-w-4xl mx-auto pt-2 sm:pt-6">
        
        {/* Institutional Authority Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-slate-900 text-slate-100 text-[11px] sm:text-xs font-heading font-semibold shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
          <span>{t('hero_badge')}</span>
        </div>

        {/* Hero Title: Serious, Non-Glitzy, Authoritative */}
        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-heading font-extrabold tracking-tight text-slate-950 leading-[1.18] px-1">
          {t('hero_title_1')} <br className="hidden sm:inline" />
          <span className="text-slate-900 underline decoration-emerald-500/40 decoration-4 underline-offset-8">
            {t('hero_title_highlight')}
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-xs sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto font-sans font-normal leading-relaxed px-2">
          {t('hero_subtitle')}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 sm:gap-3.5 pt-1">
          <Link
            to="/describe"
            className="w-full sm:w-auto px-5 sm:px-8 py-3 sm:py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs sm:text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{t('hero_cta_primary')}</span>
            <ArrowRight className="w-4 h-4 ml-1 text-slate-400 shrink-0" />
          </Link>

          <Link
            to="/safewalk"
            className="w-full sm:w-auto px-5 sm:px-6 py-3 sm:py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-heading font-bold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <Car className="w-4 h-4 text-slate-600 shrink-0" />
            <span>{t('hero_cta_safewalk')}</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsScreenerOpen(true)}
            className="w-full sm:w-auto px-4 sm:px-5 py-3 sm:py-4 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/60 text-slate-700 font-heading font-semibold text-xs sm:text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" />
            <span>{t('hero_cta_screener')}</span>
          </button>
        </div>

        {/* Dignified Assurance Ribbon */}
        <div className="p-3 sm:p-3.5 rounded-xl bg-slate-100/80 border border-slate-200/80 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-sans text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>{t('hero_ribbon_anon')}</span>
          </span>
          <div className="flex items-center gap-3 font-semibold text-slate-900">
            <a href="tel:1146" className="hover:text-emerald-700 hover:underline">{t('hero_ribbon_hotline')}</a>
            <span className="text-slate-300">•</span>
            <a href="tel:102" className="text-rose-700 hover:underline">{t('hero_ribbon_police')}</a>
          </div>
        </div>
      </section>

      {/* 2. STATUTORY LEGAL QUALIFICATION MATRIX (Credible Institutional Presentation) */}
      <section className="max-w-4xl mx-auto card-senior p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        
        {/* Header & Level Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-sm sm:text-base font-heading font-bold text-slate-950 flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-700" />
              <span>{t('matrix_heading')}</span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-sans mt-0.5">
              {t('matrix_subheading')}
            </p>
          </div>

          {/* Clean Segmented Controls (Grid on mobile, flex on desktop) */}
          <div className="grid grid-cols-3 sm:flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveScenario('green')}
              className={`px-2 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-heading font-semibold text-center transition-all cursor-pointer truncate ${
                activeScenario === 'green'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {t('matrix_tab_green')}
            </button>
            <button
              onClick={() => setActiveScenario('yellow')}
              className={`px-2 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-heading font-semibold text-center transition-all cursor-pointer truncate ${
                activeScenario === 'yellow'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('matrix_tab_yellow')}
            </button>
            <button
              onClick={() => setActiveScenario('red')}
              className={`px-2 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-heading font-semibold text-center transition-all cursor-pointer truncate ${
                activeScenario === 'red'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('matrix_tab_red')}
            </button>
          </div>
        </div>

        {/* Active Scenario Card */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className={`text-xs font-heading font-bold px-3 py-1 rounded-full border ${currentPreset.badgeClass}`}>
                {currentPreset.badge}
              </span>
              <span className="text-xs sm:text-sm font-heading font-bold text-slate-900">
                {currentPreset.title}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              Indeks: {currentPreset.score}%
            </span>
          </div>

          {/* Real snippet quote */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-800 text-sm font-sans leading-relaxed">
            {currentPreset.caseText}
          </div>

          {/* Legal Citation & Action Protocol */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs font-sans">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-heading font-bold text-slate-950 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-slate-700 shrink-0" />
                <span>{t('matrix_basis_label')}</span>
              </span>
              <p className="text-slate-600 leading-relaxed pl-5.5">
                {currentPreset.legalCitation}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-heading font-bold text-slate-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{t('matrix_action_label')}</span>
              </span>
              <p className="text-slate-600 leading-relaxed pl-5.5">
                {currentPreset.actionText}
              </p>
            </div>
          </div>
        </div>

        {/* Studio Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 font-sans flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-slate-600 shrink-0" />
            <span>{t('matrix_guarantee_note')}</span>
          </span>
          <div className="flex items-center gap-2">
            <Link
              to="/describe"
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>{t('matrix_cta_btn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CIVIC INFRASTRUCTURE ASSURANCES (Executive Metrics Bar) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div className="p-5 rounded-xl card-senior text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-slate-900">
            {t('metric_zero_title')}
          </p>
          <p className="text-xs text-slate-800 font-heading font-bold">
            {t('metric_zero_label')}
          </p>
          <p className="text-[11px] text-slate-500 font-sans">
            {t('metric_zero_desc')}
          </p>
        </div>

        <div className="p-5 rounded-xl card-senior text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-slate-900">
            {t('metric_speed_title')}
          </p>
          <p className="text-xs text-slate-800 font-heading font-bold">
            {t('metric_speed_label')}
          </p>
          <p className="text-[11px] text-slate-500 font-sans">
            {t('metric_speed_desc')}
          </p>
        </div>

        <div className="p-5 rounded-xl card-senior text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-slate-900">
            {t('metric_rules_title')}
          </p>
          <p className="text-xs text-slate-800 font-heading font-bold">
            {t('metric_rules_label')}
          </p>
          <p className="text-[11px] text-slate-500 font-sans">
            {t('metric_rules_desc')}
          </p>
        </div>

        <div className="p-5 rounded-xl card-senior text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-slate-900">
            {t('metric_regions_title')}
          </p>
          <p className="text-xs text-slate-800 font-heading font-bold">
            {t('metric_regions_label')}
          </p>
          <p className="text-[11px] text-slate-500 font-sans">
            {t('metric_regions_desc')}
          </p>
        </div>
      </section>

      {/* 4. THREE CORE MODULES (Senior Functional Pillars) */}
      <section className="space-y-6 max-w-5xl mx-auto">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-slate-950">
            {t('modules_heading')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-xl mx-auto">
            {t('modules_subheading')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: Risk Assessment */}
          <div className="p-6 rounded-2xl card-senior-interactive flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-950 text-base">
                  {t('mod1_title')}
                </h3>
                <span className="text-[11px] font-sans text-slate-500 block">
                  {t('mod1_subtitle')}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {t('mod1_desc')}
              </p>
            </div>
            <Link
              to="/describe"
              className="text-xs font-heading font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1.5 pt-2 border-t border-slate-100"
            >
              <span>{t('mod1_btn')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: SafeWalk */}
          <div className="p-6 rounded-2xl card-senior-interactive flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                <Car className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-950 text-base">
                  {t('mod2_title')}
                </h3>
                <span className="text-[11px] font-sans text-slate-500 block">
                  {t('mod2_subtitle')}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {t('mod2_desc')}
              </p>
            </div>
            <Link
              to="/safewalk"
              className="text-xs font-heading font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1.5 pt-2 border-t border-slate-100"
            >
              <span>{t('mod2_btn')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Evidence Locker */}
          <div className="p-6 rounded-2xl card-senior-interactive flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                <FolderLock className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-950 text-base">
                  {t('mod3_title')}
                </h3>
                <span className="text-[11px] font-sans text-slate-500 block">
                  {t('mod3_subtitle')}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {t('mod3_desc')}
              </p>
            </div>
            <Link
              to="/evidence"
              className="text-xs font-heading font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1.5 pt-2 border-t border-slate-100"
            >
              <span>{t('mod3_btn')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. HOTLINES & FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto space-y-8">
        
        {/* Instant Access Emergency Strip */}
        <div className="card-senior p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-sm text-slate-950">
              {t('hotlines_title')}
            </h3>
            <span className="text-xs text-slate-500 font-mono">{t('hotlines_free')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-slate-950 block font-heading font-bold text-base">1146</strong>
                <span className="text-slate-600 font-sans">{t('hotline_1146_label')}</span>
              </div>
              <a href="tel:1146" className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-heading font-bold border border-slate-300">
                {t('btn_call')}
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-slate-950 block font-heading font-bold text-base">102</strong>
                <span className="text-slate-600 font-sans">{t('hotline_102_label')}</span>
              </div>
              <a href="tel:102" className="px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-heading font-bold">
                {t('btn_call')}
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-slate-950 block font-heading font-bold text-base">1008</strong>
                <span className="text-slate-600 font-sans">{t('hotline_1008_label')}</span>
              </div>
              <Link to="/resources" className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-heading font-bold border border-slate-300">
                {t('btn_view')}
              </Link>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-3">
          <div className="text-center pb-2">
            <h3 className="font-heading font-bold text-lg text-slate-950">
              {t('faq_heading')}
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              {t('faq_subheading')}
            </p>
          </div>

          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="rounded-xl card-senior overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-xs sm:text-sm text-slate-950 cursor-pointer hover:bg-slate-50/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3.5 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Modals */}
      <QuickScreenerModal isOpen={isScreenerOpen} onClose={() => setIsScreenerOpen(false)} />
      <QuickSosModal isOpen={isSosOpen} onClose={() => setIsSosOpen(false)} />
      <FakeCallModal isOpen={isFakeCallOpen} onClose={() => setIsFakeCallOpen(false)} />
    </div>
  );
}
