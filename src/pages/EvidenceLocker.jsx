import React, { useState } from 'react';
import { 
  FolderLock, 
  ShieldAlert, 
  FileText, 
  Download, 
  Printer, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Scale, 
  Calendar, 
  User, 
  AtSign,
  Copy,
  Info,
  Terminal,
  Check
} from 'lucide-react';

const PLATFORMS = [
  { id: 'telegram', label: 'Telegram' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'phone', label: 'SMS / Qo‘ng‘iroq' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'offline', label: 'Ish / O‘qish / Ko‘cha' },
];

export default function EvidenceLocker() {
  const [platform, setPlatform] = useState('telegram');
  const [suspectInfo, setSuspectInfo] = useState('');
  const [threatType, setThreatType] = useState('blackmail_photos');
  const [demandDetails, setDemandDetails] = useState('');
  const [records, setRecords] = useState([
    { id: 1, date: new Date().toISOString().split('T')[0], time: '14:30', description: 'Birinchi tahdidli xabar keldi va pul talab qilindi' }
  ]);
  const [isCopied, setIsCopied] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const addRecord = () => {
    setRecords((prev) => [
      ...prev,
      { id: Date.now(), date: new Date().toISOString().split('T')[0], time: '18:00', description: '' }
    ]);
  };

  const removeRecord = (id) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRecord = (id, field, value) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // Generate formal legal report
  const generateReportText = () => {
    const today = new Date().toLocaleDateString('uz-UZ');
    const recordsText = records
      .filter((r) => r.description.trim())
      .map((r, i) => `${i + 1}. Sana: ${r.date}, Vaqt: ${r.time}\n   Voqea: ${r.description}`)
      .join('\n\n');

    return `O‘ZBEKISTON RESPUBLIKASI ICHKI ISHLAR VAZIRLIGIGA / PROKURATURA ORGANLARIGA
FUQARODAN ARIZA (DALILLAR BILAN)

Menga nisbatan quyidagi tazyiq va tahdid harakatlari sodir etilmoqda:

1. ALOQA VOSITASI VA GUMONLANUVCHI:
- Platforma: ${PLATFORMS.find((p) => p.id === platform)?.label || platform}
- Gumonlanuvchi profilingiz/raqami: ${suspectInfo || 'Noma\'lum profil'}
- Tahdid tasnifi: ${
  threatType === 'blackmail_photos'
    ? 'Shaxsiy fotosuratlar/videolarni tarqatish tahdidi (JK 141-3-modda)'
    : threatType === 'extortion_money'
    ? 'Pul yoki mulk talab qilish / tovlamachilik (JK 165-modda)'
    : threatType === 'death_threat'
    ? 'Hayotga yoki sog‘liqqa tahdid / o‘ldirish bilan qo‘rqitish (JK 112-modda)'
    : 'Ta\'qib qilish va doimiy kuzatish'
}

2. QO‘YILGAN NOQONUNIY TALABLAR VA MAZMUNI:
${demandDetails || 'Ushbu shaxs shaxsiy fotosuratlarimni tarmoqlarda tarqatish bilan qo‘rqitib, pul talab qilmoqda va muntazam bosim o‘tkazmoqda.'}

3. XRONOLOGIK DALILLAR RO‘YXATI (Skrinshotlar mavjud):
${recordsText || 'Dalillar xronologiyasi ilova qilinadi.'}

4. HUQUQIY ASOS VA JAVOBGARLIK:
Ushbu noqonuniy harakatlar O‘zbekiston Respublikasi Jinoyat Kodeksining tegishli moddalari (JK 141-3, JK 165, JK 112) bilan taqiqlangan bo‘lib, jinoiy javobgarlikka sabab bo‘ladi.

Iltimos, ushbu shaxsning noqonuniy xatti-harakatlariga nisbatan qonuniy chora ko‘rishingizni va mening shaxsiy xavfsizligimni ta’minlashingizni so‘rayman.

Sana: ${today}
Ariza tayyorlandi: HimoyaAI "Raqamli Dalillar Seyfi" orqali (Client-Side, Maxfiy)`;
  };

  const handleCopy = () => {
    const text = generateReportText();
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="py-4 sm:py-8 max-w-5xl mx-auto space-y-8 animate-fade-in text-slate-900">
      
      {/* Header */}
      <div className="card-senior p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
            <FolderLock className="w-4 h-4 text-emerald-600" />
            <span>Raqamli Dalillar Seyfi (Evidence Locker)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-heading font-extrabold tracking-tight text-slate-900">
            Dalillar Seyfi va Ariza Konstruktori
          </h1>
          <p className="text-xs sm:text-sm font-sans text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Telegram, Instagram yoki telefonda shantaj, fotosuratlarni tarqatish tahdidi yoki tovlamachilikka duch keldingizmi? Dalillarni yuridik jihatdan to‘g‘ri tizimlashtiring va IIB/Sud organlari uchun rasmiy arizani tayyorlang.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono font-bold text-slate-700 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Client-Side / Serverga yozilmaydi</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Incident Details Form */}
        <div className="lg:col-span-2 card-senior p-6 sm:p-8 space-y-6">
          <h2 className="text-base font-heading font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-600" />
            <span>Tazyiq va Tahdid Tafsilotlari</span>
          </h2>

          {/* Platform selection */}
          <div className="space-y-2">
            <label className="text-xs font-heading font-bold text-slate-700 uppercase tracking-wider block">
              Voqea qaysi platformada yuz bermoqda?
            </label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-heading font-bold border transition-all cursor-pointer ${
                    platform === p.id
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Suspect info */}
          <div>
            <label className="text-xs font-heading font-bold text-slate-700 block mb-1.5 uppercase">
              Gumonlanuvchining profili yoki telefon raqami (agar ma'lum bo'lsa)
            </label>
            <input
              type="text"
              value={suspectInfo}
              onChange={(e) => setSuspectInfo(e.target.value)}
              placeholder="@tahdidchi_profil yoki +998 90 987 65 43"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none bg-white font-mono shadow-xs"
            />
          </div>

          {/* Threat Type */}
          <div>
            <label className="text-xs font-heading font-bold text-slate-700 block mb-1.5 uppercase">
              Tahdid turi
            </label>
            <select
              value={threatType}
              onChange={(e) => setThreatType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none bg-white font-sans shadow-xs cursor-pointer"
            >
              <option value="blackmail_photos">Shaxsiy fotosuratlar/videolarni tarqatish bilan shantaj (JK 141-3)</option>
              <option value="extortion_money">Pul yoki moddiy boylik talab qilish / tovlamachilik (JK 165)</option>
              <option value="death_threat">Hayotga yoki sog‘liqqa tahdid / o‘ldirish bilan qo‘rqitish (JK 112)</option>
              <option value="stalking">Ta'qib qilish, doimiy kuzatish va ruhiy bezovta qilish</option>
            </select>
          </div>

          {/* Demand description */}
          <div>
            <label className="text-xs font-heading font-bold text-slate-700 block mb-1.5 uppercase">
              Qo‘yilayotgan talablar va nima sodir bo‘ldi?
            </label>
            <textarea
              rows={3}
              value={demandDetails}
              onChange={(e) => setDemandDetails(e.target.value)}
              placeholder="Masalan: Telegramda soxta profildan yozib, eski fotosuratlarni guruhlarga tarqatish bilan qo‘rqitmoqda va 500 dollar talab qilmoqda..."
              className="w-full p-4 rounded-xl border border-slate-300 text-slate-900 placeholder:text-slate-400 text-sm focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 outline-none bg-white font-sans shadow-xs"
            />
          </div>

          {/* Chronological Evidence Log */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-heading font-bold text-slate-700 uppercase tracking-wider block">
                Xronologik dalillar va skrinshotlar ro‘yxati:
              </label>
              <button
                type="button"
                onClick={addRecord}
                className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-heading font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yangi voqea qo‘shish</span>
              </button>
            </div>

            <div className="space-y-3">
              {records.map((r, index) => (
                <div key={r.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-mono font-bold text-slate-600">
                      Voqea #{index + 1}
                    </span>
                    {records.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRecord(r.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>O‘chirish</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      value={r.date}
                      onChange={(e) => updateRecord(r.id, 'date', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                    />
                    <input
                      type="time"
                      value={r.time}
                      onChange={(e) => updateRecord(r.id, 'time', e.target.value)}
                      className="px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                    />
                  </div>

                  <input
                    type="text"
                    value={r.description}
                    onChange={(e) => updateRecord(r.id, 'description', e.target.value)}
                    placeholder="Nima bo‘ldi? (Skrinshot olindi, audio xabar saqlandi...)"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-800 bg-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setIsGenerated(true)}
              className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-heading font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Rasmiy Ariza Matnini Shakllantirish</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Legal Explanations */}
        <div className="space-y-4">
          <div className="card-senior p-6 space-y-4">
            <h3 className="text-sm font-heading font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>O‘zbekiston Qonunchiligi</span>
            </h3>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
              <strong className="text-slate-900 block font-heading">JK 141-3-modda</strong>
              <p className="leading-relaxed font-sans">
                Shaxsiy hayot daxlsizligini buzish: shaxsning roziligisiz shaxsiy hayotini aks ettiruvchi foto/videolarni oshkor qilish yoki tarqatish bilan qo‘rqitish jinoiy javobgarlikka (3 yilgacha ozodlikdan mahrum qilish) sabab bo‘ladi.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-700">
              <strong className="text-slate-900 block font-heading">JK 165-modda</strong>
              <p className="leading-relaxed font-sans">
                Tovlamachilik (shantaj): jabrlanuvchini sharmanda qiladigan uydirmalar tarqatish tahdidi bilan mulk yoki pul talab qilish 3 yildan 5 yilgacha jinoiy jazo choralarini nazarda tutadi.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
            <p className="font-heading font-bold flex items-center gap-1.5 text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Muhim: Yozishmalarni o‘chirmang!</span>
            </p>
            <p className="leading-relaxed font-sans">
              Tazyiqchi chatni o‘chirib yuborishidan oldin darhol barcha yozishmalarning to‘liq skrinshotini (profil ID si va sana ko‘rinadigan qilib) oling. Shaxsiy fotosurat yoki pul berishga aslo rozi bo‘lmang — bu tahdidni to‘xtatmaydi, aksincha kuchaytiradi!
            </p>
          </div>
        </div>
      </div>

      {/* Generated Report Dossier Box */}
      {isGenerated && (
        <div className="card-senior p-6 sm:p-8 space-y-4 border-emerald-300 bg-emerald-50/20 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-heading font-bold text-slate-900">
                Tayyor Rasmiy Yuridik Ariza Dosyesi
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{isCopied ? "Nusxalandi!" : "Matnni nusxalash"}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-heading font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Chop etish (PDF)</span>
              </button>
            </div>
          </div>

          <pre className="p-5 rounded-xl bg-white border border-slate-200 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed overflow-x-auto shadow-xs">
            {generateReportText()}
          </pre>
        </div>
      )}
    </div>
  );
}
