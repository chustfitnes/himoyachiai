import rateLimit from 'express-rate-limit';

/**
 * Strict Rate Limiter: 30 requests per 15 minutes per IP
 */
export const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "So'rovlar soni cheklandi. Iltimos, bir ozdan so'ng qayta urinib ko'ring yoki to'g'ridan-to'g'ri 1146 raqamiga qo'ng'iroq qiling.",
    fallback_hotline: '1146',
  },
});
