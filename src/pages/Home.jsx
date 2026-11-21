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
      badge: 'Past Xavf',
      score: 18,
      title: 'Hissiy zo‘riqish & Oila ichki kelishmovchilik',
      caseText: '«Turmush o‘rtog‘im bilan ko‘p janjallashyapmiz, meni tinglamaydi, doim charchaganman, lekin hech qanday jismoniy yoki moliyaviy tazyiq yo‘q.»',
      legalCitation: 'Oila kodeksi 4-moddasi (Oilaviy munosabatlarni o‘zaro hurmat va hamkorlik asosida qurish)',
      actionText: 'Psixologik maslahat va oilaviy mediator xizmatlaridan foydalanish tavsiya etiladi. 1146 bepul psixolog yordami mavjud.',
      badgeClass: 'badge-status-green',
      progressColor: 'bg-emerald-500',
      textColor: 'text-emerald-700',
    },
    yellow: {
      id: 'yellow',
      badge: 'O‘rta Xavf',
      score: 68,
      title: 'Ruhiy, iqtisodiy tazyiq & Doimiy nazorat',
      caseText: '«Telefondagi yozishmalarimni har kuni tekshiradi, ota-onamnikiga borishimni taqiqlaydi, ishdan bo‘shatib uyga qamab qo‘ymoqchi, pul bermaydi.»',
      legalCitation: 'O‘zR Qonuni № 561 «Xotin-qizlarni tazyiq va zo‘ravonlikdan himoya qilish to‘g‘risida» (3-modda)',
      actionText: 'Profilaktika inspektori yoki «Inson» markazidan 30 kunlik Himoya Orderi (Protection Order) olish huquqingiz bor.',
      badgeClass: 'badge-status-yellow',
      progressColor: 'bg-amber-500',
      textColor: 'text-amber-700',
    },
    red: {
      id: 'red',
      badge: 'Yuqori Xavf',
      score: 98,
      title: 'Jismoniy zo‘ravonlik & Hayotga bevosita tahdid',
      caseText: '«Kechasi eshikni qulflab pichoq bilan o‘ldirishga tahdid qildi, uydan haydab soldi. Bolalarim bilan ko‘chada qoldim, nima qilishni bilmayapman!»',
      legalCitation: 'O‘zR Jinoyat Kodeksi 112-moddasi (O‘ldirish bilan qo‘rqitish) & 126-1-moddasi (Oilaviy zo‘ravonlik)',
      actionText: 'ZUDLIK BILAN: 102 yoki 1146 ga qo‘ng‘iroq qiling! Tizim «Inson» markazi boshpanasi (Sheltir) manzilini beradi.',
      badgeClass: 'badge-status-red',
      progressColor: 'bg-rose-600',
      textColor: 'text-rose-700',
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const FAQS = [
    {
      q: "Mening yozganlarim serverda yoki ma'lumotlar bazasida saqlanadimi?",
      a: "Mutlaqo yo‘q. HimoyaAI qat’iy 'Zero-Log' (RAM-only) tamoyilida ishlaydi. Sahifani yopishingiz yoki 'Chiqish' tugmasini bosishingiz bilan operativ xotiradagi barcha matnlar bir zumda o‘chiriladi. Hech qanday ma’lumotlar bazasi, cookie yoki server logi yuritilmaydi."
    },
    {
      q: "Xizmatdan foydalanish bepulmi va ro‘yxatdan o‘tish kerakmi?",
      a: "Ha, platforma 100% bepul, ochiq va notijorat ijtimoiy xavfsizlik loyihasi hisoblanadi. Hech qanday ro‘yxatdan o‘tish, pasport yoki telefon raqami kiritish talab qilinmaydi."
    },
    {
      q: "Tahlil natijalari O‘zbekiston qonunchiligiga mos keladimi?",
      a: "Ha. Tizim O‘zbekiston Respublikasi Jinoyat Kodeksi (JK 112, 126-1, 141-3, 165) va 561-sonli «Xotin-qizlarni tazyiq va zo‘ravonlikdan himoya qilish to‘g‘risida»gi Qonun normalari asosida yuridik yo‘l xaritasini tuzib beradi."
    },
    {
      q: "Favqulodda holatda zudlik bilan nima qilish kerak?",
      a: "Agar hayotingizga yoki bolalaringizga bevosita xavf solinayotgan bo‘lsa, saytdagi 'Tezkor SOS' tugmasidan foydalaning yoki darhol 102 (Ichki ishlar) yoki 1146 (Milliy 24/7 ishonch telefoni) ga qo‘ng‘iroq qiling."
    }
  ];

  const currentPreset = SCENARIOS[activeScenario];

  return (
    <div className="py-6 sm:py-10 space-y-16 animate-fade-in text-slate-900">
      
      {/* 1. HERO SECTION (Executive, Dignified, World-Class) */}
      <section className="text-center space-y-6 max-w-4xl mx-auto pt-4 sm:pt-8">
        
        {/* Subtle Assurance Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-slate-700 text-xs font-heading font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span>O‘zbekiston Respublikasi • 100% Anonim & Zero-Log AI Tizimi</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-slate-900 leading-[1.12]">
          Xavfni erta aniqlash va <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
            to‘liq anonim huquqiy himoya
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-sans font-normal leading-relaxed">
          Xotin-qizlar va bolalar xavfsizligi uchun milliy sun’iy intellekt yo‘naltiruvchisi. Vaziyatingizni xolis tahlil qiling va zudlik bilan qonuniy yordam rejasini oling.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Link
            to="/describe"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-heading font-bold text-sm transition-all shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Vaziyatni tahlil qilish</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </Link>

          <button
            type="button"
            onClick={() => setIsScreenerOpen(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 text-slate-800 font-heading font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-600" />
            <span>1 daqiqalik test</span>
          </button>

          <Link
            to="/safewalk"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Car className="w-4 h-4 text-slate-300" />
            <span>SafeWalk hamrohi</span>
          </Link>
        </div>

        {/* Discreet Emergency Callout */}
        <div className="inline-flex items-center gap-2 text-xs text-slate-500 pt-1 font-sans">
          <span>Favqulodda holatda zudlik bilan:</span>
          <a href="tel:1146" className="text-slate-900 font-bold hover:underline">1146</a>
          <span>yoki</span>
          <a href="tel:102" className="text-rose-600 font-bold hover:underline">102</a>
        </div>
      </section>

      {/* 2. INTERACTIVE DIAGNOSTIC STUDIO (Clean, Professional Case Simulator) */}
      <section className="max-w-4xl mx-auto card-senior p-6 sm:p-8 space-y-6">
        
        {/* Studio Header & Segmented Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-base font-heading font-bold text-slate-900">
                Jonli AI Diagnostika Simulyatori
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Tipik vaziyatlar bo‘yicha tizim qanday xulosa berishini bevosita sinab ko‘ring:
            </p>
          </div>

          {/* Segmented Controls */}
          <div className="inline-flex bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 gap-1 self-start md:self-auto">
            <button
              onClick={() => setActiveScenario('green')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                activeScenario === 'green'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Past xavf (18%)
            </button>
            <button
              onClick={() => setActiveScenario('yellow')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                activeScenario === 'yellow'
                  ? 'bg-white text-amber-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              O‘rta xavf (68%)
            </button>
            <button
              onClick={() => setActiveScenario('red')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-heading font-bold transition-all cursor-pointer ${
                activeScenario === 'red'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yuqori xavf (98%)
            </button>
          </div>
        </div>

        {/* Active Scenario Card */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className={`text-xs font-heading font-bold px-3 py-1 rounded-full border ${currentPreset.badgeClass}`}>
                {currentPreset.badge} • {currentPreset.score}%
              </span>
              <span className="text-xs font-heading font-bold text-slate-800">
                {currentPreset.title}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Tahlilchi: Gemini 2.5 Flash
            </span>
          </div>

          {/* Progress gauge bar */}
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full ${currentPreset.progressColor} transition-all duration-500 rounded-full`}
              style={{ width: `${currentPreset.score}%` }}
            />
          </div>

          {/* Real snippet quote */}
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/70 text-slate-800 text-sm font-sans leading-relaxed italic">
            {currentPreset.caseText}
          </div>

          {/* Legal Citation & Recommended Action */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-heading font-bold text-slate-900 flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Huquqiy malaka (O‘zR Qonunchiligi):</span>
              </span>
              <p className="text-slate-600 pl-5.5 leading-relaxed">
                {currentPreset.legalCitation}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
              <span className="font-heading font-bold text-slate-900 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Tavsiya etilgan chora:</span>
              </span>
              <p className="text-slate-600 pl-5.5 leading-relaxed">
                {currentPreset.actionText}
              </p>
            </div>
          </div>
        </div>

        {/* Studio Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <span className="text-slate-500 font-sans flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>30 dan ortiq deterministik xavfsizlik filtrlari kafolatlangan.</span>
          </span>
          <div className="flex items-center gap-2">
            {activeScenario === 'red' && (
              <a
                href="tel:1146"
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-heading font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>1146 ga bepul qo‘ng‘iroq</span>
              </a>
            )}
            <Link
              to="/describe"
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>O‘z vaziyatingizni yozing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM ARCHITECTURE ASSURANCES (Executive Metrics Bar) */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div className="p-5 rounded-xl card-senior text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-slate-900">
            0 Bayt
          </p>
          <p className="text-xs text-slate-600 font-heading font-bold">
            Serverda log saqlanmaydi
          </p>
          <p className="text-[11px] text-slate-400 font-sans">
            To‘liq RAM-only (Zero-Log)
          </p>
        </div>

        <div className="p-5 rounded-xl card-senior text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-emerald-600">
            &lt; 700ms
          </p>
          <p className="text-xs text-slate-600 font-heading font-bold">
            AI Tahlil Tezligi
          </p>
          <p className="text-[11px] text-slate-400 font-sans">
            Gemini 2.5 Flash tahlili
          </p>
        </div>

        <div className="p-5 rounded-xl card-senior text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-slate-900">
            30+
          </p>
          <p className="text-xs text-slate-600 font-heading font-bold">
            Deterministik Qoidalar
          </p>
          <p className="text-[11px] text-slate-400 font-sans">
            Xatolikdan xoli xavfsizlik
          </p>
        </div>

        <div className="p-5 rounded-xl card-senior text-center space-y-1">
          <p className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-slate-900">
            14 Hudud
          </p>
          <p className="text-xs text-slate-600 font-heading font-bold">
            «Inson» Markazlari
          </p>
          <p className="text-[11px] text-slate-400 font-sans">
            Respublika bo‘ylab katalog
          </p>
        </div>
      </section>

      {/* 4. THREE CORE MODULES (Senior Functional Pillars) */}
      <section className="space-y-6 max-w-5xl mx-auto">
        <div className="text-center space-y-1.5">
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold tracking-tight text-slate-900">
            Asosiy Xavfsizlik Vositalari
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-sans max-w-xl mx-auto">
            Har qanday kutilmagan bosim yoki xavf yuzaga kelganda sizga hamroh bo‘luvchi maxfiy tizimlar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Card 1: AI Diagnostic */}
          <div className="p-6 rounded-2xl card-senior-interactive flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-base">
                  AI Diagnostika & Tahlil
                </h3>
                <span className="text-[11px] font-mono text-emerald-700 font-semibold block">
                  Gemini 2.5 Flash • Deterministik
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Matningizni O‘zbekiston qonunchiligi va 30+ xavfsizlik filtriga solishtiradi. Xavf darajasi, qonun moddasi va aniq qadamli harakatlar rejasini taqdim etadi.
              </p>
            </div>
            <Link
              to="/describe"
              className="text-xs font-heading font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 pt-2 border-t border-slate-100"
            >
              <span>Vaziyatni tasvirlash</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: SafeWalk */}
          <div className="p-6 rounded-2xl card-senior-interactive flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-base">
                  SafeWalk Safar Hamrohi
                </h3>
                <span className="text-[11px] font-mono text-slate-600 font-semibold block">
                  Aqlli Taymer • GPS Koordinata
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Kechki taksi yoki xilvat ko‘chada ketayotganda avtomatik monitoring. Belgilangan vaqt ichida yetib bormasangiz, yaqiningizga tayyor koordinata va signal yuboradi.
              </p>
            </div>
            <Link
              to="/safewalk"
              className="text-xs font-heading font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 pt-2 border-t border-slate-100"
            >
              <span>Taymerni sozlash</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 3: Evidence Locker */}
          <div className="p-6 rounded-2xl card-senior-interactive flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center border border-slate-200">
                <FolderLock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-slate-900 text-base">
                  Raqamli Dalillar Seyfi
                </h3>
                <span className="text-[11px] font-mono text-slate-600 font-semibold block">
                  JK 141-3 • JK 165 • Rasmiy Ariza
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Telegram, Instagramdagi shantaj yoki SMS tahdidlarni yuridik xronologiyaga tizimlashtiradi va sud/IIB organlariga topshirish uchun rasmiy ariza tuzadi.
              </p>
            </div>
            <Link
              to="/evidence"
              className="text-xs font-heading font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 pt-2 border-t border-slate-100"
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
            <h3 className="font-heading font-bold text-sm text-slate-900">
              Davlat va Nodavlat Yordam Tarmoqlari:
            </h3>
            <span className="text-xs text-slate-400 font-mono">24/7 Bepul</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 block font-heading font-bold text-base">1146</strong>
                <span className="text-slate-500 font-sans">Ayollar ishonch telefoni</span>
              </div>
              <a href="tel:1146" className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-heading font-bold border border-emerald-200">
                Qo‘ng‘iroq
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 block font-heading font-bold text-base">102</strong>
                <span className="text-slate-500 font-sans">Ichki ishlar (IIB)</span>
              </div>
              <a href="tel:102" className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-heading font-bold border border-rose-200">
                Qo‘ng‘iroq
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <strong className="text-slate-900 block font-heading font-bold text-base">"Madad" NNT</strong>
                <span className="text-slate-500 font-sans">Bepul huquqiy yordam</span>
              </div>
              <Link to="/resources" className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-heading font-bold border border-slate-200">
                Ko‘rish
              </Link>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-3">
          <div className="text-center pb-2">
            <h3 className="font-heading font-bold text-lg text-slate-900">
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
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-heading font-bold text-xs sm:text-sm text-slate-900 cursor-pointer hover:bg-slate-50/50 transition-colors"
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
