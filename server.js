const { Telegraf, Markup } = require('telegraf');
const express = require('express');

// GANTI dengan Token asli dari BotFather lo!
const bot = new Telegraf('8871741160:AAH8cOnFnFjIcZFSb1WqbESm0F8aIHxTdSk');


bot.start((ctx) => {
    const namaUser = ctx.from.first_name || 'User';
    ctx.reply(
        `Halo ${namaUser}! Selamat datang, ada yang bisa saya bantu?\n\nWelcome! How can I help you?`,
        Markup.inlineKeyboard([
            [
                Markup.button.callback('🇮🇩 Bahasa Indonesia', 'lang_id'),
                Markup.button.callback('🇬🇧 English', 'lang_en')
            ]
        ])
    );
});

bot.action('lang_id', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply('Anda memilih Bahasa Indonesia. Silakan ketik perintah atau pertanyaan Anda selanjutnya!');
});

bot.action('lang_en', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply('You selected English. Please type your command or question next!');
});

const app = express();

// Set Webhook biar Telegram ngirim data ke Vercel lo
// Isikan URL Vercel lo lengkap dari screenshot tadi di bawah ini!
const VERCEL_URL = 'https://bot-telegram-bahasa.vercel.app'; 

app.use(bot.webhookCallback('/api/telegram'));
bot.telegram.setWebhook(`${VERCEL_URL}/api/telegram`)
    .then(() => console.log('Webhook Terpasang!'))
    .catch((err) => console.error('Gagal pasang webhook:', err));

app.get('/', (req, res) => {
    res.send('Bot Online 24 Jam!');
});

module.exports = app;
