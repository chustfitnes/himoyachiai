import { analyzeSituation } from '../../lib/analysis/index.js';

/**
 * Standard POST /api/analyze controller
 */
export async function handleAnalyze(req, res) {
  try {
    const text = req.sanitizedText;
    const chips = req.sanitizedChips;

    // Never log req.body or text to preserve Zero-Log privacy guarantee
    const result = await analyzeSituation(text, chips);
    return res.json(result);
  } catch (err) {
    console.error('Analysis controller error [sanitized]:', err.message || 'Unknown');
    return res.status(500).json({
      risk_percent: 50,
      level: 'yellow',
      summary: "Tizimda vaqtinchalik uzilish yuz berdi. Agar siz o'zingizni xavfsiz his qilmasangiz, darhol quyidagi ishonch raqamlariga murojaat qiling.",
      signs: [
        "Vaqtinchalik texnik cheklov yuz berdi",
        "Mutaxassis bilan to'g'ridan-to'g'ri bog'lanish tavsiya etiladi"
      ],
      next_steps: [
        "1146 bepul ishonch telefoniga qo'ng'iroq qiling (24/7 ishlaydi).",
        "Shoshilinch xavf yuzaga kelsa, 102 (Ichki ishlar) xizmatiga ulaning."
      ],
      contacts: ['hotline_1146', 'police_102', 'inson_center'],
    });
  }
}

/**
 * Real-time SSE Streaming POST /api/analyze/stream controller
 * Provides live step-by-step progress and instant delivery.
 */
export async function handleAnalyzeStream(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendEvent = (event, data) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  try {
    const text = req.sanitizedText;
    const chips = req.sanitizedChips;

    sendEvent('phase', { step: 1, message: "1/3: Vaziyat deterministik xavfsizlik qoidalariga solinmoqda..." });

    // Brief heartbeat for smooth UX
    await new Promise((r) => setTimeout(r, 200));

    sendEvent('phase', { step: 2, message: "2/3: Xavf darajasi va himoya choralari aniqlanmoqda..." });

    const result = await analyzeSituation(text, chips);

    sendEvent('phase', { step: 3, message: "3/3: Amaliy qadamlar va ishonchli kontaktlar tayyorlandi." });
    sendEvent('result', result);
    sendEvent('done', { status: 'complete' });

    res.end();
  } catch (err) {
    console.error('SSE Stream error [sanitized]:', err.message || 'Unknown');
    sendEvent('error', {
      message: "Tahlilda xatolik. Zaxira xavfsizlik rejasi yuklanmoqda...",
      fallback_contacts: ['1146', '102']
    });
    res.end();
  }
}
