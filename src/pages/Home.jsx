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
      badge: 'Neytral / Tavsiyaviy',
      score: 18,
      title: 'Hissiy zo‘riqish & Oila ichki muloqot ehtiyoji',
      caseText: '«Turmush o‘rtog‘im bilan ko‘p tushunmovchiliklar bo‘lyapti, shaxsiy chegaralarim e’tiborga olinmayapti, lekin hech qanday jismoniy yoki moliyaviy zo‘ravonlik yo‘q.»',
      legalCitation: 'Oila kodeksi 4-moddasi (Oila a’zolarining huquqiy tengligi va o‘zaro yordami)',
      actionText: 'Psixologik maslahat, shaxsiy chegaralarni mustahkamlash va oilaviy mediator xizmatlari. 1146 bepul psixolog yordami tavsiya etiladi.',
      badgeClass: 'badge-status-green',
      progressColor: 'bg-emerald-600',
      textColor: 'text-emerald-800',
    },
    yellow: {
      id: 'yellow',
      badge: 'Tazyiq va Nazorat',
      score: 68,
      title: 'Ruhiy, iqtisodiy cheklov & Doimiy nazorat',
      caseText: '«Aloqa vositalarimni tekshiradi, yaqinlarim bilan ko‘rishishimni taqiqlaydi, moddiy tomondan to‘liq cheklab, ijtimoiy hayotdan ajratib qo‘ymoqda.»',
      legalCitation: 'O‘zR 561-sonli Qonuni (Xotin-qizlarni tazyiq va zo‘ravonlikdan himoya qilish to‘g‘risida, 3-modda)',
      actionText: 'Vakolatli organdan 30 kunga beriladigan va uzaytirilishi mumkin bo‘lgan davlat Himoya Orderini (Protection Order) talab qilish huquqi.',
      badgeClass: 'badge-status-yellow',
      progressColor: 'bg-amber-600',
      textColor: 'text-amber-900',
    },
    red: {
      id: 'red',
      badge: 'Shoshilinch Xavf',
      score: 98,
      title: 'Jismoniy tajovuz, erkinlikni cheklash & Hayotga tahdid',
      caseText: '«Xonaga qulflab hayotimga tajovuz qildi, qurol yoki o‘tkir jism bilan qo‘rqitdi. Bolalarim bilan xavf ostida qoldim, zudlik bilan himoyaga muhtojman!»',
      legalCitation: 'O‘zR Jinoyat Kodeksi 112-moddasi (O‘ldirish bilan qo‘rqitish) & 126-1-moddasi (Oilaviy zo‘ravonlik)',
      actionText: 'ZUDLIK BILAN: 102 (Ichki ishlar) yoki 1146 (Milliy ishonch) ga qo‘ng‘iroq qiling. Tizim «Inson» markazi ixtisoslashgan boshpanasiga (Sheltir) yo‘naltiradi.',
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
      q: "Fuqaro yozgan murojaatlar serverda yoki ma’lumotlar bazasida saqlanadimi?",
      a: "Mutlaqo yo‘q. Platforma qat’iy Zero-Log (RAM-only) tamoyilida faoliyat yuritadi. Tahlil faqatgina serverning vaqtinchalik operativ xotirasida soniyalar ichida qayta ishlanadi va sahifa yopilishi bilan bir zumda o‘chiriladi. Hech qanday ma’lumotlar bazasi, foydalanuvchi profili yoki server jurnali (log) yuritilmaydi."
    },
    {
      q: "Xizmatdan foydalanish bepulmi va ro‘yxatdan o‘tish talab qilinadimi?",
      a: "Platforma 100% bepul, ochiq va notijorat jamoat xavfsizligi tizimidir. Pasport ma’lumotlari, telefon raqami yoki ro‘yxatdan o‘tish aslo talab etilmaydi."
    },
    {
      q: "Tahlil xulosalari O‘zbekiston Respublikasi amaldagi qonunchiligiga muvofiqmi?",
      a: "Ha. Tizim O‘zbekiston Respublikasining Jinoyat Kodeksi (JK 112, 126-1, 141-3, 165), Ma’muriy javobgarlik to‘g‘risidagi kodeksi hamda 561-sonli «Xotin-qizlarni tazyiq va zo‘ravonlikdan himoya qilish to‘g‘risida»gi Qonuni mezonlari asosida yuridik tavsiyalar beradi."
    },
    {
      q: "Favqulodda tahdid yuzaga kelganda birinchi navbatda nima qilish zarur?",
      a: "Agar hayotingizga yoki farzandlaringizga bevosita xavf solinayotgan bo‘lsa, saytdagi 'Tezkor SOS' tugmasidan foydalaning yoki zudlik bilan 102 (Ichki ishlar organlari) hamda 1146 (24/7 Milliy bepul ishonch telefoni) ga qo‘ng‘iroq qiling."
    }
  ];

  const currentPreset = SCENARIOS[activeScenario];

  return (
    <div className="py-6 sm:py-12 space-y-20 animate-fade-in text-slate-900">
      
      {/* 1. HERO SECTION (Executive Civic Authority) */}
      <section className="text-center space-y-7 max-w-4xl mx-auto pt-4 sm:pt-6">
        
        {/* Institutional Authority Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-slate-100 text-xs font-heading font-semibold shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>O‘zbekiston Respublikasi • Huquqiy Himoya & Xavfsizlik Konsoli</span>
        </div>

        {/* Hero Title: Serious, Non-Glitzy, Authoritative */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-slate-950 leading-[1.12]">
          Tazyiq va zo‘ravonlikdan <br className="hidden sm:inline" />
          <span className="text-slate-900 underline decoration-emerald-500/40 decoration-4 underline-offset-8">
            xolis huquqiy baholash va himoya
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-sans font-normal leading-relaxed">
          Xotin-qizlar va bolalar huquqlarini ta’minlash, xavf darajasini professional baholash hamda zudlik bilan qonuniy yo‘l xaritasini shakllantirish bo‘yicha milliy tizim.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            to="/describe"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-sm transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Vaziyatni baholash va reja olish</span>
            <ArrowRight className="w-4 h-4 ml-1 text-slate-400" />
          </Link>

          <Link
            to="/safewalk"
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-heading font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Car className="w-4 h-4 text-slate-600" />
            <span>SafeWalk safar hamrohi</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsScreenerOpen(true)}
            className="w-full sm:w-auto px-5 py-4 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200/60 text-slate-700 font-heading font-semibold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>1 daqiqalik test</span>
          </button>
        </div>

        {/* Dignified Assurance Ribbon */}
        <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200/80 max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-sans text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>100% Anonim: Foydalanuvchi ma’lumotlari saqlanmaydi</span>
          </span>
          <div className="flex items-center gap-3 font-semibold text-slate-900">
            <a href="tel:1146" className="hover:text-emerald-700 hover:underline">1146 (Ishonch)</a>
            <span className="text-slate-300">•</span>
            <a href="tel:102" className="text-rose-700 hover:underline">102 (IIB)</a>
          </div>
        </div>
      </section>

      {/* 2. STATUTORY LEGAL QUALIFICATION MATRIX (Credible Institutional Presentation) */}
      <section className="max-w-4xl mx-auto card-senior p-6 sm:p-8 space-y-6">
        
        {/* Header & Level Tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-heading font-bold text-slate-950 flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-700" />
              <span>O‘zR Qonunchiligi Asosidagi Huquqiy Mezonlar</span>
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Turli darajadagi vaziyatlarga nisbatan qo‘llaniladigan rasmiy mezon va choralar:
            </p>
          </div>

          {/* Clean Segmented Controls */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 self-start md:self-auto">
            <button
              onClick={() => setActiveScenario('green')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                activeScenario === 'green'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              1. Past xavf
            </button>
            <button
              onClick={() => setActiveScenario('yellow')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                activeScenario === 'yellow'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              2. O‘rta xavf
            </button>
            <button
              onClick={() => setActiveScenario('red')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                activeScenario === 'red'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Shoshilinch xavf
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
                <span>Normativ-huquqiy asos:</span>
              </span>
              <p className="text-slate-600 leading-relaxed pl-5.5">
                {currentPreset.legalCitation}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <span className="font-heading font-bold text-slate-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Qonuniy himoya yo‘li:</span>
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
            <span>30 dan ortiq deterministik xavfsizlik filtrlari kafolatlangan.</span>
          </span>
          <div className="flex items-center gap-2">
            <Link
              to="/describe"
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>O‘z vaziyatingizni baholash</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. CIVIC INFRASTRUCTURE ASSURANCES (Executive Metrics Bar) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div className="p-5 rounded-xl card-senior text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-slate-900">
            0 Bayt
          </p>
          <p className="text-xs text-slate-800 font-heading font-bold">
            Zero-Log Arxitekturasi
          </p>
          <p className="text-[11px] text-slate-500 font-sans">
            Serverda hech narsa saqlanmaydi
          </p>
        </div>

        <div className="p-5 rounded-xl card-senior text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-slate-900">
            24/7
          </p>
          <p className="text-xs text-slate-800 font-heading font-bold">
            Uzluksiz Yo‘naltirish
          </p>
          <p className="text-[11px] text-slate-500 font-sans">
            Tazyiqda bir zumda harakat rejasi
          </p>
        </div>

        <div className="p-5 rounded-xl card-senior text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-slate-900">
            30+
          </p>
          <p className="text-xs text-slate-800 font-heading font-bold">
            Qonunchilik Mezonlari
          </p>
          <p className="text-[11px] text-slate-500 font-sans">
            Deterministik xavfsizlik qoidalari
          </p>
        </div>

        <div className="p-5 rounded-xl card-senior text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-slate-900">
            14 Hudud
          </p>
          <p className="text-xs text-slate-800 font-heading font-bold">
            «Inson» Markazlari
          </p>
          <p className="text-[11px] text-slate-500 font-sans">
            Ijtimoiy va boshpana xizmatlari
          </p>
        </div>
      </section>

      {/* 4. THREE CORE MODULES (Senior Functional Pillars) */}
      <section className="space-y-6 max-w-5xl mx-auto">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-slate-950">
            Asosiy Xavfsizlik Modullari
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-xl mx-auto">
            Har qanday kutilmagan bosim yoki xavf yuzaga kelganda sizga hamroh bo‘luvchi maxfiy tizimlar
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
                  Vaziyatni Baholash
                </h3>
                <span className="text-[11px] font-sans text-slate-500 block">
                  Deterministik tahlil va qonuniy reja
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Vaziyatingizni O‘zR amaldagi qonunchiligi va 30+ xavfsizlik mezonlari asosida xolis tahlil qilib, tegishli moddalar va amaliy harakatlar rejasini beradi.
              </p>
            </div>
            <Link
              to="/describe"
              className="text-xs font-heading font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1.5 pt-2 border-t border-slate-100"
            >
              <span>Vaziyatni tasvirlash</span>
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
                  SafeWalk Safar Hamrohi
                </h3>
                <span className="text-[11px] font-sans text-slate-500 block">
                  Aqlli taymer va GPS koordinata
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Kechki taksi yoki yo‘lda avtomatik xavfsizlik nazorati. Vaqt tugaganda tasdiqlanmasa, ishonchli insoningizga lokatsiya va SOS signalini uzatadi.
              </p>
            </div>
            <Link
              to="/safewalk"
              className="text-xs font-heading font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1.5 pt-2 border-t border-slate-100"
            >
              <span>Taymerni sozlash</span>
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
                  Raqamli Dalillar Seyfi
                </h3>
                <span className="text-[11px] font-sans text-slate-500 block">
                  JK 141-3 • JK 165 • Rasmiy Ariza
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Telegram, Instagramdagi shantaj yoki tahdid xabarlarini xronologik tartiblab, ichki ishlar organlariga topshiriladigan rasmiy ariza matnini shakllantiradi.
              </p>
            </div>
            <Link
              to="/evidence"
              className="text-xs font-heading font-bold text-slate-900 hover:text-emerald-700 flex items-center gap-1.5 pt-2 border-t border-slate-100"
            >
              <span>Arizani shakllantirish</span>
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
              Vakolatli Davlat va Nodavlat Yordam Tarmoqlari:
            </h3>
            <span className="text-xs text-slate-500 font-mono">24/7 Bepul</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-slate-950 block font-heading font-bold text-base">1146</strong>
                <span className="text-slate-600 font-sans">Ayollar ishonch telefoni</span>
              </div>
              <a href="tel:1146" className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-heading font-bold border border-slate-300">
                Qo‘ng‘iroq
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-slate-950 block font-heading font-bold text-base">102</strong>
                <span className="text-slate-600 font-sans">Ichki ishlar (IIB)</span>
              </div>
              <a href="tel:102" className="px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-heading font-bold">
                Qo‘ng‘iroq
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <strong className="text-slate-950 block font-heading font-bold text-base">1008</strong>
                <span className="text-slate-600 font-sans">"Madad" bepul yuridik</span>
              </div>
              <Link to="/resources" className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-900 font-heading font-bold border border-slate-300">
                Ko‘rish
              </Link>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-3">
          <div className="text-center pb-2">
            <h3 className="font-heading font-bold text-lg text-slate-950">
              Ko‘p Beriladigan Savollar
            </h3>
            <p className="text-xs text-slate-500 font-sans">
              Maxfiylik, xavfsizlik va yuridik javobgarlik kafolatlari
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
