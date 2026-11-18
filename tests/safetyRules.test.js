/**
 * Automated Safety Rule Verification Test Suite
 * Tests deterministic safety layer on 15 real-world Uzbek scenarios (5 per level: Red, Yellow, Green)
 */

import assert from 'node:assert';
import { evaluateSafetyRules } from '../lib/safetyRules/index.js';

const testCases = {
  red: [
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
  ],

  yellow: [
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
  ],

  green: [
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
  ],
};

console.log('🧪 Starting HimoyaAI Deterministic Safety Rule Tests...\n');

let passed = 0;
let failed = 0;

['red', 'yellow', 'green'].forEach((level) => {
  console.log(`--- Testing Level: ${level.toUpperCase()} (5 cases) ---`);
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

      console.log(`  ✓ [${idx + 1}/5] PASS: ${tc.description} -> ${res.floorLevel.toUpperCase()} (${res.minRiskPercent}%)`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [${idx + 1}/5] FAIL: ${tc.description}`);
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
  console.log('✅ All deterministic safety rule tests succeeded without errors!');
}
