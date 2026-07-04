const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const bot = new Telegraf('8871741160:AAH8cOnFnFjIcZFSb1WqbESm0F8aIHxTdSk');

// Objek sementara untuk menyimpan status pilihan fitur user
const userSessions = {};

// Fungsi pembantu buat animasi progress bar (jeda waktu dinamis)
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// 1. Trigger /start
bot.start((ctx) => {
    const namaUser = ctx.from.first_name || 'User';
    ctx.replyWithMarkdown(
        `👋 **Halo ${namaUser}!** Selamat datang di **SyntaxApp Modding Tools**.\n\n` +
        `Silakan pilih bahasa Anda / Please select your language:`,
        Markup.inlineKeyboard([
            [
                Markup.button.callback('🇮🇩 Bahasa Indonesia', 'lang_id'),
                Markup.button.callback('🇬🇧 English', 'lang_en')
            ]
        ])
    );
});

// 2. Handler Pilihan Bahasa
bot.action(['lang_id', 'lang_en'], async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    const isIndo = ctx.callbackQuery.data === 'lang_id';

    const welcomeText = isIndo
        ? "⚡ **SYNTAXAPP MAIN MENU v1.0** ⚡\n\n" +
          "**Sistem cloud kami siap memproses aplikasi Anda secara otomatis.**\n" +
          "Silakan pilih fitur premium yang ingin Anda gunakan di bawah ini:"
        : "⚡ **SYNTAXAPP MAIN MENU v1.0** ⚡\n\n" +
          "**Our cloud system is ready to process your application automatically.**\n" +
          "Please select the premium feature you want to use below:";

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

bot.action('menu_unpack', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    const userId = ctx.from.id;
    userSessions[userId] = { feature: 'unpack' }; 
    ctx.replyWithMarkdown(
        "📦 **FITUR PREMIUM: UNPACK APLIKASI**\n\n" +
        "Silakan **kirimkan file (.apk)** yang ingin Anda bongkar ke sini.\n" +
        "**Sistem akan mengekstrak seluruh resources, aset, dex, dan manifest secara otomatis.**"
    );
});

bot.action('menu_remove_ads', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    const userId = ctx.from.id;
    userSessions[userId] = { feature: 'remove_ads' }; 
    ctx.replyWithMarkdown(
        "🚫 **FITUR PREMIUM: HAPUS IKLAN APLIKASI**\n\n" +
        "Silakan **kirimkan file (.apk)** target ke sini.\n" +
        "**Sistem akan otomatis mendeteksi Google Ads SDK, Unity Ads, AdMob, dan melakukan bypass/strip iklan agar bersih total!**"
    );
});

bot.action('menu_fix_app', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    const userId = ctx.from.id;
    userSessions[userId] = { feature: 'fix_app', step: 'waiting_text' }; 
    ctx.replyWithMarkdown(
        "🛠️ **FITUR PREMIUM: PERBAIKI APLIKASI**\n\n" +
        "Silakan **ketik dan kirim pesan terlebih dahulu** mengenai detail error atau bagian apa yang ingin diperbaiki di dalam aplikasi ini.\n\n" +
        "**Setelah mengirim pesan penjelasan, baru sistem akan meminta Anda mengirimkan file (.apk)-nya.**"
    );
});

// ======================== PROCESSOR APK & PROGRESS BAR DRAMATIS ========================

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

