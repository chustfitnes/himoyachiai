/**
 * Hybrid Analysis Engine for HimoyaAI
 * Combines a deterministic rule-based safety floor with LLM reasoning.
 * 
 * Safety Principle:
 * - Deterministic safety rules run first.
 * - If violence, vehicle danger, forced physical contact, or child grooming/danger is matched, floor is RED.
 * - The LLM can raise the risk level, but CANNOT lower it below the safety floor.
 * - If the LLM is unreachable or fails schema validation, safe deterministic fallback is used.
 */

import { evaluateSafetyRules } from '../safetyRules/index.js';

// Fixed contact keys supported by the system (only real, verified services)
export const VALID_CONTACT_KEYS = [
  'hotline_1146',  // Ayollar va bolalar ishonch telefoni (24/7, bepul)
  'police_102',    // Ichki ishlar organi / Tezkor yordam
  'inson_center',  // "Inson" ijtimoiy xizmatlar markazi (Himoya orderi, shelter)
  'legal',         // Madad NNT bepul yuridik maslahat (1008)
  'psychologist',  // Psixologik ko'mak markazi
  'cyber_102',     // IIV Kiberxavfsizlik markazi (1102 / cyber102)
  'trusted_adult', // Ishonchli katta yoshli inson (bola uchun ota-ona, o'qituvchi)
];

/**
 * System prompt strictly constraining LLM output
 */
const SYSTEM_PROMPT = `Siz "HimoyaAI" tizimisiz. O'zbekistondagi xotin-qizlar, qizlar va bolalar uchun turli vaziyatlarda (oilada, ko'chada, taksida, ish/o'qishda, internetda) dastlabki xavfsizlik baholash mutaxassisisiz.

ASOSIY QOIDALAR VA OHANG:
1. Ohang: iliq, bosiq, xolis, hech qachon ayblamaydigan, hukm qilmaydigan. Hech qachon "o'zingiz aybdorsiz", "nega u yerga bordingiz", "nega bunday kiyindingiz" kabi gaplarni ishlatmang. Ayb har doim tajovuzkor yoki shantajchida.
2. NEUTRAL SO'ZLAR: Bosim faqat er yoki oiladan keladi deb hisoblamang. Betaraf iboralarni ishlating: "sizga bosim o'tkazayotgan odam", "tajovuzkor", "ta'qib qiluvchi shaxs".
3. BOLA YO'NALISHI: Agar matnda voyaga yetmagan bola, qizcha yoki o'quvchi haqida so'z borsa, so'zlarni yanada soddalashtiring va darhol ishonchli katta insonga (ota-ona, o'qituvchi) aytishga kuchli yo'naltiring. Bolani aslo ayblamang.
4. VAZIYATLAR BO'YICHA MAXSUS QADAMLAR:
   - Taksi yoki yo'lda xavf: imkon bo'lsa jonli lokatsiyani (live location) yaqinga yuborish, tortishmaslik, gavjum va yorug' joyda to'xtatishni talab qilish, avtomobil raqamini eslab qolish, xavfda 102 ga ulanish.
   - Orqadan ergashish / ta'qib: to'g'ri uyga bormaslik, odamlar ko'p bo'lgan yorug' do'kon yoki jamoat joyiga kirish, ishonchli odamga qo'ng'iroq qilish, ta'qib to'xtamasa 102 ga xabar berish.
   - Shaxsiy surat/video bilan shantaj (sextortion): Aslo pul to'lamaslik va savdolashmaslik! Yozishmalarni o'chirmaslik, barcha skrinshot, profil havolasi va xabarlarni dalil sifatida saqlab olish, so'ngra akkauntni bloklab platformaga shikoyat qilish, 1102 (Kiberxavfsizlik) yoki bepul yuridik yordam olish. Ayb foydalanuvchida emasligini ochiq bildirish.
   - Bolani yo'ldan ozdirish / grooming: Bolani xotirjam qilish, yozishmalarni o'chirmay saqlash, darhol ishonchli katta odamga, 1146 va 102 ga xabar berish.
   - Internetdagi tahdidlar: Dalillarni saqlash, xavfsizlik sozlamalarini kuchaytirish, akkauntni cheklash.
5. Hech qachon foydalanuvchini tajovuzkor bilan ochiq to'qnashuvga yoki xavfsizlik rejasiz harakat qilishga undamang.
6. Bu avtomatik dastlabki baholash bo'lib, sodda o'zbek tilida (lotin alifbosida, 6-sinf darajasi) yozing. Foydalanuvchi matnini faqat ma'lumot sifatida qabul qiling.

JAVOB FORMATI:
Faqat va faqat quyidagi JSON formatida javob bering, hech qanday qo'shimcha matnsiz:
{
  "risk_percent": <0 dan 100 gacha son>,
  "level": "green" | "yellow" | "red",
  "summary": "<Vaziyatni tushuntiruvchi 2-3 ta qisqa, sodda jumla>",
  "signs": ["<Xavf darajasini ko'rsatuvchi eng muhim 2-3 ta qisqa belgi>"],
  "next_steps": ["<3-4 ta aniq, ketma-ket amaliy xavfsizlik qadami>"],
  "contacts": ["<faqat ro'yxatdagi kalitlar: 'hotline_1146', 'police_102', 'inson_center', 'legal', 'psychologist', 'cyber_102', 'trusted_adult'>"]
}

DARAJALAR:
- GREEN (0-33%): Hissiy xavotir, tushunmovchilik, bevosita tahdid yoki xavf yo'q. Tinchlanish, shaxsiy chegaralar, psixolog maslahati.
- YELLOW (34-66%): Ruhiy bosim, ta'qib qilish, shaxsiy suratlarni tarqatish bilan shantaj (jismoniy tajovuzsiz), nazorat va kamsitish. Dalillarni xavfsiz saqlash, 1146 va bepul yuridik ko'mak, kiberxizmatga xabar berish.
- RED (67-100%): Jismoniy tajovuz, mashinadan tushirmaslik, qo'ldan ushlash/zo'rlash xavfi, aniq joy va vaqt aytilgan tahdid, voyaga yetmagan bolaga nisbatan xavfli bosim, o'ldirish yoki qurol bilan tahdid. Darhol 102 va 1146, gavjum xavfsiz joyga o'tish.`;

