import assert from 'node:assert';
import { analyzeSituation, formatResponsePayload } from '../lib/analysis/index.js';

console.log('🧪 Testing Analysis Engine & Payload Normalization...');

async function testAnalysisEngine() {
  // Test 1: Red danger case fallback & format
  const redResult = await analyzeSituation("Erim pichoq bilan o'ldiraman deyapti", []);
  assert.strictEqual(redResult.level, 'red');
  assert.strictEqual(redResult.risk_level, 'red');
  assert.ok(redResult.risk_percent >= 75);
  assert.ok(redResult.confidence_pct >= 75);
  assert.ok(Array.isArray(redResult.signs));
  assert.ok(Array.isArray(redResult.signals));
  assert.ok(Array.isArray(redResult.next_steps));
  assert.ok(redResult.playbook && Array.isArray(redResult.playbook.steps));
  assert.ok(redResult.contacts.includes('police_102'));
  console.log('  ✓ PASS: Red danger case returns unified normalized payload');

  // Test 2: Child danger case
  const childResult = await analyzeSituation(
    "Internetda bir amaki 14 yoshli singlimga rasmingni yubor, hech kimga aytma deb uchrashuvga chaqiryapti",
    ["Bolani yoki qizchani aldash, yo'ldan ozdirish"]
  );
  assert.strictEqual(childResult.level, 'red');
  assert.ok(childResult.contacts.includes('trusted_adult'));
  console.log('  ✓ PASS: Child grooming case triggers red floor with trusted_adult');

  // Test 3: formatResponsePayload edge cases
  const custom = formatResponsePayload({
    level: 'yellow',
    risk_percent: 52,
    summary: 'Sinov xulosa',
    signs: ['Belgi 1'],
    next_steps: ['Qadam 1', 'Qadam 2'],
    contacts: ['hotline_1146']
  });
  assert.strictEqual(custom.risk_level, 'yellow');
  assert.strictEqual(custom.confidence_pct, 52);
  assert.strictEqual(custom.signals[0], 'Belgi 1');
  assert.strictEqual(custom.playbook.action_summary, 'Sinov xulosa');
  assert.strictEqual(custom.playbook.steps.length, 2);
  console.log('  ✓ PASS: formatResponsePayload correctly maps aliases');

  console.log('✅ Analysis Engine test suite passed successfully!\n');
}

testAnalysisEngine().catch((err) => {
  console.error('❌ Analysis Engine test failed:', err);
  process.exit(1);
});
