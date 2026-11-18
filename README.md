# HimoyaAI — Anonim Xavfsizlik Baholash va Yo‘naltirish Tizimi

> Maxsus **"Raqamli avlod qizlari"** tanlovi uchun ishlab chiqilgan ishlab chiqarish (production-grade) darajasidagi xavfsiz tizim.

---

## 📌 Loyiha Haqida

**HimoyaAI** — O‘zbekistonda tazyiq, ruhiy bosim, iqtisodiy nazorat yoki jismoniy zo‘ravonlik xavfiga duch kelayotgan xotin-qizlar uchun 100% anonim, bepul va xolis dastlabki baholash platformasidir.

### Asosiy Xususiyatlar:
- **Gibrid Sun'iy Intellekt va Deterministik Xavfsizlik Qatlami:** Agar foydalanuvchi matnida o'ldirish tahdidi, pichoq, qurol, bo'g'ish, kaltaklash yoki qamab qo'yish kabi xavfli belgilar aniqlansa, xavf darajasi qat'iy **QIZIL (RED)** darajaga ko'tariladi. LLM modeli bu darajani aslo tushira olmaydi.
- **Qat'iy Zero-Log Maxfiylik Siyosati:** Tizimda ma'lumotlar bazasi (DB) yo'q. Yozilgan matnlar faqat operativ xotirada (RAM) saqlanadi. `localStorage`, `sessionStorage` yoki `cookies` kabi mahalliy omborlarga hech narsa yozilmaydi.
- **Kamuflaj va Tezkor Chiqish (Panic Button):** Brauzer vkladkasi begonalar e'tiborini tortmaslik uchun *"Eslatmalar — Shaxsiy qaydlar"* nomi bilan niqoblangan. Har qanday sahifada **"Tezkor chiqish"** tugmasini bosganda yoki klaviaturada **Escape** tugmasini 2 marta tez bosganda barcha xotira tozalanib, foydalanuvchi darhol Google sahifasiga yo'naltiriladi.
- **Ko'p Kanallilik (Dual-Platform):** Bitta kod bazasi bir vaqtning o'zida ham zamonaviy veb-sayt, ham Telegram Mini App sifatida to'laqonli ishlaydi.
- **Telegram Bot Hamrohi:** Foydalanuvchi Telegram botida oddiy xabar yozganda ham aynan shu umumiy xavfsizlik tahlil mexanizmi orqali professional xulosa oladi.

---

## 🛠 Texnologiyalar To'plami