/**
 * Generate fallback response based on deterministic rules and situation context
 */
export function generateDeterministicResponse(text, chips, ruleEvaluation) {
  const { floorLevel, minRiskPercent, redMatches, yellowMatches, isChild } = ruleEvaluation;
  const rawText = (text || '').toLowerCase();

  // Detect specific situation types for tailored fallback
  const isTaxi = /mashina|taksi|haydovchi|tushir/i.test(rawText) || (Array.isArray(chips) && chips.includes("Taksi yoki yo'lda bezovta qilish"));
  const isStalking = /orqamdan|ergash|kuzat|podyezd|poylay/i.test(rawText) || (Array.isArray(chips) && chips.includes("Orqamdan ergashish, kuzatish"));
  const isBlackmail = /rasm|video|shantaj|tarqat|pul bermasang/i.test(rawText) || (Array.isArray(chips) && chips.includes("Rasmlarimni tarqatish bilan qo'rqitish (pul yoki boshqa narsa talab qilish)"));

  // 1. RED LEVEL FALLBACKS
  if (floorLevel === 'red') {
    const signs = [];
    if (redMatches.length > 0) {
      redMatches.slice(0, 3).forEach((m) => signs.push(m.label));
    } else {
      signs.push("Jismoniy xavf yoki majburlash belgilari");
    }

    // Special child path
    if (isChild) {
      return {
        risk_percent: Math.max(minRiskPercent, 85),
        level: 'red',
        summary: "Sizga nisbatan noto'g'ri va xavfli bosim o'tkazilmoqda. Ayb aslo sizda emas. Siz yolg'iz emassiz va o'zingizni xavfsiz his qilishingiz juda muhim.",
        signs: [
          "Voyaga yetmagan shaxsga nisbatan xavfli yaqinlashuv yoki sir saqlash talabi",
          "Katta yoshli odam tomonidan nojo'ya xatti-harakat",
          "Zudlik bilan himoyaga muhtojlik"
        ],
        next_steps: [
          "Hech narsadan qo'rqmang va bu haqda darhol ota-onangizga yoki eng ishongan o'qituvchingizga ayting.",
          "Agar hozir yoningizda xavf bo'lsa, odamlar ko'p bo'lgan xavfsiz joyga o'ting va 102 yoki 1146 ga qo'ng'iroq qiling.",
          "Yozishmalar yoki xabarlarni o'chirib tashlamang, ular dalil bo'ladi.",
          "U odam bilan hech qachon yolg'iz uchrashuvga bormang va uning gaplariga ishonmang."
        ],
        contacts: ['police_102', 'hotline_1146', 'trusted_adult']
      };
    }

    // Special taxi danger path
    if (isTaxi) {
      return {
        risk_percent: Math.max(minRiskPercent, 88),
        level: 'red',
        summary: "Transportda sizning irodangizga qarshi ushlab turish va xavf solish holati mavjud. Bu jiddiy xavfsizlik buzilishidir, darhol yordam chaqirish lozim.",
        signs: [
          "Mashinadan tushirishdan bosh tortish yoki notanish yo'nalishga burilish",
          "Eshiklarni qulflash yoki erkin harakatni cheklash",
          "Yo'lovchiga nisbatan tahdid"
        ],
        next_steps: [
          "Zudlik bilan telefoningizdan 102 (Ichki ishlar) xizmatiga qo'ng'iroq qiling yoki yaqiningizga mashina raqami va joylashuvingizni (live location) yuboring.",
          "Haydovchi bilan qattiq tortishmasdan, mashinani odamlar ko'p, yorug' bekat yoki svetoforda to'xtatishini qat'iy talab qiling.",
          "Mashina to'xtashi bilan tezda odamlar gavjum xavfsiz joyga (do'kon, bekat) chiqing.",
          "Haydovchining avtomobil davlat raqami, rusumi va ilovadagi ma'lumotlarini saqlab oling."
        ],
        contacts: ['police_102', 'hotline_1146']
      };
    }

    // General Red fallback
    return {
      risk_percent: minRiskPercent,
      level: 'red',
      summary: "Siz tasvirlagan holatda salomatlik va hayot uchun jiddiy xavf belgilari ko'rinmoqda. Bu vaziyatda zudlik bilan o'z xavfsizligingizni birinchi o'ringa qo'yishingiz zarur.",
      signs: signs.slice(0, 3),
      next_steps: [
        "Xavf tug'ilganda darhol 102 (Ichki ishlar) yoki 1146 (Ishonch telefoni) ga qo'ng'iroq qiling.",
        "Imkon boricha odamlar ko'p, yorug' va xavfsiz joyga o'ting (yolg'iz joylar yoki qulflanadigan xonalardan saqlaning).",
        "Telefoningizni doimo quvvatlangan holda yoningizda saqlang va ishonchli insoningizga xavf haqida xabar bering.",
        "Zaruriy shaxsiy hujjatlar va telefoningizni tez olinadigan xavfsiz joyda saqlang."
      ],
      contacts: ['police_102', 'hotline_1146', 'inson_center', 'legal']
    };
  }

  // 2. YELLOW LEVEL FALLBACKS
  if (floorLevel === 'yellow') {
    const signs = [];
    if (yellowMatches.length > 0) {
      yellowMatches.slice(0, 3).forEach((m) => signs.push(m.label));
    } else {
      signs.push("Doimiy nazorat, ruhiy bosim yoki ta'qib alomatlari");
    }

    // Special photo blackmail path
    if (isBlackmail) {
      return {
        risk_percent: Math.max(minRiskPercent, 55),
        level: 'yellow',
        summary: "Sizga nisbatan shaxsiy ma'lumotlar yoki fotosuratlar orqali shantaj qilinmoqda. Asosiy qoida: ayb aslo sizda emas, shantajchi qonun bo'yicha javobgardir. Hech qachon pul to'lamang.",
        signs: [
          "Shaxsiy surat yoki yozishmalarni tarqatish bilan qo'rqitish",
          "Mablag' yoki nojo'ya talablar qo'yish (shantaj)",
          "Ruhiy bosim va obro'sizlantirish tahdidi"
        ],
        next_steps: [
          "Hech qanday holatda pul to'lamang va shantajchi bilan savdolashmang — to'lov tahdidni to'xtatmaydi.",
          "Yozishmalarni aslo o'chirmang! Barcha xabarlar, tahdidlar, profil havolalari va telefon raqamlaridan skrinshot oling.",
          "Dalillarni saqlagach, shantajchining profilini ijtimoiy tarmoqda bloklang va platforma ma'muriyatiga shikoyat yuboring.",
          "IIV Kiberxavfsizlik markaziga (1102 yoki 102) hamda 1146 ga qo'ng'iroq qilib, bepul huquqiy yordam oling."
        ],
        contacts: ['cyber_102', 'hotline_1146', 'legal']
      };
    }

    // Special stalking path
    if (isStalking) {
      return {
        risk_percent: Math.max(minRiskPercent, 48),
        level: 'yellow',
        summary: "Sizga nisbatan yo'lda yoki jamoat joyida orqadan ergashish va kuzatuv harakatlari sezilmoqda. Xavfsizligingizni ta'minlash uchun ehtiyot choralarini ko'rish zarur.",
        signs: [
          "Begona shaxsning yo'lda uzluksiz kuzatishi yoki orqadan ergashishi",
          "Shaxsiy chegaralarni buzish va qo'rquv uyg'otish",
          "Xavfsiz joyga o'tish zarurati"
        ],
        next_steps: [
          "To'g'ri uyga bormang. Darhol odamlar ko'p bo'lgan yorug' joyga — do'kon, dorixona, kafe yoki bekatga kiring.",
          "Yaqin insoningizga yoki tanishingizga qo'ng'iroq qilib, vaziyatni tushuntiring va sizni kutib olishini so'rang.",
          "Agar ta'qib davom etsa, ikkilanmasdan yaqindagi profilaktika inspektoriga yoki 102 ga qo'ng'iroq qiling.",
          "Ta'qib qilayotgan shaxsning ko'rinishi, kiyimi va vaqtini xotirangizda yoki telefonda qayd eting."
        ],
        contacts: ['hotline_1146', 'police_102', 'legal']
      };
    }

    // General Yellow fallback
    return {
      risk_percent: minRiskPercent,
      level: 'yellow',
      summary: "Sizning vaziyatingizda ruhiy yoki iqtisodiy bosim, nazorat yoki ta'qib alomatlari mavjud. Bu vaqt o'tishi bilan kuchayishi mumkin, shuning uchun mutaxassislar yordamiga tayanish muhim.",
      signs: signs.slice(0, 3),
      next_steps: [
        "1146 bepul ishonch telefoniga qo'ng'iroq qilib, vaziyatingiz bo'yicha to'liq anonim maslahat oling.",
        "Sizga bosim o'tkazayotgan odamning xabarlari, tahdidlari yoki dalillarini xavfsiz joyda saqlab boring.",
        "O'z huquqlaringizni himoya qilish uchun bepul 'Madad' huquqiy yordam xizmati (1008) bilan bog'laning.",
        "Agar vaziyat og'irlashsa, 30 kunlik bepul Himoya orderi olish huquqidan foydalanishingiz mumkin."
      ],
      contacts: ['hotline_1146', 'inson_center', 'legal', 'psychologist']
    };
  }

  // 3. GREEN LEVEL FALLBACK
  return {
    risk_percent: minRiskPercent,
    level: 'green',
    summary: "Hozirgi tasviringizda to'g'ridan-to'g'ri jismoniy tajovuz, ta'qib yoki o'tkir xavf belgilari aniqlanmadi. Biroq hissiy charchoq va noqulayliklar e'tiborga muhtoj.",
    signs: [
      "Hissiy noqulaylik yoki tushunmovchilik holati",
      "Bevosita jismoniy tajovuz yoki ta'qib aniqlanmadi",
      "Shaxsiy chegaralarni mustahkamlashga ehtiyoj"
    ],
    next_steps: [
      "O'z his-tuyg'ularingiz va xotirjamligingizni tiklash uchun psixolog bilan suhbatlashing.",
      "Muloqotda shaxsiy chegaralaringizni bosiqlik bilan belgilashga harakat qiling.",
      "Agar vaziyat o'zgarib, sizga bosim yoki tahdid paydo bo'lsa, istalgan vaqtda qayta baholash o'tkazing."
    ],
    contacts: ['psychologist', 'inson_center']
  };
}

