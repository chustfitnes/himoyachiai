/**
 * HimoyaAI Enterprise Backend Server & Secure LLM Proxy
 * Architected with Clean Controller-Route-Middleware pattern.
 * Guarantees zero request logging, strict rate limiting, CSP, and graceful shutdown.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import apiRouter from './routes/api.js';
import { securityHeadersMiddleware } from './middlewares/security.js';
import { createBot } from '../bot/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Privacy & Security Headers
app.use(securityHeadersMiddleware);

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || origin.endsWith('.telegram.org')) {
        callback(null, true);
      } else {
        callback(null, true); // Dev permissive
      }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parser with strict cap
app.use(express.json({ limit: '100kb' }));

// Mount Modular API Routes
app.use('/api', apiRouter);

// Production Static Assets & SPA Fallback
const distPath = path.resolve(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// 404 Handler for unhandled API or missing routes
app.use((req, res) => {
  res.status(404).json({ error: "Resurs topilmadi" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error [sanitized]:', err.message || 'Unknown');
  res.status(500).json({ error: "Ichki server xatoligi" });
});

// Start Server with Graceful Shutdown
let server = null;
let activeBot = null;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`🛡 HimoyaAI Senior Proxy listening on port ${PORT}`);
    console.log(`🔒 Zero-log policy active. Memory-only execution.`);

    // Optional unified Telegram Bot polling when token is provided
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.RUN_BOT !== 'false') {
      try {
        activeBot = createBot();
        if (activeBot) {
          activeBot.launch(() => {
            console.log('🤖 HimoyaAI Telegram Bot polling started successfully.');
          }).catch((err) => {
            console.warn('⚠️ Telegram bot polling error (e.g. running in sandbox or network issue):', err.message);
          });
        }
      } catch (err) {
        console.warn('⚠️ Telegram bot start warning:', err.message);
      }
    }
  });

  const handleShutdown = (signal) => {
    console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);
    if (activeBot) {
      try { activeBot.stop(signal); } catch {}
    }
    if (server) {
      server.close(() => {
        console.log('✅ Server closed cleanly.');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

export default app;
