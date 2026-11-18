/**
 * Automated Safety Rule Verification Test Suite
 * Tests deterministic safety layer on 30 real-world Uzbek scenarios (10 per level: Red, Yellow, Green)
 * Covers both domestic situations AND stranger, taxi, stalking, photo blackmail, child grooming, and online threats.
 */

import assert from 'node:assert';
import { evaluateSafetyRules } from '../lib/safetyRules/index.js';

const testCases = {
  red: [
    // Original 5 domestic cases
    {
      id: 'red_1',
      text: "Erim pichoq olib o'ldiraman deb qo'rqityapti, eshikni qulflab qo'ydi",
      chips: ['Tahdid'],
      expectedFloor: 'red',
      description: "Pichoq va o'ldirish tahdidi, eshikni qulflash",
    },
    {
      id: 'red_2',
      text: "Kecha kechasi meni qattiq kaltakladi, yuzimga musht tushirdi, burnimni sindirdi",
      chips: ['Kaltaklash'],
      expectedFloor: 'red',
      description: "Jismoniy kaltaklash va jarohat yetkazish",
    },
    {
      id: 'red_3',
      text: "Bo'g'moqchi bo'ldi, tomoqdan oldi, nafas ololmay qoldim, bolalarni ham uraman deyapti",
      chips: [],
      expectedFloor: 'red',
      description: "Bo'g'ish va bolalarga nisbatan tahdid",
    },
    {
      id: 'red_4',
      text: "Ko'chaga haydab yubordi, ustimdan eshikni yopib qo'ydi, hushimdan ketgunimcha tepdi",
      chips: ['Kaltaklash'],
      expectedFloor: 'red',
      description: "Tepish, hushidan ketkazish va eshikni qulflash",
    },
    {
      id: 'red_5',
      text: "Qurol o'qtalib tirik qo'ymayman dedi, bolangni tortib olaman deb tahdid qildi",
      chips: ['Tahdid'],
      expectedFloor: 'red',
      description: "Qurol bilan hayotga tahdid",
    },

    // NEW 5 cases: Stranger, taxi, forced contact, child grooming, place/time threat
    {
      id: 'red_6_new_taxi',
      text: "Taksi haydovchisi mashinadan tushirmayapti, eshikni qulflab oldi, boshqa yo'ldan ketyapti",
      chips: ["Taksi yoki yo'lda bezovta qilish"],
      expectedFloor: 'red',
      description: "Taksi haydovchisi eshikni qulflab, mashinadan tushirmayapti",
    },
    {
      id: 'red_7_new_forced_contact',
      text: "Notanish erkak ko'chada qo'limdan mahkam ushlab, tortingilab kiyimimni yirtmoqchi bo'ldi",
      chips: [],
      expectedFloor: 'red',
      description: "Jismoniy ushlab olish va majburlash harakati",
    },
    {
      id: 'red_8_new_child_grooming',
      text: "Internetda bir amaki 14 yoshli singlimga rasmingni yubor, hech kimga aytma deb uchrashuvga chaqiryapti",
      chips: ["Bolani yoki qizchani aldash, yo'ldan ozdirish"],
      expectedFloor: 'red',
      description: "Voyaga yetmagan bolaga nisbatan sirli yaqinlashuv va grooming",
    },
    {
      id: 'red_9_new_place_time_threat',
      text: "Har kuni ko'chada kutaman, ertaga kelaman deb ishxonam oldida poylab turibdi",
      chips: ["Orqamdan ergashish, kuzatish"],
      expectedFloor: 'red',
      description: "Aniq vaqt va joy aytilgan ta'qib tahdidi",
    },
    {
      id: 'red_10_new_blackmail_harm',
      text: "Rasmlaringni internetga tarqataman deb pul talab qilyapti, bermasang uyingga borib o'ldiraman dedi",
      chips: ["Rasmlarimni tarqatish bilan qo'rqitish (pul yoki boshqa narsa talab qilish)"],
      expectedFloor: 'red',
      description: "Surat tarqatish shantaji bilan birga hayotga o'ldirish tahdidi",
    },
  ],

  yellow: [
    // Original 5 domestic cases
    {
      id: 'yellow_1',
      text: "Erim oylik maoshim va plastik kartamni olib qo'ygan, bir tiyin ham bermaydi",
      chips: ['Pul nazorati'],
      expectedFloor: 'yellow',
      description: "Moliyaviy nazorat va iqtisodiy cheklov",
    },
    {
      id: 'yellow_2',
      text: "Onamnikiga borishimga ruxsat bermaydi, dugonalarim bilan aloqani uzishga majburlaydi",
      chips: ["Yolg'izlantirish"],
      expectedFloor: 'yellow',
      description: "Oila va do'stlardan majburiy yolg'izlantirish",
    },
    {
      id: 'yellow_3',
      text: "Har kuni sen hech kimsan deb haqorat qiladi, sen aqldan ozgansan deb ruhiy bosim o'tkazadi",
      chips: ['Tahdid'],
      expectedFloor: 'yellow',
      description: "Ruhiy kamsitish, haqorat va kamsitish",
    },
    {
      id: 'yellow_4',
      text: "Telefonimni har kuni tekshiradi, parollarimni talab qiladi va ko'chaga chiqishimni taqiqlaydi",
      chips: ['Telefon/aloqa nazorati'],
      expectedFloor: 'yellow',
      description: "Telefon tekshiruvi va erkinlikni cheklash",
    },
    {
      id: 'yellow_5',
      text: "Meni pasportimni olib qo'ygan, gapimga kirmasang ajrashib ko'chaga haydayman deb qo'rqitadi",
      chips: ['Tahdid'],
      expectedFloor: 'yellow',
      description: "Hujjatlarni olib qo'yish va ajrashish bilan qo'rqitish",
    },

    // NEW 5 cases: Stalking, sextortion, workplace harassment, online threats
    {
      id: 'yellow_6_new_stalking',
      text: "Bir notanish odam har kuni metro bekatidan uyimgacha orqamdan ergashadi va kuzatib yuradi",
      chips: ["Orqamdan ergashish, kuzatish"],
      expectedFloor: 'yellow',
      description: "Ko'chada orqadan ergashish va kuzatib yurish",
    },
    {
      id: 'yellow_7_new_sextortion',
      text: "Eski tanishim shaxsiy rasmlaringni internetda tarqataman deb 5 million so'm pul talab qilyapti",
      chips: ["Rasmlarimni tarqatish bilan qo'rqitish (pul yoki boshqa narsa talab qilish)"],
      expectedFloor: 'yellow',
      description: "Shaxsiy suratlarni tarqatish tahdidi bilan pul talab qilish",
    },
    {
      id: 'yellow_8_new_workplace',
      text: "Ish joyimda boshliq menga noo'rin bosim o'tkazmoqda, rozi bo'lmasang ishdan bo'shataman deb qo'rqityapti",
      chips: ["Ish yoki o'qish joyida bosim va bezovta qilish"],
      expectedFloor: 'yellow',
      description: "Ishxonada boshliq tomonidan nojo'ya bosim",
    },
    {
      id: 'yellow_9_new_online_threat',
      text: "Telegramda begona profildan haqorat qilib, yozishmalarni tarqataman deb ruhiy bosim o'tkazmoqda",
      chips: ["Internetda tahdid yoki shantaj"],
      expectedFloor: 'yellow',
      description: "Ijtimoiy tarmoqda anonim profil orqali bosim va haqorat",
    },
    {
      id: 'yellow_10_new_taxi_verbal',
      text: "Taksida haydovchi behayo gaplar gapirib, telefon raqamimni so'rab noo'rin bezovta qildi",
      chips: ["Taksi yoki yo'lda bezovta qilish"],
      expectedFloor: 'yellow',
      description: "Taksida og'zaki noo'rin bezovta qilish holati",
    },
  ],

  green: [
    // Original 5 domestic cases
    {
      id: 'green_1',
      text: "Turmush o'rtog'im bilan oxirgi paytlarda kelisholmay qolyapmiz, juda charchaganman va tushunmovchiliklar ko'p",
      chips: [],
      expectedFloor: 'green',
      description: "Hissiy charchoq va oilaviy tushunmovchilik",
    },
    {
      id: 'green_2',
      text: "Uy yumushlari va ro'zg'or masalasida tez-tez tortishib qolamiz, muloqotimiz sovuqlashgan",
      chips: [],
      expectedFloor: 'green',
      description: "Ro'zg'or tortishuvi, zo'ravonliksiz holat",
    },
    {
      id: 'green_3',
      text: "Qaynonam bilan fikrimiz har doim ham to'g'ri kelmaydi, o'rtada tushunmovchilik bor, lekin hech qanday zo'ravonlik yo'q",
      chips: [],
      expectedFloor: 'green',
      description: "Oila a'zolari bilan fikr qarama-qarshiligi",
    },
    {
      id: 'green_4',
      text: "Ikkalamiz ham ishda ko'p charchaymiz, bir-birimizga kam vaqt ajratayotganimiz sababli xafa bo'lib turamiz",
      chips: [],
      expectedFloor: 'green',
      description: "Ishdagi toliqish va vaqt yetishmasligi",
    },
    {
      id: 'green_5',
      text: "Munosabatlarimizdagi sovuqlik va zerikishdan xavotirdaman, muloqot qilishimiz qiyinlashib qoldi",
      chips: [],
      expectedFloor: 'green',
      description: "Hissiy sovuqlashish, shaxsiy chegaralar ehtiyoji",
    },

    // NEW 5 cases: Benign non-violent queries in study, work, transport, chat
    {
      id: 'green_6_new_chat',
      text: "Telegram guruhida bir foydalanuvchi bilan fikrimiz to'g'ri kelmadi, xafa bo'lib guruhdan chiqib ketdim",
      chips: ['Boshqa'],
      expectedFloor: 'green',
      description: "Guruhda oddiy fikr qarama-qarshiligi",
    },
    {
      id: 'green_7_new_bus',
      text: "Avtobusda yo'l haqini to'lashda konduktor bilan tushunmovchilik bo'ldi, biroz asabiylashdim",
      chips: [],
      expectedFloor: 'green',
      description: "Jamoat transportidagi oddiy ro'zg'or tushunmovchiligi",
    },
    {
      id: 'green_8_new_study',
      text: "Institutda sessiya payti imtihonlardan juda qattiq charchadim va stress holatidaman",
      chips: [],
      expectedFloor: 'green',
      description: "O'qishdagi imtihon stressi va toliqish",
    },
    {
      id: 'green_9_new_colleague',
      text: "Hamkasbim bilan yangi loyiha bo'yicha bahslashib qoldik, munosabatlarimiz biroz sovuqlashdi",
      chips: [],
      expectedFloor: 'green',
      description: "Hamkasb bilan ish jarayonidagi oddiy fikr almashinuvi",
    },
    {
      id: 'green_10_new_boundary',
      text: "Yangi tanishgan odamim juda ko'p xabar yozyapti, tez-tez gaplashishga vaqtim yo'q, xushmuomalalik bilan tushuntirmoqchiman",
      chips: [],
      expectedFloor: 'green',
      description: "Yangi tanishuvda shaxsiy chegaralarni belgilash",
    },
  ],
};

