const { Telegraf, Markup } = require('telegraf');
const express = require('express');

// GANTI teks di bawah ini dengan Token yang lo dapet dari BotFather tadi!
const bot = new Telegraf('8871741160:AAH8cOnFnFjIcZFSb1WqbESm0F8aIHxTdSk');

// Fungsi saat orang pertama kali klik /start di bot lo
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

// Respon ketika tombol "Bahasa Indonesia" diklik
bot.action('lang_id', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply('Anda memilih Bahasa Indonesia. Silakan ketik perintah atau pertanyaan Anda!');
});

// Respon ketika tombol "English" diklik
bot.action('lang_en', (ctx) => {
    ctx.answerCbQuery();
    ctx.reply('You selected English. Please type your command or question!');
});

// Menjalankan bot Telegram
bot.launch().then(() => console.log('Bot Telegram berhasil berjalan!'));

// Setup Server Express (Ini wajib ditaruh supaya pas di-hosting nanti bot-nya gak mati otomatis)
const app = express();
const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => { res.send('Bot Online 24 Jam!'); });
app.listen(PORT, () => { console.log(`Server aktif di port ${PORT}`); });

// Pengaman jika bot dihentikan mendadak agar tidak crash
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
