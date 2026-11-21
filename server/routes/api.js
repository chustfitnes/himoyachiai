import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { handleAnalyze, handleAnalyzeStream } from '../controllers/analyzeController.js';
import { validateAnalyzeRequest } from '../validators/analyzeValidator.js';
import { analyzeLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HimoyaAI Enterprise Proxy',
    privacy: 'zero-logs-active',
    timestamp: new Date().toISOString(),
  });
});

// Primary Risk Analysis (JSON)
router.post('/analyze', analyzeLimiter, validateAnalyzeRequest, handleAnalyze);

// Real-time Streaming Risk Analysis (SSE)
router.post('/analyze/stream', analyzeLimiter, validateAnalyzeRequest, handleAnalyzeStream);

// Verified Centers & Hotlines Directory
router.get('/centers', (req, res) => {
  try {
    const centersPath = path.resolve(process.cwd(), 'data', 'centers.json');
    if (fs.existsSync(centersPath)) {
      const data = JSON.parse(fs.readFileSync(centersPath, 'utf8'));
      return res.json(data);
    }
    res.json({ national_hotlines: [], regions: [] });
  } catch {
    res.status(500).json({ error: "Markazlar ma'lumotini yuklashda xatolik" });
  }
});

export default router;