/**
 * Validate and sanitize LLM JSON output
 */
function validateAndSanitizeOutput(parsed, ruleEvaluation) {
  if (!parsed || typeof parsed !== 'object') {
    return null;
  }

  let level = parsed.level;
  if (!['green', 'yellow', 'red'].includes(level)) {
    level = ruleEvaluation.floorLevel;
  }

  let risk_percent = Number(parsed.risk_percent);
  if (isNaN(risk_percent) || risk_percent < 0 || risk_percent > 100) {
    risk_percent = ruleEvaluation.minRiskPercent;
  }

  // CRITICAL SAFETY FLOOR ENFORCEMENT:
  // The LLM can never lower the safety floor determined by the rules!
  if (ruleEvaluation.floorLevel === 'red') {
    level = 'red';
    risk_percent = Math.max(risk_percent, ruleEvaluation.minRiskPercent, 70);
  } else if (ruleEvaluation.floorLevel === 'yellow') {
    if (level === 'green') {
      level = 'yellow';
    }
    risk_percent = Math.max(risk_percent, ruleEvaluation.minRiskPercent, 35);
  }

  const defaultResp = generateDeterministicResponse('', [], ruleEvaluation);

  const summary = typeof parsed.summary === 'string' && parsed.summary.trim().length > 10
    ? parsed.summary.trim()
    : defaultResp.summary;

  const signs = Array.isArray(parsed.signs) && parsed.signs.length > 0
    ? parsed.signs.filter(s => typeof s === 'string' && s.trim().length > 0).slice(0, 3)
    : defaultResp.signs;

  const next_steps = Array.isArray(parsed.next_steps) && parsed.next_steps.length > 0
    ? parsed.next_steps.filter(s => typeof s === 'string' && s.trim().length > 0).slice(0, 4)
    : defaultResp.next_steps;

  // Filter contacts to valid keys only
  let contacts = Array.isArray(parsed.contacts)
    ? parsed.contacts.filter(c => VALID_CONTACT_KEYS.includes(c))
    : [];

  // Guarantee emergency numbers if RED
  if (level === 'red') {
    if (!contacts.includes('police_102')) contacts.unshift('police_102');
    if (!contacts.includes('hotline_1146')) contacts.push('hotline_1146');
    if (ruleEvaluation.isChild && !contacts.includes('trusted_adult')) {
      contacts.push('trusted_adult');
    }
  } else if (level === 'yellow') {
    if (!contacts.includes('hotline_1146')) contacts.unshift('hotline_1146');
  }

  if (contacts.length === 0) {
    contacts = ruleEvaluation.recommendedContacts;
  }

  return {
    risk_percent: Math.round(risk_percent),
    level,
    summary,
    signs,
    next_steps,
    contacts,
  };
}