console.log('🧪 Starting HimoyaAI Extended Safety Rule Tests (30 total cases)...\n');

let passed = 0;
let failed = 0;

['red', 'yellow', 'green'].forEach((level) => {
  console.log(`--- Testing Level: ${level.toUpperCase()} (10 cases) ---`);
  testCases[level].forEach((tc, idx) => {
    const res = evaluateSafetyRules(tc.text, tc.chips);
    try {
      assert.strictEqual(
        res.floorLevel,
        tc.expectedFloor,
        `Expected ${tc.expectedFloor} but got ${res.floorLevel} for: "${tc.text}"`
      );

      if (tc.expectedFloor === 'red') {
        assert.ok(res.minRiskPercent >= 67, `Red floor percent must be >= 67%, got ${res.minRiskPercent}%`);
        assert.ok(res.hasRedFlags === true, `Red flags flag must be true`);
      } else if (tc.expectedFloor === 'yellow') {
        assert.ok(
          res.minRiskPercent >= 34 && res.minRiskPercent <= 66,
          `Yellow floor percent must be 34-66%, got ${res.minRiskPercent}%`
        );
        assert.ok(res.hasRedFlags === false, `Yellow must not have red flags`);
      } else if (tc.expectedFloor === 'green') {
        assert.ok(
          res.minRiskPercent <= 33,
          `Green percent must be <= 33%, got ${res.minRiskPercent}%`
        );
        assert.ok(res.hasRedFlags === false, `Green must not have red flags`);
      }

      console.log(`  ✓ [${idx + 1}/10] PASS: ${tc.description} -> ${res.floorLevel.toUpperCase()} (${res.minRiskPercent}%)`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [${idx + 1}/10] FAIL: ${tc.description}`);
      console.error(`    ${err.message}`);
      failed++;
    }
  });
  console.log('');
});

console.log(`=================================`);
console.log(`Test Summary: ${passed} PASSED, ${failed} FAILED`);
console.log(`=================================`);

if (failed > 0) {
  process.exit(1);
} else {
  console.log('✅ All 30 deterministic safety rule tests succeeded without errors!');
}
