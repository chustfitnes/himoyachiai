/**
 * Deterministic Safety Rule Layer for HimoyaAI
 * Evaluates user input against explicit risk patterns in Uzbek (Latin and Cyrillic) and Russian.
 * 
 * Scope:
 * Covers domestic violence, stalking, taxi/transport danger, sexual harassment/physical contact,
 * sextortion/blackmail, online threats, minor grooming, and place/time-specific threats.
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
 * High-risk physical danger, weapon, choking, locking in, taxi abduction,
 * physical contact/sexual assault attempt, minor grooming/danger, or place/time threat patterns (RED FLOOR)
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
    regex: /(kaltakl(adi|aydi|ayapti)|\burdi\b|\burayapti\b|\buradi\b|tep(di|kilar)|musht|qo'l ko'tar(di|adi|yapti|gan|moqchi)|sochimdan (tortdi|sudradi|yuldi)|shapaloq|tarsaki|kamar bilan|tayoq bilan|yuzimga urdi|boshimga urdi|og'zimni yirdi|burnimni sindirdi|sindir(di|aman)|kallamni devorga urdi|kallamni urdi|ko'kar(di|tirdi|ish)|jarohat yetkazdi)/i,
    label: 'Jismoniy tajovuz, qo‘l ko‘tarish, do‘pposlash yoki jarohat yetkazish',
    severity: 'red',
  },
  {
    id: 'physical_beating_cyr',
    regex: /(калтакла(ди|йди|япти)|\бурди\b|\бура(япти|йди)\b|тепди|мушт|қўл кўтар(ди|ади|япти)|сочимдан тортди|шапалоқ|тарсаки|бурнимни синдирди|синдирди|бошимни деворга урди|кўкар(ди|тирди))/i,
    label: 'Jismoniy kaltaklash va qo‘l ko‘tarish (kirillcha)',
    severity: 'red',
  },
  {
    id: 'physical_beating_ru',
    regex: /(избил|избивает|ударил|бьет|побил|ногами|кулаком|сломал|разбил лицо|головой об стену|наносит побои|поднял руку|таскал за волосы|дал пощечину|синяки|бил ремнем)/i,
    label: 'Физическое насилие / побои',
    severity: 'red',
  },

  // Choking / Strangulation
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
    regex: /(pichoq|qurol|bolt(a|a bilan)|dazmol bilan|qaychi bilan|\botaman\b|pichoq o'qtadi|pichoq tiradi)/i,
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

  // Confinement / Locked in
  {
    id: 'confinement_uz',
    regex: /(qulflab qo'y(di|gan)|uyga qamab|eshikni qulflab|chiqarmayapti|tashqariga chiqarib qo'ydi|ko'chaga haydab yubordi|uydan hayda(di|yapti)|quvib chiqar(di|yapti)|hushimdan ketdim|qon oqdi)/i,
    label: 'Majburiy qamab qo‘yish yoki uydan quvib chiqarish',
    severity: 'red',
  },
  {
    id: 'confinement_ru',
    regex: /(запер дома|запер на ключ|не выпускает из дома|потеряла сознание|истекаю кровью|выгнал на улицу ночью)/i,
    label: 'Лишение свободы / заперта дома',
    severity: 'red',
  },

  // NEW: Taxi / Car danger (driver refuses to stop, locked doors, unknown route, user cannot leave)
  {
    id: 'taxi_danger_uz',
    regex: /(mashinadan tushirmayapti|tushirib yubormayapti|eshikni qulflab oldi|to'xtatmayapti|boshqa yo'ldan (ketyapti|burib ketdi)|mashinaga majburlab (o'tqazdi|tiqdi)|mashinadan tushmoqchi edim|haydovchi eshikni ochmayapti)/i,
    label: "Taksida yoki mashinada majburiy ushlab turish va xavf",
    severity: 'red',
  },
  {
    id: 'taxi_danger_ru',
    regex: /(не выпускает из машины|заблокировал двери такси|везет в неизвестном направлении|не останавливает машину|таксист запер двери|насильно затащил в машину)/i,
    label: 'Опасность в такси / принудительное удержание в машине',
    severity: 'red',
  },

  // NEW: Attempted or actual physical contact, grabbing, touching, sexual violence attempt, forcing
  {
    id: 'forced_contact_uz',
    regex: /(qo'limdan (ushlab|mahkam)|tortingil(adi|yapti)|kiyimimni (yirtmoqchi|yirtib)|zo'rlamoqchi|majburlab quchoql(adi|amoqchi)|tegajog'lik qilib ush(ladi|amoqchi)|o'pmoqchi bo'ldi|qarshiligimga qaramay ushladi|tegindi)/i,
    label: "Jismoniy tegajog'lik yoki zo'rlash xavfi",
    severity: 'red',
  },
  {
    id: 'forced_contact_ru',
    regex: /(хватает за руки|пытается раздеть|попытка изнасилования|насильно обнимает|трогает против воли|домогается физически|схватил силой)/i,
    label: 'Физическое домогательство / попытка насилия',
    severity: 'red',
  },

  // NEW: Minor grooming & danger (adult pressuring child, asking photos, secrecy, meeting)
  {
    id: 'child_grooming_uz',
    regex: /(bolani (aldab|yo'ldan ozdir)|qizchani|hech kimga aytma.*(uchrash|rasm|sovg'a)|rasmingni yubor.*(hech kim bilmasin|sir)|amaki.*(tegindi|ushladi|chaqirdi|kiyim)|yosh bolaga tegajog'lik)/i,
    label: "Voyaga yetmagan bolaga nisbatan aldov yoki xavfli bosim",
    severity: 'red',
  },
  {
    id: 'child_grooming_ru',
    regex: /(педофил|пристает к ребенку|взрослый просит фото ребенка|никому не говори это наш секрет|домогается девочки|склоняет ребенка к встрече)/i,
    label: 'Склонение и совращение несовершеннолетних',
    severity: 'red',
  },

  // Threats to children
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

  // NEW: Threats naming a specific place and time ("ko'chada kutaman", "uyingni bilaman", "ertaga kelaman")
  {
    id: 'place_time_threat_uz',
    regex: /(ko'chada (kutaman|poylayman)|uyingni bilaman.*(kelaman|ko'rasan)|ertaga (kelaman|topib olaman)|chiqishingni kutib turibman|ishxonangga boraman.*(tinch qo'ymayman|o'ldiraman)|eshiging tagida turibman)/i,
    label: "Aniq vaqt va joy ko'rsatilgan ta'qib tahdidi",
    severity: 'red',
  },
  {
    id: 'place_time_threat_ru',
    regex: /(знаю где живешь|подкараулю у подъезда|жду тебя на улице|завтра приду|найду тебя возле работы|стою под дверью)/i,
    label: 'Прямая угроза с указанием места и времени',
    severity: 'red',
  },
];

/**
 * Moderate risk patterns: psychological pressure, economic control, isolation,
 * being followed/stalked, photo-leak blackmail (without immediate physical harm),
 * online harassment, workplace pressure (YELLOW FLOOR)
 */