- **Foydalanuvchi interfeysi (Frontend):** React 18, Vite, JavaScript, Tailwind CSS (`darkMode: 'class'`), React Router v6, Lucide React piktogrammalari.
- **Server va Xavfsiz Proksi (Backend):** Node.js Express, Rate-limiter (har bir IP uchun 15 daqiqada 30 ta so'rov), CSP va no-referrer xavfsizlik sarlavhalari, so'rov tanasini (request body) jurnallamaslik kafolati.
- **Telegram Integratsiyasi:** Telegram WebApp SDK (`ready()`, `expand()`, `BackButton`, rang mavzusi sinxronizatsiyasi) hamda Telegraf boti.
- **Shriftlar:** Source Serif 4 (sarlavhalar uchun nafis editorial serif) va Inter (matnlar uchun tiniq sans-serif), o'zbek tilidagi `o‘`, `g‘`, `sh`, `ch` harflarini to'liq qo'llab-quvvatlaydi.

---

## 📁 Loyiha Tuzilmasi

```
HimoyaAi/
├── bot/
│   └── index.js             # Telegraf boti (/start, web_app ochish, to'g'ridan-to'g'ri matn tahlili)
├── lib/
│   ├── safetyRules/
│   │   └── index.js         # Deterministik xavfsizlik qatlami (O'zbek/Rus kalit so'zlari va qoliplari)
│   └── analysis/
│       └── index.js         # Gibrid tahlil mexanizmi va LLM JSON sxemasi nazorati
├── server/
│   └── index.js             # Express xavfsiz proksi serveri (Zero-log, rate-limit, CSP)
├── src/
│   ├── components/
│   │   ├── Header.jsx       # Naqd brend, navigatsiya, qorong'i/yorug' rejim almashuvi
│   │   ├── PanicButton.jsx  # "Tezkor chiqish" tugmasi (Esc + Esc)
│   │   ├── RiskIndicator.jsx# Xavf darajasi aylanma o'lchagichi (foiz + belgi + rang)
│   │   ├── SosAlertCard.jsx # Qizil xavfda eng yuqoriga chiqadigan tezkor SOS bloki
│   │   ├── ContactCard.jsx  # 1146, 102, Inson markaziga bir bosishda qo'ng'iroq
│   │   ├── EmergencyFooter.jsx # Har doim ko'rinib turuvchi shoshilinch raqamlar
│   │   └── SkipLink.jsx     # Klaviaturada foydalanuvchilar uchun qulaylik
│   ├── context/
│   │   └── AssessmentContext.jsx # Faqat RAM xotirada ishlovchi React konteksti
│   ├── pages/
│   │   ├── Home.jsx         # Bosh sahifa (1 ta sarlavha, 3 ta ishonch belgisi)
│   │   ├── Describe.jsx     # Vaziyatni tasvirlash (katta maydon, 5 ta tezkor toifa)
│   │   ├── Result.jsx       # Tahlil natijasi (xulosa, belgilar, amaliy qadamlar, kontaktlar)
│   │   ├── Resources.jsx    # Barcha yordam resurslari va Himoya orderi yo'riqnomasi
│   │   └── Privacy.jsx      # Zero-log siyosati va inkognito rejim tavsiyalari
│   ├── services/
│   │   └── api.js           # API muloqoti va oflayn deterministik zaxira mexanizmi
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── tests/
│   └── safetyRules.test.js  # 15 ta sinov holati (Qizil, Sariq, Yashil bo'yicha)
├── DEMO_SCRIPT.md           # Tanlov hay'ati uchun 2 daqiqalik taqdimot matni
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🚀 Ishga Tushirish (Local Setup)

### 1. Bog'liqliklarni o'rnatish
```bash
npm install
```

### 2. Muhit o'zgaruvchilarini sozlash
`.env.example` faylidan nusxa olib, `.env` faylini yarating:
```bash
cp .env.example .env
```
Parametrlarni o'zingizga moslang (LLM API kaliti yoki bot tokeni bo'lmasa ham tizim to'liq mustahkam ishlayveradi).

### 3. Deterministik xavfsizlik testlarini tekshirish
```bash
npm test
```
*(Barcha 15 ta O'zbek tili testlari muvaffaqiyatli o'tishini ko'rasiz)*

### 4. Dasturni ishga tushirish

**Frontend (Vite dev server):**
```bash
npm run dev
```
Brauzerda: `http://localhost:5173`

**Backend proksi serveri (Express):**
```bash
npm run server
```
Server `http://localhost:3001` portida ishga tushadi.

**Telegram Botini ishga tushirish (ixtiyoriy):**
```bash
npm run bot
```

---

## 🤖 Telegram Mini App qilib ulash (BotFather orqali)

1. Telegramda [@BotFather](https://t.me/BotFather) ga o'ting.
2. Yangi bot ochish uchun `/newbot` buyrug'ini bering, botga nom va username tanlang.
3. Bot yaratilgach berilgan `API Token`ni oling va `.env` faylidagi `TELEGRAM_BOT_TOKEN`ga qo'ying.
4. Mini App yaratish uchun BotFatherga `/newapp` buyrug'ini yuboring.
5. Botni tanlang, ilovaga nom va rasm yuklang.
6. **Web App URL** so'ralganda o'z loyihangizning joylashtirilgan veb-manzilini (masalan: `https://himoyaai.vercel.app`) kiriting.
7. Bot menyusiga WebApp tugmasini qo'shish uchun `/setmenubutton` buyrug'i orqali ilova havolasini biriktiring.

---

## 🌐 Serverga Joylashtirish (Deployment)

### Vercel / Netlify (Frontend & Serverless):
1. Ushbu omborni GitHub orqali Vercel/Netlify'ga ulang.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variables bo'limiga `GEMINI_API_KEY` yoki `OPENAI_API_KEY`ni kiriting.

### Docker / Render / VPS (Node.js Fullstack):
1. `npm run build` orqali static fayllarni hosil qiling.
2. `node server/index.js` orqali Express backendini yurgizing.
3. Botni `node bot/index.js` orqali `pm2` yordamida fonga o'tkazing:
   ```bash
   pm2 start server/index.js --name "himoya-server"
   pm2 start bot/index.js --name "himoya-bot"
   ```

---

## ⚖️ Litsenziya va Ijtimoiy Mas'uliyat

Ushbu dastur xotin-qizlar xavfsizligini oshirish maqsadida yaratilgan ochiq manbali ijtimoiy tashabbusdir. Tizim tibbiy yoki sud ekspertizasi o'rnini bosmaydi, balki birinchi navbatda xavfni to'g'ri baholab, davlatning ixtisoslashgan organlariga yo'naltiruvchi ko'prik vazifasini bajaradi.
