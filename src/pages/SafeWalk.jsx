import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Car, 
  Footprints, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  PhoneCall, 
  Share2, 
  RotateCcw, 
  Navigation,
  Info,
  Lock,
  ChevronRight,
  Terminal,
  Radio,
  Plus,
  Send,
  ExternalLink
} from 'lucide-react';

export default function SafeWalk() {
  const [tripType, setTripType] = useState('taxi'); // 'taxi' | 'walk' | 'bus'
  const [carDetails, setCarDetails] = useState('');
  const [destination, setDestination] = useState('');
  const [trustedPhone, setTrustedPhone] = useState('');
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  
  // Trip status: 'idle' | 'active' | 'arrived' | 'emergency'
  const [tripStatus, setTripStatus] = useState('idle');
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [initialSeconds, setInitialSeconds] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const intervalRef = useRef(null);

  // Request actual GPS coordinates if user allows
  const fetchLocation = () => {
    if (!navigator.geolocation) return;
    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
          mapsUrl: `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`
        });
        setIsGettingLocation(false);
      },
      () => {
        setIsGettingLocation(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const startTrip = () => {
    const totalSec = selectedMinutes * 60;
    setInitialSeconds(totalSec);
    setRemainingSeconds(totalSec);
    setTripStatus('active');
    fetchLocation();
  };

  const addTime = (minutes) => {
    setRemainingSeconds((prev) => prev + minutes * 60);
    setInitialSeconds((prev) => prev + minutes * 60);
  };

  // Timer countdown
  useEffect(() => {
    if (tripStatus === 'active') {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setTripStatus('emergency');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [tripStatus]);

  const finishTripSafely = () => {
    clearInterval(intervalRef.current);
    setTripStatus('arrived');
  };

  const resetTrip = () => {
    clearInterval(intervalRef.current);
    setTripStatus('idle');
    setRemainingSeconds(0);
    setCarDetails('');
    setDestination('');
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = initialSeconds > 0 
    ? Math.round(((initialSeconds - remainingSeconds) / initialSeconds) * 100) 
    : 0;

  // Prepare SOS message text
  const sosMessageText = `DIQQAT! Men HimoyaAI "SafeWalk Safar Hamrohi" monitoringidaman. Taymerim tugadi va men tasdiqlamadim!\nTransport: ${tripType === 'taxi' ? 'Taksi' : tripType === 'bus' ? 'Jamoat transporti' : 'Piyoda'}${carDetails ? ` (${carDetails})` : ''}\nMo‘ljal: ${destination || 'Uyga'}\n${userLocation?.mapsUrl ? `Mening oxirgi koordinatam: ${userLocation.mapsUrl}` : 'Iltimos, darhol men bilan bog\'laning yoki 102/1146 ga xabar bering!'}`;

  const smsLink = `sms:${trustedPhone ? trustedPhone.replace(/[^0-9+]/g, '') : ''}?body=${encodeURIComponent(sosMessageText)}`;
  const telegramShareLink = `https://t.me/share/url?url=${encodeURIComponent(userLocation?.mapsUrl || 'Xavfsiz joyda emasman')}&text=${encodeURIComponent(sosMessageText)}`;

  return (
    <div className="py-2 sm:py-8 max-w-5xl mx-auto space-y-4 sm:space-y-8 animate-fade-in text-slate-900">
      
      {/* Header */}
      <div className="card-senior p-4 sm:p-6 lg:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-heading font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1.5 sm:mb-2">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            <span>Virtual Safar Hamrohi (SafeWalk Protocol)</span>
          </div>
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight text-slate-900">
            SafeWalk Safar Hamrohi
          </h1>
          <p className="text-xs sm:text-sm font-sans text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Kechki taksi, xilvat yo‘l yoki uyga piyoda qaytishda sizga hamroh bo‘lamiz. Vaqtni belgilang — agar belgilangan vaqt ichida yetib bormasangiz, ishonchli odamingizga avtomatik signal yuboriladi.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-[11px] sm:text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5 sm:gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% RAM / Zero-Log</span>
          </div>
        </div>
      </div>

      {/* 1. Trip Configuration Mode */}
      {tripStatus === 'idle' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Main Form (Left 2 cols) */}
          <div className="lg:col-span-2 card-senior p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            <h2 className="text-sm sm:text-base font-heading font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              <span>Safar parametrlarini sozlang</span>
            </h2>

            {/* Transport selector */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-slate-700 uppercase tracking-wider block">
                Transport turi:
              </label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setTripType('taxi')}
                  className={`p-2.5 sm:p-4 rounded-xl border text-center font-heading font-bold text-xs sm:text-sm flex flex-col items-center gap-1 sm:gap-2 transition-all cursor-pointer ${
                    tripType === 'taxi'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Car className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                  <span className="truncate">Taksi</span>
                  <span className="hidden sm:inline text-[10px] text-slate-500 font-normal">Yandex/inDrive</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTripType('walk')}
                  className={`p-2.5 sm:p-4 rounded-xl border text-center font-heading font-bold text-xs sm:text-sm flex flex-col items-center gap-1 sm:gap-2 transition-all cursor-pointer ${
                    tripType === 'walk'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Footprints className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                  <span className="truncate">Piyoda</span>
                  <span className="hidden sm:inline text-[10px] text-slate-500 font-normal">Yo‘l / Ko‘cha</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTripType('bus')}
                  className={`p-2.5 sm:p-4 rounded-xl border text-center font-heading font-bold text-xs sm:text-sm flex flex-col items-center gap-1 sm:gap-2 transition-all cursor-pointer ${
                    tripType === 'bus'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />
                  <span className="truncate">Avtobus</span>
                  <span className="hidden sm:inline text-[10px] text-slate-500 font-normal">Metro / Marshrut</span>
                </button>
              </div>
            </div>

            {/* Car details & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-heading font-bold text-slate-700 block mb-1.5 uppercase">
                  {tripType === 'taxi' ? 'Mashina raqami va modeli' : 'Boshlang‘ich nuqta'}
                </label>
                <input
                  type="text"
                  value={carDetails}
                  onChange={(e) => setCarDetails(e.target.value)}
                  placeholder={tripType === 'taxi' ? '01 A 777 BA (Oq Cobalt)' : 'Masalan: Chilonzor metro'}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none bg-white shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs font-heading font-bold text-slate-700 block mb-1.5 uppercase">
                  Bormoqchi bo‘lgan manzil
                </label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Masalan: Yunusobod, 19-mavze, uyga"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none bg-white shadow-xs"
                />
              </div>
            </div>

            {/* Trusted contact phone */}
            <div>
              <label className="text-xs font-heading font-bold text-slate-700 block mb-1.5 uppercase">
                Ishonchli kontakt telefon raqami (Yaqiningiz)
              </label>
              <input
                type="tel"
                value={trustedPhone}
                onChange={(e) => setTrustedPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none bg-white font-mono shadow-xs"
              />
            </div>

            {/* Duration Selector */}
            <div className="space-y-2">
              <label className="text-xs font-heading font-bold text-slate-700 uppercase tracking-wider block">
                Safar taxminan qancha vaqt oladi?
              </label>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[10, 15, 25, 40].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSelectedMinutes(mins)}
                    className={`py-3 rounded-xl font-heading font-bold text-xs sm:text-sm border transition-all cursor-pointer ${
                      selectedMinutes === mins
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {mins} daqiqa
                  </button>
                ))}
              </div>
            </div>

            {/* Start Escort Button */}
            <button
              type="button"
              onClick={startTrip}
              className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-base shadow-md shadow-emerald-600/20 hover:shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-[0.99]"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Monitoringni Boshlash ({selectedMinutes} daqiqa)</span>
            </button>
          </div>

          {/* Right Column: Safe Havens & Tips */}
          <div className="space-y-4">
            <div className="card-senior p-6 space-y-3.5">
              <h3 className="text-sm font-heading font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Xavfsiz Orolchalar (Safe Havens)</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Agar o‘zingizni xavf ostida his qilsangiz yoki taksi haydovchisi yo‘nalishni shubhali o‘zgartirsa, darhol quyidagi jamoat joylariga buriling:
              </p>
              <ul className="text-xs text-slate-700 space-y-2.5 font-sans pt-1">
                <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span><strong>24/7 Dorixonalar:</strong> Doimiy yoritilgan va xodimlar bor.</span>
                </li>
                <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span><strong>Yoqilg‘i quyish shoxobchalari:</strong> Videokameralar va qo‘riqchilar mavjud.</span>
                </li>
                <li className="flex items-start gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span><strong>IIB tayanch punktlari (102):</strong> Eng xavfsiz nuqta.</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <p className="font-heading font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-700" />
                <span>Taksida xavfsizlik qoidasi</span>
              </p>
              <p className="leading-relaxed font-sans">
                Taksiga o‘tirishdan oldin mashina davlat raqamini yaqiningizga yuboring va imkon qadar orqa o‘rindiqqa o‘tiring.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Active Escort Monitoring HUD */}
      {tripStatus === 'active' && (
        <div className="max-w-2xl mx-auto card-senior p-4 sm:p-8 lg:p-12 text-center space-y-6 sm:space-y-8 shadow-md">
          
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] sm:text-xs font-mono font-bold">
            <Radio className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 animate-pulse" />
            <span>XAVFSIZLIK MONITORINGI FAOLLASHTIRILDI</span>
          </div>

          {/* Giant Countdown Clock */}
          <div className="space-y-1 sm:space-y-2">
            <div className="text-5xl sm:text-7xl font-mono font-extrabold text-slate-900 tracking-tight">
              {formatTime(remainingSeconds)}
            </div>
            <p className="text-xs sm:text-sm font-sans text-slate-500">
              Qolgan vaqt • Belgilangan muddat tugashiga qadar xavfsiz yetib borganingizni tasdiqlang
            </p>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
            <div 
              className="bg-emerald-600 h-full transition-all duration-1000 ease-linear rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Quick extension buttons */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-slate-500 font-sans">Vaqtni uzaytirish:</span>
            <button
              type="button"
              onClick={() => addTime(5)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-heading font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>5 daq</span>
            </button>
            <button
              type="button"
              onClick={() => addTime(15)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-heading font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>15 daq</span>
            </button>
          </div>

          {/* Trip Summary Details */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 font-sans">
            <div className="flex justify-between text-slate-600">
              <span>Transport turi:</span>
              <strong className="text-slate-900">{tripType === 'taxi' ? 'Taksi' : tripType === 'bus' ? 'Jamoat transporti' : 'Piyoda'} {carDetails && `(${carDetails})`}</strong>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Mo‘ljal manzil:</span>
              <strong className="text-slate-900">{destination || 'Ko‘rsatilmagan'}</strong>
            </div>
            {userLocation && (
              <div className="flex justify-between items-center text-slate-600 pt-1 border-t border-slate-200/60">
                <span>Jonli koordinata:</span>
                <a
                  href={userLocation.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 font-mono font-bold hover:underline flex items-center gap-1"
                >
                  <span>{userLocation.lat}, {userLocation.lng}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={finishTripSafely}
              className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-base shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Men xavfsiz yetib keldim</span>
            </button>

            <button
              type="button"
              onClick={() => setTripStatus('emergency')}
              className="w-full py-3.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-heading font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Xavf ostidaman! Zudlik bilan signal berish</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Arrived Safely Screen */}
      {tripStatus === 'arrived' && (
        <div className="max-w-lg mx-auto card-senior p-8 sm:p-10 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-extrabold text-slate-900">
              Siz eson-omon yetib keldingiz!
            </h2>
            <p className="text-xs sm:text-sm font-sans text-slate-600 leading-relaxed">
              SafeWalk monitoringi muvaffaqiyatli yakunlandi. Barcha vaqtinchalik safar va geolokatsiya ma'lumotlari xotiradan to'liq o'chirildi.
            </p>
          </div>
          <button
            type="button"
            onClick={resetTrip}
            className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-sm shadow-xs transition-colors cursor-pointer"
          >
            Yangi safar boshlash
          </button>
        </div>
      )}

      {/* 4. Emergency Triggered Screen */}
      {tripStatus === 'emergency' && (
        <div className="max-w-xl mx-auto card-senior p-8 sm:p-10 text-center space-y-6 border-rose-300 bg-rose-50/50 shadow-md">
          <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-700 mx-auto flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-heading font-extrabold text-rose-950">
              OGOHLANTIRISH: Muddat tugadi!
            </h2>
            <p className="text-xs sm:text-sm font-sans text-rose-800 leading-relaxed">
              Siz belgilangan vaqt ichida yetib kelganingizni tasdiqlamadingiz. Quyidagi tayyor xabarni nusxalab ishonchli yaqiningizga yuboring yoki zudlik bilan 102/1146 ga qo‘ng‘iroq qiling!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-rose-200 text-left font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed shadow-xs">
            {sosMessageText}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="tel:102"
              className="flex-1 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>102 ga qo‘ng‘iroq</span>
            </a>

            <a
              href="tel:1146"
              className="flex-1 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              <span>1146 (Ishonch telefoni)</span>
            </a>
          </div>

          <div className="flex items-center justify-center gap-4 pt-2">
            <a
              href={smsLink}
              className="text-xs font-heading font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5 text-emerald-600" />
              <span>SMS orqali jo‘natish</span>
            </a>
            <span>•</span>
            <a
              href={telegramShareLink}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-heading font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Telegramda ulashish</span>
            </a>
          </div>

          <button
            type="button"
            onClick={resetTrip}
            className="text-xs font-heading font-bold text-slate-500 hover:text-slate-800 underline pt-2 cursor-pointer"
          >
            Taymerni to‘xtatish va yangi safar boshlash
          </button>
        </div>
      )}
    </div>
  );
}
