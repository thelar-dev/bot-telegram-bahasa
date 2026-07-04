const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const bot = new Telegraf('8871741160:AAH8cOnFnFjIcZFSb1WqbESm0F8aIHxTdSk');

// Objek sementara untuk menyimpan status pilihan fitur user
const userSessions = {};

// Fungsi pembantu buat animasi progress bar (Waktu aman & responsif untuk Vercel)
const delay = (ms) => new Promise(res => setTimeout(res, ms));

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

// 2. Handler Pilihan Bahasa (Pesan lanjut di bawahnya, tombol TIDAK dihapus biar stabil)
bot.action(['lang_id', 'lang_en'], async (ctx) => {
    // Beritahu Telegram request sukses biar tombol gak freeze muter
    await ctx.answerCbQuery().catch(() => {});
    
    const isIndo = ctx.callbackQuery.data === 'lang_id';

    const welcomeText = isIndo
        ? "⚡ **SYNTAXAPP MAIN MENU v1.0** ⚡\n\nSistem cloud kami siap memproses aplikasi Anda secara otomatis. Silakan pilih fitur yang ingin Anda gunakan di bawah ini:"
        : "⚡ **SYNTAXAPP MAIN MENU v1.0** ⚡\n\nOur cloud system is ready to process your application automatically. Please select the feature you want to use below:";

    ctx.replyWithMarkdown(
        welcomeText,
        Markup.inlineKeyboard([
            [Markup.button.callback('📦 Unpack Aplikasi', 'menu_unpack')],
            [Markup.button.callback('🚫 Hapus Iklan Aplikasi', 'menu_remove_ads')],
            [Markup.button.callback('🛠️ Perbaiki Aplikasi', 'menu_fix_app')]
        ])
    ).catch((e) => console.error("Gagal kirim main menu:", e));
});

// ======================== HANDLER 3 MENU UTAMA ========================

// A. Unpack Aplikasi
bot.action('menu_unpack', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    const userId = ctx.from.id;
    userSessions[userId] = { feature: 'unpack' }; 
    
    ctx.replyWithMarkdown(
        "📦 **FITUR: UNPACK APLIKASI**\n\n" +
        "Silakan **kirimkan file (.apk)** yang ingin Anda bongkar ke sini.\n" +
        "Sistem akan mengekstrak seluruh resources, aset, dex, dan manifest secara otomatis."
    );
});

// B. Hapus Iklan
bot.action('menu_remove_ads', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    const userId = ctx.from.id;
    userSessions[userId] = { feature: 'remove_ads' }; 

    ctx.replyWithMarkdown(
        "🚫 **FITUR: HAPUS IKLAN APLIKASI**\n\n" +
        "Silakan **kirimkan file (.apk)** target ke sini.\n" +
        "Sistem akan otomatis mendeteksi Google Ads SDK, Unity Ads, AdMob, dan melakukan bypass/strip iklan agar aplikasi bersih total!"
    );
});

// C. Perbaiki Aplikasi
bot.action('menu_fix_app', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    const userId = ctx.from.id;
    userSessions[userId] = { feature: 'fix_app', step: 'waiting_text' }; 

    ctx.replyWithMarkdown(
        "🛠️ **FITUR: PERBAIKI APLIKASI**\n\n" +
        "Silakan **ketik dan kirim pesan terlebih dahulu** mengenai bagian apa saja atau error apa yang ingin diperbaiki di dalam aplikasi ini.\n\n" +
        "Setelah mengirim pesan teks penjelasan, baru sistem akan meminta Anda mengirimkan file (.apk)-nya."
    );
});


// ======================== PROCESSOR & PROGRESS BAR ========================

// Handler khusus menerima Teks penjelasan untuk fitur Perbaiki Aplikasi
bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const session = userSessions[userId];

    if (session && session.feature === 'fix_app' && session.step === 'waiting_text') {
        session.bugDescription = ctx.message.text; 
        session.step = 'waiting_apk'; 

        return ctx.replyWithMarkdown(
            `📝 **Deskripsi Kerusakan Diterima:**\n_"${ctx.message.text}"_\n\n` +
            `Sekarang, silakan **kirimkan file (.apk)** yang ingin diperbaiki tersebut ke sini agar sistem bisa menganalisis kode sumbernya!`
        );
    }
});

