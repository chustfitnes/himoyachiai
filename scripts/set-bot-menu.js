/**
 * Script to automatically set Telegram Bot Chat Menu Button
 * to open the HimoyaAI Telegram Mini App.
 *
 * Usage:
 *   node scripts/set-bot-menu.js
 */

import dotenv from 'dotenv';
dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://himoyachiai2026.vercel.app/';

if (!BOT_TOKEN) {
  console.error('❌ Xatolik: .env faylida TELEGRAM_BOT_TOKEN topilmadi.');
  process.exit(1);
}

console.log(`🚀 Telegram Bot Menu Button o'rnatilmoqda...`);
console.log(`🔗 WebApp URL: ${WEBAPP_URL}`);

try {
  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setChatMenuButton`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      menu_button: {
        type: 'web_app',
        text: '🌸 HimoyaAI ilovasi',
        web_app: {
          url: WEBAPP_URL,
        },
      },
    }),
  });

  const data = await response.json();
  if (data.ok) {
    console.log('✅ Muvaffaqiyatli! Telegram bot pastki menyu tugmasi Mini App uchun sozlandi.');
    console.log('Endi Telegram botga kirib tekshirishingiz mumkin.');
  } else {
    console.error('❌ Telegram API xatoligi:', data.description);
  }
} catch (error) {
  console.error('❌ So\'rov yuborishda xatolik:', error.message);
}
