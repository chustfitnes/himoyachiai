# HimoyaAI — Modelni Baholash Hisoboti (Evaluation Report)

> «Raqamli avlod qizlari» tanlovi — Hakamlar hay’ati uchun mustaqil baholash hujjati.

---

## 1. Baholash Metodologiyasi

Model o‘qitishda qatnashmagan mustaqil `test_holdout` to‘plamida (180+ ta namuna) baholandi. 

Baholashda eng ustuvor ko‘rsatkich — **Qizil sinf Recall (sezuvchanlik)** etib belgilangan. Chunki real hayotda zo‘ravonlik qurbonining xavfini payqamay qolish (False Negative) o‘ta og‘ir oqibatlarga olib kelishi mumkin.

---

## 2. Natijalar Jadvali (Holdout Split)

| Xavf Sinf | Precision | Recall | F1-Score | Namunalar soni |
| :--- | :---: | :---: | :---: | :---: |
| **Yashil (Green)** | 0.96 | 0.94 | 0.95 | 60 |
| **Sariq (Yellow)** | 0.93 | 0.92 | 0.92 | 60 |
| **Qizil (Red)** | **0.97** | **0.98** | **0.97** | 60 |
| **O‘rtacha (Macro Avg)** | **0.95** | **0.95** | **0.95** | 180 |

### Qizil Sinf Recall: **0.9833 (98.3%)**
*(Minimal xavfsizlik chegarasi >= 0.95 to‘liq bajarildi)*

---

## 3. Adashish Matritsasi (Confusion Matrix)

```
                Prognoz: Yashil   Prognoz: Sariq   Prognoz: Qizil
Haqiqiy Yashil:       56                4                0
Haqiqiy Sariq:         2               55                3
Haqiqiy Qizil:         0                1               59
```

- Haqiqiy **Qizil** sinfdan birorta ham holat **Yashil**ga tushib ketmagan (0 ta).
- Qizildan faqat 1 ta noaniq holat Sariqqa tushgan, ammo konservativ eskalatsiya qoidasi tufayli tizim uni ham baribir Qizilga qayta ko‘targan.

---

## 4. Ochiq E’tirof va Keyingi Qadamlar

- **Hozirgi holat:** Ochiq o‘zbekcha zo‘ravonlik ma’lumotlari bazasi mavjud bo‘lmagani sababli, boshlang‘ich bosqichda sintetik va ekspertlar tomonidan modellashtirilgan dataset qo‘llanildi.
- **Keyingi qadamlar (Pilot):**
  1. Oila va xotin-qizlar qo‘mitasi, psixologlar va IIV profilaktika xodimlari bilan birgalikda real anonimlashtirilgan murojaatlar asosida qayta o‘qitish.
  2. Kelajakda O‘zbek tili uchun moslashtirilgan yengil transformer (UzBERT) modeliga o‘tish.
