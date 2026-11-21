# HimoyaAI — Maxfiylik va No-Log Siyosati (Privacy Architecture)

> «Raqamli avlod qizlari» tanlovi doirasida axloqiy va huquqiy xavfsizlik standarti.

---

## 1. No-Log Texnik Amalga Oshirilishi

HimoyaAI quyidagi qat’iy mezonlar asosida ishlab chiqilgan:

1. **Ma’lumotlar bazasi (Database) yo‘q:**
   Tizimda SQLite, PostgreSQL, MongoDB, Redis yoki boshqa hech qanday saqlovchi baza yo‘q. Murojaat faqat RAM (operativ xotira) da millisekundlar ichida qayta ishlanadi va javob qaytgach xotiradan tozalanadi.
2. **Server jurnallari (Logging) cheklangan:**
   Uvicorn `--no-access-log` bayrog‘i bilan ishga tushiriladi. Ilova kodida xatolik yuz berganda ham foydalanuvchi yozgan matn, uning IP manzili yoki brauzer ma’lumoti loglarga tushmasligi uchun maxsus `PrivacyLoggingFilter` o‘rnatilgan.
3. **Cookie va Lokal Xotira (LocalStorage) ishlatilmaydi:**
   Foydalanuvchining shaxsiy yozishmalari brauzerning `localStorage` yoki `sessionStorage` qismiga yozilmaydi.
4. **IP manzilini saqlamasdan Rate Limiting:**
   Tizimni server hujumlaridan himoya qilish uchun so‘rovlar cheklovi (Rate Limit) qo‘llaniladi. Biroq IP saqlanmaydi — u har 60 soniyada o‘zgaruvchi sirli tuz (salt) bilan SHA-256 orqali bir tomonlama xeshlanadi.
5. **Keshdan himoya qiluvchi sarlavhalar (HTTP Headers):**
   `Cache-Control: no-store, no-cache, must-revalidate`
   `Referrer-Policy: no-referrer`
   `Permissions-Policy: geolocation=(), camera=(), microphone=()`

---

## 2. Halol Cheklovlar (Hakamlar Hay’ati Uchun Ochiq E’tirof)

Texnikada "100% mutlaq anonimlik" da’vosi ilmiy jihatdan xomxayoldir. Biz o‘z foydalanuvchilarimizga va hakamlarga halol bo‘lishni tanlaymiz:

- **Tarmoq provayderi (ISP):** Foydalanuvchi qaysi domen/IP ga bog‘langanini uning internet provayderi ko‘ra oladi (ammo HTTPS shifrlash sababli yozilgan matnni ko‘ra olmaydi).
- **Qurilma klaviaturasi:** Ayrim mobil qurilmalardagi uchinchi tomon klaviaturalari (masalan, keshlovchi klaviaturalar) foydalanuvchi kiritgan so‘zlarni keshga olishi mumkin. Buni kamaytirish uchun matn maydoniga `autocomplete="off" autocorrect="off" spellcheck="false"` xususiyatlari berilgan.
- **Telegram ilovasi:** Foydalanuvchi Telegram Mini App orqali kirganda, Telegram serverlari foydalanuvchining botni ochganligi faktini biladi (ammo Mini App ichidagi HTTPS so‘rovlar Telegram chatida ko‘rinmaydi). Shuning uchun biz bot chatiga matn yozishni qat’iyan cheklaganmiz.
- **Tezkor chiqish (Panic Button):** Agar xonaga kutilmagan odam kirib qolsa, foydalanuvchi 2 marta `Esc` bosish yoki qizil tugmani bosish orqali barcha izlarni tozalab, Google sahifasiga o‘tib ketishi mumkin.

---

## 3. Isbotlovchi Testlar (Proof of No-Log)

`backend/tests/test_no_log.py` faylida quyidagi testlar yashil o‘tgan:
- **Sentinel testi:** Tizimga tasodifiy UUID bilan yaratilgan maxfiy belgi yuboriladi va serverning butun fayl tizimi skanerlanganda bu belgi biror fayl yoki logda topilmasligi tekshiriladi.
- **Statik kod tekshiruvi:** Backend kod bazasida ma’lumotlar bazasiga yozish chaqiruvlari (`INSERT`, `sqlite3`, `database`) yo‘qligi tasdiqlanadi.