/**
 * Call Gemini API with JSON response schema
 */
async function callGeminiApi(apiKey, userText, chipsContext) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const prompt = `${SYSTEM_PROMPT}\n\nFOYDALANUVCHI MA'LUMOTLARI:\nBelgilangan toifalar: ${chipsContext || 'Hech biri belgilanmagan'}\nHolat tasviri:\n"""\n${userText}\n"""`;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      responseMimeType: "application/json"
    }
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.status}`);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Empty response from LLM');

    return JSON.parse(rawText);
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Call OpenAI-compatible API if OPENAI_API_KEY is configured
 */
async function callOpenAiApi(apiKey, userText, chipsContext) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const prompt = `Belgilangan toifalar: ${chipsContext || 'Hech biri'}\nHolat tasviri:\n"""\n${userText}\n"""`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) throw new Error(`OpenAI API error: ${res.status}`);

    const data = await res.json();
    const rawContent = data?.choices?.[0]?.message?.content;
    return JSON.parse(rawContent);
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * Main analysis function
 * @param {string} text User text input
 * @param {string[]} chips Selected context chips
 * @returns {Promise<Object>} Safe, validated assessment object
 */
export async function analyzeSituation(text = '', chips = []) {
  // Step 1: Run deterministic safety rules first
  const ruleEvaluation = evaluateSafetyRules(text, chips);

  // Check if API keys are available in environment
  const geminiKey = process.env.GEMINI_API_KEY;
  const openAiKey = process.env.OPENAI_API_KEY;

  const chipsContext = Array.isArray(chips) && chips.length > 0 ? chips.join(', ') : '';

  // If no LLM API key is provided, use guaranteed deterministic response
  if (!geminiKey && !openAiKey) {
    return generateDeterministicResponse(text, chips, ruleEvaluation);
  }

  // Attempt LLM call with retry once
  let llmResult = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      if (geminiKey) {
        llmResult = await callGeminiApi(geminiKey, text, chipsContext);
      } else if (openAiKey) {
        llmResult = await callOpenAiApi(openAiKey, text, chipsContext);
      }

      if (llmResult) break;
    } catch {
      if (attempt === 2) {
        return generateDeterministicResponse(text, chips, ruleEvaluation);
      }
    }
  }

  // Step 3: Validate and enforce deterministic safety floor
  const validated = validateAndSanitizeOutput(llmResult, ruleEvaluation);
  if (!validated) {
    return generateDeterministicResponse(text, chips, ruleEvaluation);
  }

  return validated;
}
