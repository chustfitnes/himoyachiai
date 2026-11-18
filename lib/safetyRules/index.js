/**
 * Deterministic Safety Rule Layer for HimoyaAI
 * Evaluates user input against explicit risk patterns in Uzbek (Latin and Cyrillic) and Russian.
 * 
 * Safety Guarantee:
 * If a dangerous pattern is detected, the risk level is forced to at least RED.
 * No LLM response can lower the risk level below this deterministic floor.
 */

// Text normalization helper
export function normalizeText(rawText = '') {
  if (!rawText || typeof rawText !== 'string') return '';
  
  return rawText
    .toLowerCase()
    // Normalize various typographic apostrophes used in Uzbek (oʻ, gʻ, o', g', etc.)
    .replace(/[`‘'’ʻʼ]/g, "'")
    // Normalize Cyrillic special letters
    .replace(/ў/g, "o'")
    .replace(/ғ/g, "g'")
    .replace(/ҳ/g, "h")
    .replace(/қ/g, "q")
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * High-risk physical danger, weapon, choking, locking in, or death threat patterns (RED FLOOR)
 */
export const RED_SAFETY_PATTERNS = [
  // Death threats & killing
  {
    id: 'death_threat_uz',
    regex: /(o'ldiraman|o'ldirish|joningni olaman|tirik qoymayman|yo'q qilib yuboraman|ko'mib tashlayman|qonini to'kaman|yoqib yuboraman|zaharlayman)/i,
    label: "Hayotga to'g'ridan-to'g'ri tahdid (o'ldirish do'q-po'pisi)",
    severity: 'red',
  },
  {
    id: 'death_threat_cyr',
    regex: /(ўлдираман|жонингни оламан|тириклайин|йўқ қилиб юбораман|кўмиб ташлайман|ёқиб юбораман)/i,
    label: "Hayotga to'g'ridan-to'g'ri tahdid (kirillcha)",
    severity: 'red',
  },
  {
    id: 'death_threat_ru',
    regex: /(убью|задушу|зарежу|прикончу|живой не уйдешь|угрожает смертью|угроза жизни|сожгу|утоплю)/i,
    label: 'Прямая угроза жизни / убийством',
    severity: 'red',
  },

  // Physical beating & assaults
  {
    id: 'physical_beating_uz',
    regex: /(kaltakl(adi|aydi|ayapti)|urdi|urayapti|uradi|tep(di|kilar)|musht|yuzimga urdi|boshimga urdi|og'zimni yirdi|burnimni sindirdi|sindir(di|aman)|kallamni devorga urdi|kallamni urdi)/i,
    label: 'Jismoniy tajovuz, do‘pposlash yoki jarohat yetkazish',
    severity: 'red',
  },
  {
    id: 'physical_beating_cyr',
    regex: /(калтакла(ди|йди|япти)|урди|ура(япти|йди)|тепди|мушт|бурнимни синдирди|синдирди|бошимни деворга урди)/i,
    label: 'Jismoniy kaltaklash (kirillcha)',
    severity: 'red',
  },
  {
    id: 'physical_beating_ru',
    regex: /(избил|избивает|ударил|бьет|побил|ногами|кулаком|сломал|разбил лицо|головой об стену|наносит побои)/i,
    label: 'Физическое насилие / побои',
    severity: 'red',
  },

  // Choking / Strangulation (statistically highest lethality predictor in domestic violence)
  {
    id: 'strangulation_uz',
    regex: /(bo'g'(di|moqchi|yapti|adi)|tomoq(dan|imni) (oldi|siqdi)|nafas ololmay qoldim)/i,
    label: "Bo'g'ish yoki tomoqdan ushlash (o'ta xavfli belgi)",
    severity: 'red',
  },
  {
    id: 'strangulation_cyr',
    regex: /(бўғ(ди|моқчи|япти|ади)|томоғимни сиқди|нафас ололмай қолдим)/i,
    label: "Bo'g'ish harakati (kirillcha)",
    severity: 'red',
  },
  {
    id: 'strangulation_ru',
    regex: /(душил|душит|задушить|схватил за горло|перекрыл кислород|не могла дышать)/i,
    label: 'Удушение / попытка удушения',
    severity: 'red',
  },

  // Weapons, sharp objects, dangerous items
  {
    id: 'weapon_uz',
    regex: /(pichoq|qurol|bolt(a|a bilan)|dazmol bilan|qaychi bilan|otaman|pichoq o'qtadi|pichoq tiradi)/i,
    label: "Qurol yoki pichoq bilan xavf solish",
    severity: 'red',
  },
  {
    id: 'weapon_cyr',
    regex: /(пичоқ|қурол|болта|қайчи bilan|пичоқ ўқтади|пичоқ тиради)/i,
    label: "Qurol yoki o'tkir jism bilan tahdid (kirillcha)",
    severity: 'red',
  },
  {
    id: 'weapon_ru',
    regex: /(нож|ножом|оружие|пистолет|топор|схватился за нож|угрожает ножом)/i,
    label: 'Угроза холодным или огнестрельным оружием',
    severity: 'red',
  },

  // Confinement / Locked in / Children in immediate danger
  {
    id: 'confinement_uz',
    regex: /(qulflab qo'y(di|gan)|uyga qamab|eshikni qulflab|chiqarmayapti|tashqariga chiqarib qo'ydi|ko'chaga haydab yubordi|hushimdan ketdim|qon oqdi)/i,
    label: 'Majburiy qamab qo‘yish yoki og‘ir holat',
    severity: 'red',
  },
  {
    id: 'confinement_ru',
    regex: /(запер дома|запер на ключ|не выпускает из дома|потеряла сознание|истекаю кровью|выгнал на улицу ночью)/i,
    label: 'Лишение свободы / заперта дома',
    severity: 'red',
  },
  {
    id: 'child_threat_uz',
    regex: /(bolalarni (tortib olaman|o'ldiraman|uradi|kaltaklaydi)|bolamni urdi|bolani derazadan)/i,
    label: 'Bolalar hayoti yoki xavfsizligiga tahdid',
    severity: 'red',
  },
  {
    id: 'child_threat_ru',
    regex: /(детей отберу|угрожает детям|бьет детей|ребенка ударил)/i,
    label: 'Угроза детям / насилие над детьми',
    severity: 'red',
  },
];

/**
 * Moderate risk patterns: psychological pressure, economic control, isolation, surveillance (YELLOW FLOOR)
 */
export const YELLOW_SAFETY_PATTERNS = [
  // Economic abuse / money control
  {
    id: 'economic_abuse_uz',
    regex: /(pul bermaydi|oyligimni olib qo'yadi|plastigimni olib|bir tiyinsiz|kartamni olib|mol-mulkni|och qoldiraman)/i,
    label: 'Iqtisodiy nazorat va moddiy qaramlik',
    severity: 'yellow',
  },
  {
    id: 'economic_abuse_cyr',
    regex: /(пул бермайди|ойлигимни олиб қўяди|пластигимни|бир тийинсиз|картамни олиб)/i,
    label: 'Iqtisodiy zo‘ravonlik (kirillcha)',
    severity: 'yellow',
  },
  {
    id: 'economic_abuse_ru',
    regex: /(не дает деньги|забирает зарплату|отобрал карту|финансовый контроль|лишает денег)/i,
    label: 'Экономическое насилие и контроль финансов',
    severity: 'yellow',
  },

  // Isolation & restrictions
  {
    id: 'isolation_uz',
    regex: /(onamnikiga yubormaydi|ota-onam bilan ko'rish|hech kim bilan gaplash|uyidan chiqarmaydi|dugonalarim bilan|uyda o'tirasan|yolg'izlatib qo'ydi)/i,
    label: 'Oila va yaqinlardan majburiy yolg‘izlantirish',
    severity: 'yellow',
  },
  {
    id: 'isolation_cyr',
    regex: /(онамникига юбормайди|ота-онам билан|ҳеч ким билан гаплашма|уйдан чиқарма|ёлғизлатиб)/i,
    label: 'Yaqinlar bilan aloqani taqiqlash (kirillcha)',
    severity: 'yellow',
  },
  {
    id: 'isolation_ru',
    regex: /(запрещает общаться|не пускает к маме|к родителям не пускает|изолировал от всех|ни с кем не дает видеться)/i,
    label: 'Изоляция от близких и семьи',
    severity: 'yellow',
  },

  // Phone / communication surveillance & taking away documents
  {
    id: 'surveillance_uz',
    regex: /(telefonimni tekshiradi|telefonimni olib qo'y(di|gan)|kim bilan gaplashding|parollarimni|kuzatadi|pasportimni olib qo'ygan|metrkamni)/i,
    label: 'Aloqa nazorati yoki hujjatlarni olib qo‘yish',
    severity: 'yellow',
  },
  {
    id: 'surveillance_ru',
    regex: /(проверяет телефон|отобрал телефон|следит за мной|забрал паспорт|забрал документы)/i,
    label: 'Контроль переписок или удержание документов',
    severity: 'yellow',
  },

  // Verbal abuse, threats of divorce/taking away without violence
  {
    id: 'psychological_abuse_uz',
    regex: /(haqorat qil(adi|yapti)|so'k(adi|yapti)|sen hech kimsan|aqldan ozgansan|jinni qilib qo'yaman|ajrashaman deb qo'rqit(adi|moqda)|kamsitadi|tahdid qiladi)/i,
    label: 'Ruhiy kamsitish, haqorat va doimiy bosim',
    severity: 'yellow',
  },
  {
    id: 'psychological_abuse_cyr',
    regex: /(ҳақорат қил(ади|япти)|сўкади|сен ҳеч кимсан|ақлдан озгансан|камситади|таҳдид қилади)/i,
    label: 'Ruhiy zo‘ravonlik va haqorat (kirillcha)',
    severity: 'yellow',
  },
  {
    id: 'psychological_abuse_ru',
    regex: /(оскорбляет|унижает|ты никто|психологическое давление|угрожает разводом|манипулирует)/i,
    label: 'Психологическое унижение и словесные угрозы',
    severity: 'yellow',
  },
];

/**
 * Chip-based mapping
 */
export const CHIP_RISK_MAPPING = {
  'Kaltaklash': { level: 'red', label: 'Jismoniy zarba / kaltaklash holati' },
  'Tahdid': { level: 'yellow', label: 'Ogohlantirish yoki tahdid holati' },
  'Pul nazorati': { level: 'yellow', label: 'Moliyaviy nazorat yoki cheklov' },
  'Telefon/aloqa nazorati': { level: 'yellow', label: 'Aloqa yoki telefon nazorati' },
  "Yolg'izlantirish": { level: 'yellow', label: "Yaqinlaridan yolg'izlatish" },
};

/**
 * Evaluate deterministic safety rules
 * @param {string} text User situation description
 * @param {string[]} chips Selected quick-select chips
 * @returns {Object} Evaluation report with floor level, detected signs, and minimum risk percentage
 */
export function evaluateSafetyRules(text = '', chips = []) {
  const normalized = normalizeText(text);
  const redMatches = [];
  const yellowMatches = [];

  // Check chips first
  if (Array.isArray(chips)) {
    chips.forEach((chip) => {
      const mapping = CHIP_RISK_MAPPING[chip];
      if (mapping) {
        if (mapping.level === 'red') {
          redMatches.push({ id: `chip_${chip}`, label: mapping.label, severity: 'red' });
        } else if (mapping.level === 'yellow') {
          yellowMatches.push({ id: `chip_${chip}`, label: mapping.label, severity: 'yellow' });
        }
      }
    });
  }

  // Check text against RED patterns
  for (const pattern of RED_SAFETY_PATTERNS) {
    if (pattern.regex.test(normalized)) {
      redMatches.push({ id: pattern.id, label: pattern.label, severity: 'red' });
    }
  }

  // Check text against YELLOW patterns
  for (const pattern of YELLOW_SAFETY_PATTERNS) {
    if (pattern.regex.test(normalized)) {
      yellowMatches.push({ id: pattern.id, label: pattern.label, severity: 'yellow' });
    }
  }

  // Determine floor
  if (redMatches.length > 0) {
    // Determine percentage based on match density: between 75% and 98%
    const basePercent = 75;
    const additional = Math.min(23, (redMatches.length - 1) * 8 + (yellowMatches.length * 3));
    const risk_percent = Math.min(98, basePercent + additional);

    return {
      floorLevel: 'red',
      minRiskPercent: risk_percent,
      hasRedFlags: true,
      hasYellowFlags: yellowMatches.length > 0,
      matchedRules: [...redMatches, ...yellowMatches],
      redMatches,
      yellowMatches,
      recommendedContacts: ['police_102', 'hotline_1146', 'inson_center', 'legal'],
    };
  }

  if (yellowMatches.length > 0) {
    // Determine percentage: between 42% and 64%
    const basePercent = 42;
    const additional = Math.min(22, (yellowMatches.length - 1) * 6);
    const risk_percent = Math.min(65, basePercent + additional);

    return {
      floorLevel: 'yellow',
      minRiskPercent: risk_percent,
      hasRedFlags: false,
      hasYellowFlags: true,
      matchedRules: yellowMatches,
      redMatches: [],
      yellowMatches,
      recommendedContacts: ['hotline_1146', 'inson_center', 'legal', 'psychologist'],
    };
  }

  // Green default (if no violence, control or severe harassment patterns detected)
  return {
    floorLevel: 'green',
    minRiskPercent: 18,
    hasRedFlags: false,
    hasYellowFlags: false,
    matchedRules: [],
    redMatches: [],
    yellowMatches: [],
    recommendedContacts: ['psychologist', 'inson_center'],
  };
}
