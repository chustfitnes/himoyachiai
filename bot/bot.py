"""HimoyaAI Telegram Bot (Aiogram 3.x).

Zero-Log Architecture:
- Bot strictly launches the Telegram Mini App.
- Does NOT accept or process personal text in chat history (to prevent eavesdropping in Telegram chat history).
- If user writes in chat, politely directs them to open the secure Mini App.
"""

import os
import asyncio
import logging
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import CommandStart
from aiogram.types import WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton

# Environment variables
BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "7969372225:AAH_DEMO_TOKEN_PLACEHOLDER")
MINI_APP_URL = os.getenv("TELEGRAM_MINI_APP_URL") or os.getenv("WEBAPP_URL") or "https://himoyachiai2026.vercel.app/"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("HimoyaAIBot")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()

def get_mini_app_keyboard() -> InlineKeyboardMarkup:
    """Returns safe Mini App launcher button."""
    button = InlineKeyboardButton(
        text="🛡️ HimoyaAI — Ilovani ochish",
        web_app=WebAppInfo(url=MINI_APP_URL)
    )
    return InlineKeyboardMarkup(inline_keyboard=[[button]])

@dp.message(CommandStart())
async def handle_start(message: types.Message):
    """Safe, neutral greeting with Mini App button."""
    await message.answer(
        "Assalomu alaykum.\n\n"
        "Xavfsizlik, ruhiy ko‘mak va huquqiy yo‘naltirish tizimiga xush kelibsiz.\n\n"
        "🔒 Sizning to‘liq maxfiyligingizni ta’minlash va Telegram chat tarixida shaxsiy yozishmalar saqlanib qolmasligi uchun, barcha tahlillar faqat xavfsiz Mini App ichida amalga oshiriladi.\n\n"
        "Quyidagi tugma orqali ilovani oching:",
        reply_markup=get_mini_app_keyboard()
    )

@dp.message(F.text)
async def handle_user_text(message: types.Message):
    """Safe deflection: does NOT process or store text from chat history."""
    await message.answer(
        "⚠️ Xavfsizlik eslatmasi:\n\n"
        "Shaxsiy xavfsizligingiz uchun chatga matn yozmang (telefoningizni boshqa odam ko‘rsa, yozishmalar ko‘rinib qolishi mumkin).\n\n"
        "Iltimos, vaziyatingizni xavfsiz va serverda saqlanmaydigan Mini App ichida tasvirlang:",
        reply_markup=get_mini_app_keyboard()
    )

async def main():
    logger.info("Starting HimoyaAI Telegram Bot...")
    await dp.start_polling(bot)

if __name__ == "__main__":
    asyncio.run(main())