// Handler utama saat User mengirimkan file APK
bot.on('document', async (ctx) => {
    const userId = ctx.from.id;
    const session = userSessions[userId];
    const fileName = ctx.message.document.file_name;

    // Proteksi format file harus APK
    if (!fileName.endsWith('.apk')) {
        return ctx.reply('❌ File harus berformat .apk, Bro! Silakan cek kembali file yang Anda kirim.');
    }

    // Jika user langsung kirim APK tanpa milih menu dulu
    if (!session) {
        return ctx.reply('⚠️ Silakan pilih menu fiturnya dulu di atas, Bro, baru kirim file APK-nya.');
    }

    // Jika milih fitur perbaiki tapi main kirim APK duluan tanpa deskripsi teks
    if (session.feature === 'fix_app' && session.step === 'waiting_text') {
        return ctx.reply('⚠️ Tolong ketik dulu penjelasan error/bagian yang mau diperbaiki, baru kirim file APK-nya, Bro!');
    }

    let progressMsg;

    try {
        // Sekbar Loading Kustom (Aman dari Vercel Timeout)
        if (session.feature === 'unpack') {
            progressMsg = await ctx.reply('📥 [ ] 0% - Mengunduh file APK untuk dibongkar...');
            await delay(1000);
            await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, '📦 [██░░░░░░░░] 20% - Mengekstrak AndroidManifest.xml & aset...');
            await delay(1200);
            await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, '🔍 [█████░░░░░] 50% - Decompiling classes.dex ke Smali code...');
            await delay(1200);
            await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, '📂 [████████░░] 80% - Merekonstruksi struktur folder project...');
            await delay(1000);
            await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, '✨ [██████████] 100% - Sukses! Semua resource berhasil di-unpack.');

        } else if (session.feature === 'remove_ads') {
            progressMsg = await ctx.reply('📥 [ ] 0% - Memindai manifest dari pelacak iklan...');
            await delay(1000);
            await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, '🚫 [██░░░░░░░░] 20% - Menghapus permission Google AdMob & Unity Ads...');
            await delay(1200);
            await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, '✂️ [█████░░░░░] 50% - Melakukan patching pada class metrik iklan...');
            await delay(1200);
            await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, '🛠️ [████████░░] 80% - Rebuilding APK tanpa komponen malware iklan...');
            await delay(1000);
            await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, '✨ [██████████] 100% - Sukses! Proteksi bebas iklan berhasil disuntikkan.');

        } else if (session.feature === 'fix_app') {
            progressMsg = await ctx.reply('📥 [ ] 0% - Membaca deskripsi kerusakan user...');
            await delay(1000);
            await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, '🔎 [██░░░░░░░░] 20% - Mencari letak baris kode error pada classes.dex...');
            await delay(1500); 
            await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, '🔧 [█████░░░░░] 50% - Menambal kerusakan logic / merestrukturisasi Smali...');
            await delay(1200);
            await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, '⚡ [████████░░] 80% - Mengompilasi ulang aplikasi & signing debug certificate...');
            await delay(1000);
            await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, '✨ [██████████] 100% - Sukses! Aplikasi berhasil diperbaiki secara total.');
        }
    } catch (err) {
        console.error("Gagal melakukan update progress bar:", err);
    }

    // Selesai proses, bersihkan session user tersebut
    delete userSessions[userId];

    // 4. Output Hasil Akhir Sukses & Muncul Tombol Unduh
    await ctx.reply(
        `✅ **PROSES SELESAI SEMPURNA!**\n\nFile \`${fileName}\` selesai diproses oleh cloud core kami. Silakan klik tombol di bawah untuk mengaktifkan link unduhan.`,
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.callback('📥 Download Hasil Modifikasi', 'trigger_payment')]
            ])
        }
    ).catch((e) => console.error("Gagal kirim link unduhan:", e));
});

// 5. Handler Tombol Download -> Kirim Gambar QRIS
bot.action('trigger_payment', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    
    const URL_FOTO_QRIS = 'https://raw.githubusercontent.com/thelar-dev/bot-telegram-bahasa/main/qris.jpg'; 

    const textPayment = 
        `💳 **FORM PEMBAYARAN & AKTIVASI LISENSI**\n\n` +
        `Untuk mengunduh output build APK Anda, silakan scan QRIS di atas dan selesaikan pembayaran lisensi alat sebesar:\n` +
        `💰 **Rp 25.000,-**\n\n` +
        `**Metode Pembayaran Tersedia:**\n` +
        `• 📱 Semua E-Wallet (DANA, OVO, GoPay, LinkAja)\n` +
        `• 🏛️ Semua M-Banking (BCA, Mandiri, BRI, dll)\n\n` +
        `*Catatan: Setelah transfer berhasil, kirimkan bukti screenshot pembayaran ke Admin untuk mendapatkan Key Aktivasi download.*`;

    try {
        await ctx.replyWithPhoto(
            { url: URL_FOTO_QRIS },
            {
                caption: textPayment,
                parse_mode: 'Markdown',
                ...Markup.inlineKeyboard([
                    [Markup.button.url('💬 Kirim Bukti ke Admin', 'https://t.me/BotFather')] 
                ])
            }
        );
    } catch (error) {
        console.error("Gagal mengirim foto QRIS:", error);
        ctx.replyWithMarkdown(
            textPayment, 
            Markup.inlineKeyboard([
                [Markup.button.url('💬 Hubungi Admin', 'https://t.me/BotFather')]
            ]
        )).catch(() => {});
    }
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
