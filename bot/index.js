/**
 * HimoyaAI Companion Telegram Bot
 * Built with Telegraf.
 * 
 * Features:
 * - /start: Sends greeting and inline button with web_app to launch the HimoyaAI Mini App.
 * - Text messages: Evaluates direct message in chat using the exact same shared hybrid analysis module.
 * - Privacy: Zero-log policy, no database, messages exist only in memory during execution.
 */

import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';
import { analyzeSituation } from '../lib/analysis/index.js';

dotenv.config();

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://himoya-ai.uz';

if (!BOT_TOKEN) {
  console.warn('⚠️ TELEGRAM_BOT_TOKEN is not set in environment variables. Telegram bot will not start automatically.');
}

export function createBot() {
  if (!BOT_TOKEN) return null;

  const bot = new Telegraf(BOT_TOKEN);

  // /start command
  bot.command('start', async (ctx) => {
    const welcomeText = `Assalomu alaykum.

"HimoyaAI" — xotin-qizlar uchun anonim va xavfsiz dastlabki vaziyatni baholash va yo'naltirish tizimi.

Siz bu yerda o'z vaziyatingizni erkin bayon qilishingiz yoki to'liq qulaylik uchun Mini Ilovani ochishingiz mumkin.

🛡 Xavfsizlik kafolati:
• 100% anonim, shaxsingiz so'ralmaydi
• Xabarlar va yozishmalar hech qayerda saqlanmaydi
• Bepul va kunu-tun xolis ko'mak

Quyidagi tugma orqali ilovani to'liq interfeysda ochishingiz yoki shunchaki vaziyatingizni xabar sifatida yozib yuborishingiz mumkin:`;

    await ctx.reply(
      welcomeText,
      Markup.inlineKeyboard([
        [Markup.button.webApp('🌸 HimoyaAI ilovasini ochish', WEBAPP_URL)],
        [Markup.button.callback('📞 Tezkor yordam raqamlari', 'quick_contacts')],
        [Markup.button.callback('🔒 Maxfiylik haqida', 'privacy_info')],
      ])
    );
  });

  // /help command
  bot.command('help', async (ctx) => {
    const helpText = `ℹ️ "HimoyaAI" botidan foydalanish bo'yicha yo'riqnoma:

1. "HimoyaAI ilovasini ochish" tugmasini bosing — ilova Telegram ichida xavfsiz ochiladi va qurilmangizga o'rnatilmaydi.
2. Yoki bevosita ushbu chatga vaziyatingizni o'z so'zlaringiz bilan yozing.
3. Tizim holatni xolis tahlil qilib, xavf darajasi, asosiy belgilar va amaliy qadamlarni taqdim etadi.

Tezkor ishonch telefonlari:
📞 1146 — Ayollar va bolalar ishonch telefoni (24/7)
🚨 102 — Ichki ishlar (favqulodda xavf tug'ilganda)`;

    await ctx.reply(helpText);
  });

  // /privacy command
  bot.command('privacy', async (ctx) => {
    const privacyText = `🔒 Maxfiylik va xavfsizlik:

• Hech qanday ma'lumotlar bazasi mavjud emas.
• Yozgan matningiz serverda saqlanib qolmaydi.
• Agar telefoningizni boshqalar tekshirishi ehtimoli bo'lsa, tahlildan so'ng ushbu chatni tozalab qo'yishni (Clear history) unutmang.
• Telegram Mini App orqali kirganingizda telefoningiz xotirasida hech qanday ilova fayllari saqlanmaydi.`;

    await ctx.reply(privacyText);
  });

  // Callback query: quick_contacts
  bot.action('quick_contacts', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(
      `📞 Shoshilinch yordam xizmatlari:\n\n` +
      `🚨 102 — Ichki ishlar organi (hayotga xavf tug'ilganda)\n` +
      `📞 1146 — Ayollar va bolalar ishonch telefoni (24/7, bepul)\n` +
      `🏛 1140 — Oliy Majlis Inson huquqlari bo'yicha vakili (Ombudsman)\n` +
      `⚖️ 1008 — "Madad" bepul yuridik yordam portali`
    );
  });

  // Callback query: privacy_info
  bot.action('privacy_info', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.reply(
      `🛡 Anonimlik:\n` +
      `Sizdan ism, familiya yoki telefon raqami so'ralmaydi.\n` +
      `Server va bot hech qanday shaxsiy yozuvlarni saqlamaydi.`
    );
  });

  // Handle direct text message for situation evaluation
  bot.on('text', async (ctx) => {
    const text = ctx.message.text;

    // Ignore commands
    if (text.startsWith('/')) return;

    await ctx.sendChatAction('typing');

    try {
      const assessment = await analyzeSituation(text, []);

      // Format response based on risk level
      let levelEmoji = '🟢';
      let levelLabel = 'PAST XAVF DARAJASI';

      if (assessment.level === 'red') {
        levelEmoji = '🔴';
        levelLabel = 'YUQORI XAVF DARAJASI (SHOSHILINCH)';
      } else if (assessment.level === 'yellow') {
        levelEmoji = '🟡';
        levelLabel = "O'RTA XAVF DARAJASI (E'TIBOR TALAB QILINADI)";
      }

      let message = `${levelEmoji} *${levelLabel}* (${assessment.risk_percent}%)\n\n`;
      message += `📝 *Xulosa:* ${assessment.summary}\n\n`;

      if (assessment.signs && assessment.signs.length > 0) {
        message += `⚠️ *Asosiy belgilar:*\n`;
        assessment.signs.forEach((s) => {
          message += `• ${s}\n`;
        });
        message += `\n`;
      }

      if (assessment.next_steps && assessment.next_steps.length > 0) {
        message += `👣 *Tavsiya etiladigan xavfsizlik qadamlari:*\n`;
        assessment.next_steps.forEach((step, idx) => {
          message += `${idx + 1}. ${step}\n`;
        });
        message += `\n`;
      }

      if (assessment.level === 'red') {
        message += `🚨 *DIQQAT:* Zudlik bilan xavfsiz joyga o'ting va 102 yoki 1146 raqamiga qo'ng'iroq qiling!\n\n`;
      }

      message += `_Eslatma: Bu avtomatik dastlabki baholash bo'lib, mutaxassis ko'rigi o'rnini bosmaydi._`;

      await ctx.reply(
        message,
        {
          parse_mode: 'Markdown',
          ...Markup.inlineKeyboard([
            [Markup.button.webApp("Batafsil ma'lumot (Ilovada)", WEBAPP_URL)],
            [Markup.button.callback('📞 Tezkor yordam raqamlari', 'quick_contacts')],
          ]),
        }
      );
    } catch {
      await ctx.reply(
        `Kechirasiz, xabarni tahlil qilishda nosozlik yuz berdi. Iltimos, quyidagi bepul ishonch telefonlariga murojaat qiling:\n\n` +
        `📞 1146 — Ishonch telefoni\n` +
        `🚨 102 — Ichki ishlar`
      );
    }
  });

  return bot;
}

// Auto-run when executed directly
if (process.argv[1]?.replace(/\\/g, '/').endsWith('bot/index.js')) {
  const bot = createBot();
  if (bot) {
    bot.launch(() => {
      console.log('🤖 HimoyaAI Telegram Bot started successfully.');
    });

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  }
}