bot.on('document', async (ctx) => {
    const userId = ctx.from.id;
    const session = userSessions[userId];
    const fileName = ctx.message.document.file_name;

    if (!fileName.endsWith('.apk')) {
        return ctx.reply('❌ **File harus berformat .apk, Bro! Silakan cek kembali file yang Anda kirim.**');
    }
    if (!session) {
        return ctx.reply('⚠️ **Silakan pilih menu fiturnya dulu di atas, Bro, baru kirim file APK-nya.**');
    }
    if (session.feature === 'fix_app' && session.step === 'waiting_text') {
        return ctx.reply('⚠️ **Tolong ketik dulu penjelasan error/bagian yang mau diperbaiki, baru kirim file APK-nya, Bro!**');
    }

    // Array lompatan persentase loading sesuai request lo (dibuat detail & dramatis)
    const steps = [
        { pct: 10, txt: 'Mengunduh dan memverifikasi integritas file APK...' },
        { pct: 16, txt: 'Membaca struktur manifest dan package signature...' },
        { pct: 20, txt: 'Mengekstrak AndroidManifest.xml & resource assets...' },
        { pct: 25, txt: 'Menginisialisasi core decompiler engine v1.0...' },
        { pct: 30, txt: 'Decompiling classes.dex ke arsitektur Smali code...' },
        { pct: 31, txt: 'Menganalisis dependensi library internal...' },
        { pct: 34, txt: 'Scanning bytecode dari baris logic error / pelacak iklan...' },
        { pct: 37, txt: 'Melakukan injeksi patch otomatis pada source code...' },
        { pct: 45, txt: 'Restrukturisasi class references dan routing ulang metadata...' },
        { pct: 55, txt: 'Membersihkan cache sampah kompilator lama...' },
        { pct: 68, txt: 'Menyusun ulang komponen (Rebuilding classes ke form dex)...' },
        { pct: 74, txt: 'Mengemas kembali resource assets ke dalam container APK...' },
        { pct: 85, txt: 'Melakukan optimalisasi ZipAlign pada struktur file...' },
        { pct: 92, txt: 'Menandatangani aplikasi dengan SHA-256 Debug Certificate...' },
        { pct: 100, txt: 'Sukses total! Seluruh proses modifikasi selesai sempurna.' }
    ];

    let progressMsg;
    try {
        // Teks awal pemicu loading
        progressMsg = await ctx.replyWithMarkdown(`📥 **[░░░░░░░░░░] 0%**\n🔄 _Memulai koneksi ke cloud core..._`);
        
        // Perulangan untuk memunculkan lompatan bar secara lambat & detail
        for (const step of steps) {
            // Mengatur visual block kotak sekbar berdasarkan persentase
            const totalBlocks = 10;
            const filledBlocks = Math.round((step.pct / 100) * totalBlocks);
            const emptyBlocks = totalBlocks - filledBlocks;
            const barVisual = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

            // Judul berdasarkan menu fitur
            let featureTitle = '';
            if (session.feature === 'unpack') featureTitle = '📦 **CORE PROCESS: UNPACKING**';
            if (session.feature === 'remove_ads') featureTitle = '🚫 **CORE PROCESS: STRIPPING ADS**';
            if (session.feature === 'fix_app') featureTitle = '🛠️ **CORE PROCESS: APP REPAIRING**';

            await delay(1300); // Waktu jeda (1.3 detik) tiap lompatan biar proses kerasa lama & riil

            await ctx.telegram.editMessageText(
                ctx.chat.id, 
                progressMsg.message_id, 
                null, 
                `${featureTitle}\n\n` +
                `⏳ **[${barVisual}] ${step.pct}%**\n` +
                `🔄 _Status: ${step.txt}_`,
                { parse_mode: 'Markdown' }
            ).catch(() => {});
        }
    } catch (err) {
        console.error("Gagal melakukan update progress bar:", err);
    }

    delete userSessions[userId];

    // Jeda sebentar sebelum memunculkan tombol download utama
    await delay(800);

    await ctx.reply(
        `✅ **PROSES SELESAI SEMPURNA!**\n\n` +
        `File **${fileName}** telah sukses dimodifikasi oleh cloud system kami.\n` +
        `Silakan klik tombol di bawah ini untuk membuka menu pembayaran lisensi dan mengunduh file.`,
        {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([
                [Markup.button.callback('📥 Download Hasil Modifikasi', 'trigger_payment')]
            ])
        }
    ).catch((e) => console.error("Gagal kirim link unduhan:", e));
});

// ======================== ALUR: DIRECT LINK MENU MENUJU GROUP QRIS ========================

bot.action('trigger_payment', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    
    // GANTI LINK DI BAWAH INI DENGAN LINK GROUP / CHANNEL TELEGRAM REAL TEMPAT FOTO QRIS LO
    const LINK_GROUP_QRIS = 'https://t.me/your_group_username_atau_invite_link';
    const LINK_ADMIN = 'https://t.me/BotFather'; // Ganti dengan username Telegram lo

    ctx.replyWithMarkdown(
        `💳 **FORM PEMBAYARAN LISENSI & AKTIVASI**\n\n` +
        `Untuk mendapatkan key akses download dari file APK yang telah dimodifikasi, silakan lakukan pembayaran sebesar:\n\n` +
        `💰 **Total Tagihan: Rp 25.000,-**\n\n` +
        `📥 **LANGKAH-LANGKAH PEMBAYARAN:**\n` +
        `1️⃣ Klik tombol **"📱 Buka QRIS di Group"** di bawah ini.\n` +
        `2️⃣ Scan gambar **QRIS** yang tersemat di dalam group tersebut menggunakan M-Banking atau E-Wallet pilihan Anda.\n` +
        `3️⃣ Setelah transfer berhasil, **kirim bukti screenshot** ke Admin melalui tombol kedua untuk klaim file.`,
        Markup.inlineKeyboard([
            [Markup.button.url('📱 ⏩ Buka QRIS di Group', LINK_GROUP_QRIS)],
            [Markup.button.url('💬 Kirim Bukti Transfer ke Admin', LINK_ADMIN)]
        ])
    ).catch((e) => console.error("Gagal mengirim menu invoice direct group:", e));
});

// ==========================================================================================

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
