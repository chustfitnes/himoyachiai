/**
 * Request Validation for Risk Assessment
 */
export function validateAnalyzeRequest(req, res, next) {
  const { text, chips } = req.body || {};

  if (typeof text !== 'string') {
    return res.status(400).json({
      error: "Yaroqsiz ma'lumot formati. Matn kiritilishi shart.",
    });
  }

  const trimmedText = text.trim();
  if (trimmedText.length === 0) {
    return res.status(400).json({
      error: "Iltimos, vaziyatingizni bir necha so'z bilan tasvirlab bering.",
    });
  }

  if (trimmedText.length > 2000) {
    return res.status(400).json({
      error: "Matn hajmi 2000 belgidan oshmasligi kerak. Iltimos, asosiy holatlarni qisqartirib yozing.",
    });
  }

  // Sanitize chips array
  req.sanitizedChips = Array.isArray(chips)
    ? chips.filter((c) => typeof c === 'string' && c.length < 50).slice(0, 10)
    : [];

  req.sanitizedText = trimmedText;

  next();
}