export const YELLOW_SAFETY_PATTERNS = [
  // NEW: Stalking, being followed, watched without immediate physical grab
  {
    id: 'stalking_uz',
    regex: /(orqamdan (keladi|kelayapti|ergash(adi|yapti))|kuzat(yapti|adi|ib yuradi)|podyezdgacha (keldi|ergashdi)|har kuni poylaydi|mashinasida kuzatib)/i,
    label: "Orqadan ergashish, ta'qib va kuzatuv holati",
    severity: 'yellow',
  },
  {
    id: 'stalking_ru',
    regex: /(следит за мной|преследует|ходит за мной|караулит возле дома|выслеживает)/i,
    label: 'Преследование и слежка',
    severity: 'yellow',
  },

  // NEW: Sextortion / Photo-leak blackmail without immediate physical harm
  {
    id: 'sextortion_blackmail_uz',
    regex: /(rasm(im)?ni (tarqataman|yuboraman|chiqaraman)|video(im)?ni (hammaga|tarqat)|pul bermasang.*(rasm|video|shantaj)|shantaj qil(yapti|adi)|yozishmalarni tarqataman|obro'yingni to'kaman)/i,
    label: "Shaxsiy surat yoki videolarni tarqatish bilan shantaj qilish",
    severity: 'yellow',
  },
  {
    id: 'sextortion_blackmail_ru',
    regex: /(распространю фото|солью видео|шантажирует фото|вымогает деньги за фото|опубликую переписку|шантаж)/i,
    label: 'Шантаж личными фотографиями / вымогательство',
    severity: 'yellow',
  },

  // NEW: Workplace or study harassment & pressure
  {
    id: 'work_study_pressure_uz',
    regex: /(ish joyimda (bosim|bezovta)|boshliq (tegajog'lik|bosim)|o'qishda (tinch qo'ymayapti|bosim)|bahoyingni qo'ymayman|ishdan bo'shataman deb)/i,
    label: "Ish yoki o'qish joyida bosim va bezovta qilish",
    severity: 'yellow',
  },
  {
    id: 'work_study_pressure_ru',
    regex: /(на работе домогается|начальник давит|угрожает увольнением|в учебе шантажирует)/i,
    label: 'Давление и харассмент на работе или учебе',
    severity: 'yellow',
  },

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
    regex: /(haqorat|so'k(adi|yapti|inish|adi)|sen hech kimsan|aqldan ozgansan|jinni qilib qo'yaman|ajrashaman deb|kamsit(adi|ish|yapti)|tahdid|tahqirlash|tahqirlaydi|janjal|baqir(adi|yapti|ib|ish)|baqir-chaqir|tinchlik bermay|tinch qo'ymay|qo'rq(yapman|aman|itadi|itish)|vahimadaman)/i,
    label: 'Ruhiy kamsitish, haqorat, doimiy baqirish va bosim',
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
 * Child context detector (text suggesting user is a child or writing about a child)
 */
export function isChildOrAboutChild(text = '', chips = []) {
  const norm = normalizeText(text);
  if (Array.isArray(chips) && chips.includes("Bolani yoki qizchani aldash, yo'ldan ozdirish")) {
    return true;
  }
  return /(o'quvchiman|maktabda|yoshim (1[0-7]|9|8)|bolam|qizcham|singlim|voyaga yetmagan|amaki.*chaqirdi|bolaga|yosh qiz)/i.test(norm);
}

/**
 * Chip-based mapping including both family and stranger/online/public situations
 */
export const CHIP_RISK_MAPPING = {
  // Oilada va yaqinlar orasida
  'Kaltaklash': { level: 'red', label: 'Jismoniy zarba / kaltaklash holati' },
  'Tahdid': { level: 'yellow', label: 'Ogohlantirish yoki tahdid holati' },
  'Pul nazorati': { level: 'yellow', label: 'Moliyaviy nazorat yoki cheklov' },
  'Telefon/aloqa nazorati': { level: 'yellow', label: 'Aloqa yoki telefon nazorati' },
  "Yolg'izlantirish": { level: 'yellow', label: "Yaqinlaridan yolg'izlatish" },

  // Boshqa joylarda va begona odamlardan
  "Taksi yoki yo'lda bezovta qilish": { level: 'yellow', label: "Taksi yoki jamoat transportida bezovtalik" },
  "Orqamdan ergashish, kuzatish": { level: 'yellow', label: "Ko'chada yoki yo'lda ta'qib qilish" },
  "Rasmlarimni tarqatish bilan qo'rqitish (pul yoki boshqa narsa talab qilish)": { level: 'yellow', label: "Surat yoki ma'lumotlarni tarqatish bilan shantaj qilish" },
  "Internetda tahdid yoki shantaj": { level: 'yellow', label: "Internet orqali tahdid yoki bosim" },
  "Bolani yoki qizchani aldash, yo'ldan ozdirish": { level: 'red', label: "Bolaga nisbatan aldov yoki xavfli yaqinlashuv" },
  "Ish yoki o'qish joyida bosim va bezovta qilish": { level: 'yellow', label: "Ishxona yoki ta'lim joyida nomaqbul bosim" },
  "Boshqa": { level: 'neutral', label: "Boshqa bezovta qiluvchi holat" },
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

  const childContext = isChildOrAboutChild(normalized, chips);

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

  // SPECIAL ESCALATION RULE:
  // Photo blackmail escalation: If photo blackmail is accompanied by child context OR threat of harm, escalate to RED floor
  const hasPhotoBlackmail = yellowMatches.some((m) => m.id === 'sextortion_blackmail_uz' || m.id === 'sextortion_blackmail_ru') ||
    (Array.isArray(chips) && chips.includes("Rasmlarimni tarqatish bilan qo'rqitish (pul yoki boshqa narsa talab qilish)"));

  if (hasPhotoBlackmail && (childContext || redMatches.length > 0 || /(uraman|o'ldiraman|topib olaman|kelaman)/i.test(normalized))) {
    redMatches.push({
      id: 'photo_blackmail_harm_minor',
      label: "Voyaga yetmaganga yoki hayotga tahdid bilan birga kechayotgan shantaj",
      severity: 'red',
    });
  }

  // Determine floor
  if (redMatches.length > 0) {
    const basePercent = 80;
    const additional = Math.min(18, (redMatches.length - 1) * 6 + (yellowMatches.length * 3));
    const risk_percent = Math.min(98, basePercent + additional);

    return {
      floorLevel: 'red',
      minRiskPercent: risk_percent,
      hasRedFlags: true,
      hasYellowFlags: yellowMatches.length > 0,
      matchedRules: [...redMatches, ...yellowMatches],
      redMatches,
      yellowMatches,
      isChild: childContext,
      recommendedContacts: ['police_102', 'hotline_1146', 'inson_center', 'legal'],
    };
  }

  if (yellowMatches.length > 0) {
    const basePercent = 50;
    const additional = Math.min(16, (yellowMatches.length - 1) * 5);
    const risk_percent = Math.min(66, basePercent + additional);

    return {
      floorLevel: 'yellow',
      minRiskPercent: risk_percent,
      hasRedFlags: false,
      hasYellowFlags: true,
      matchedRules: yellowMatches,
      redMatches: [],
      yellowMatches,
      isChild: childContext,
      recommendedContacts: ['hotline_1146', 'inson_center', 'legal', 'psychologist'],
    };
  }

  // Green default (if no violence, control, stalking, blackmail or severe harassment detected)
  return {
    floorLevel: 'green',
    minRiskPercent: 18,
    hasRedFlags: false,
    hasYellowFlags: false,
    matchedRules: [],
    redMatches: [],
    yellowMatches,
    isChild: childContext,
    recommendedContacts: ['psychologist', 'inson_center'],
  };
}
