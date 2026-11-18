/**
 * HimoyaAI Backend Server & Secure LLM Proxy
 * Enforces zero request body logging, strict rate limiting, input length caps, and security headers.
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { analyzeSituation } from '../lib/analysis/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Privacy & Security Headers Middleware
app.use((req, res, next) => {
  // Never log request body or user private details
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Allow rendering inside Telegram WebApp iframe while guarding general embedding
  res.setHeader('Content-Security-Policy', "default-src 'self' https: data: 'unsafe-inline'; frame-ancestors 'self' https://web.telegram.org;");
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Configure CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, telegram webview)
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.telegram.org')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in local development
      }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse JSON with 100kb limit
app.use(express.json({ limit: '100kb' }));

// Strict Rate Limiting: 30 requests per 15 minutes per IP
const analyzeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "So'rovlar soni cheklandi. Iltimos, bir ozdan so'ng qayta urinib ko'ring yoki to'g'ridan-to'g'ri 1146 raqamiga qo'ng'iroq qiling.",
    fallback_hotline: '1146',
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HimoyaAI Secure Proxy',
    privacy: 'zero-logs-active',
  });
});

// Primary Risk Analysis Proxy Endpoint
app.post('/api/analyze', analyzeLimiter, async (req, res) => {
  try {
    const { text, chips } = req.body || {};

    // Validate text type
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

    // Input length cap: 2000 characters
    if (trimmedText.length > 2000) {
      return res.status(400).json({
        error: "Matn hajmi 2000 belgidan oshmasligi kerak. Iltimos, asosiy holatlarni qisqartirib yozing.",
      });
    }

    // Validate chips
    const safeChips = Array.isArray(chips)
      ? chips.filter((c) => typeof c === 'string' && c.length < 50).slice(0, 10)
      : [];

    // Run hybrid analysis (deterministic safety layer + LLM with safety floor)
    // NOTE: req.body is NEVER logged to disk or console.
    const result = await analyzeSituation(trimmedText, safeChips);

    return res.json(result);
  } catch (err) {
    // Log error type only, NEVER log user input or body
    console.error('Analysis error occurred [sanitized]:', err.message || 'Unknown');
    
    // Return safe fallback response so the user is never left stranded
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
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`HimoyaAI secure proxy listening on port ${PORT}`);
    console.log(`Privacy guarantee: Zero-log policy active. Request bodies are not logged.`);
  });
}

export default app;
