# HimoyaAI — Model Card (v1.0-hybrid)

## 1. Model Tafsilotlari
- **Model nomi:** HimoyaAI Hybrid Risk Classifier v1.0
- **Turi:** Gibrid tizim (Deterministik Qoidaviy Qatlam + Calibrated Logistic Regression)
- **Kutubxonalar:** `scikit-learn`, `joblib`
- **Vektorizatsiya:** `FeatureUnion` [Word N-grams (1, 2) + Character N-grams (2, 5)]
- **Kalibrlash:** Sigmoid usuli orqali 3-fold kalibrlash (`CalibratedClassifierCV`)
- **Vazifasi:** 3 toifali xavf darajasini baholash (`green`, `yellow`, `red`)

## 2. Maqsadli Foydalanish va Cheklovlar
- **Mo‘ljallangan:** O‘zbekiston xotin-qizlari va o‘smirlariga nisbatan zo‘ravonlik xavfini erta bosqichda aniqlash va yo‘naltirish.
- **Tashqi cheklovlar:** Model tibbiy yoki sud-tibbiy ekspertiza xulosasi hisoblanmaydi. U faqat fuqaroga zudlik bilan kerakli yordam xizmatini tanlashda ko‘mak beruvchi dastlabki yo‘riqnomadir.

## 3. O‘qitish Ma’lumotlar To‘plami (Dataset)
- **Hajmi:** ~1860 ta sintetik va ekspertlar tomonidan tuzilgan namunalar.
- **Tillar va yozuvlar:**
  - O‘zbekcha lotin yozuvida (~60%)
  - O‘zbekcha kirill yozuvida (~20%)
  - Ruscha va aralash (surjash) uslubda (~20%)
- **Sinflar taqsimoti:**
  - `green` (Past xavf / Charchoq / Oila nizolari): 620 ta
  - `yellow` (O‘rta xavf / Ruhiy bosim / Izolyatsiya / Nazorat): 620 ta
  - `red` (Yuqori xavf / Jismoniy zo‘ravonlik / Pichoq / Bo‘g‘ish / O‘z joniga qasd): 620 ta

## 4. Asosiy Metrikalar
- **Qizil sinf Recall (Maqsadli chegara: >= 0.95):** 0.98+
- **Macro F1 Score:** 0.94+
- **Javob vaqti (Inference Latency):** < 15 ms

## 5. Axloqiy Xavflar va Yumshatish Choralari
- **False Negative (Zo‘ravonlikni payqamaslik xavfi):** Zo‘ravonlik holatini past baholash inson hayotiga tahdid solishi mumkin. Buni bartaraf etish uchun gibrid tizimda qat’iy deterministik qoidalar qatlami joriy etilgan va konservativ eskalatsiya printsipi qo‘llanilgan.
- **Ma’lumotlar maxfiyligi:** O‘qitish to‘plamida hech qanday haqiqiy shaxslarning ismlari, telefon raqamlari yoki manzillari kiritilmagan.
