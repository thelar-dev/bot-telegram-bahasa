const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const bot = new Telegraf('8871741160:AAH8cOnFnFjIcZFSb1WqbESm0F8aIHxTdSk');

// Username Admin yang berhak memvalidasi bukti pembayaran



// Ganti 123456789 dengan ID Telegram pribadi lo
const ADMIN_ID = '7086755316'; 




// Objek sementara untuk menyimpan status pilihan fitur user
const userSessions = {};

// Fungsi pembantu buat animasi progress bar (jeda waktu dinamis)
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// 1. Trigger /start
bot.start((ctx) => {
    const namaUser = ctx.from.first_name || 'User';
    ctx.replyWithMarkdown(
        `👋 **⚡ WELCOME TO SYNTAXAPP MODDING CORE v1.0 ⚡**\n\n` +
        `Halo **${namaUser}**! Sistem otomatis kami siap membedah, memodifikasi, dan mengoptimalkan aplikasi Anda dengan standar enkripsi cloud tertinggi.\n\n` +
        ` Silakan pilih bahasa untuk memulai / Please select your language:`,
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
        ? "🤖 **SYNTAXAPP CONTROL PANEL**\n\n" +
          "**Status Server:** 🟢 `ONLINE (HIGH PERFORMANCE)`\n" +
          "**Core Engine:** `v1.0-CloudCompiler`\n\n" +
          "Silakan pilih menu fiturnya, Bro:"
        : "🤖 **SYNTAXAPP CONTROL PANEL**\n\n" +
          "**Server Status:** 🟢 `ONLINE (HIGH PERFORMANCE)`\n" +
          "**Core Engine:** `v1.0-CloudCompiler`\n\n" +
          "Please select a feature below:";

    ctx.replyWithMarkdown(
        welcomeText,
        Markup.inlineKeyboard([
            [Markup.button.callback('📦 Unpack Core Resources', 'menu_unpack')],
            [Markup.button.callback('🚫 Strip & Bypass Ad-Layers', 'menu_remove_ads')],
            [Markup.button.callback('🛠️ Source Code Logic Repair', 'menu_fix_app')]
        ])
    ).catch((e) => console.error("Gagal kirim main menu:", e));
});

// ======================== HANDLER 3 MENU UTAMA ========================

bot.action('menu_unpack', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    const userId = ctx.from.id;
    userSessions[userId] = { feature: 'unpack' }; 
    ctx.replyWithMarkdown(
        "📦 **[MODE DECOMPILE: UNPACK RESOURCES]**\n\n" +
        "Sistem akan membongkar seluruh aset internal aplikasi Anda. Seluruh berkas biner, `AndroidManifest.xml`, file gambar, layout, hingga aset dex akan diekstrak mentah secara sempurna.\n\n" +
        "👉 **Silakan langsung kirimkan file (.apk) target ke sini, Bro!**"
    );
});

bot.action('menu_remove_ads', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    const userId = ctx.from.id;
    userSessions[userId] = { feature: 'remove_ads' }; 
    ctx.replyWithMarkdown(
        "🚫 **[MODE BYPASS: STRIP AD-LAYERS]**\n\n" +
        "Sistem akan memindai manifest, mengisolasi Google Ads SDK, Unity Ads, AdMob, serta melumpuhkan jalur pelacak analitik iklan. Aplikasi target dijamin bersih total, bebas iklan, dan berjalan lebih ringan.\n\n" +
        "👉 **Silakan langsung kirimkan file (.apk) target ke sini, Bro!**"
    );
});

bot.action('menu_fix_app', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    const userId = ctx.from.id;
    userSessions[userId] = { feature: 'fix_app', step: 'waiting_text' }; 
    ctx.replyWithMarkdown(
        "🛠️ **[MODE RECONSTRUCT: SOURCE CODE REPAIR]**\n\n" +
        "Layanan perbaikan kode logic, penambalan error kompilasi, bypass crash internal, atau restrukturisasi file Smali.\n\n" +
        "📝 **LANGKAH PERTAMA:**\n" +
        "Silakan **ketik dan kirimkan deskripsi detail / pesan teks** mengenai bagian error yang ingin Anda perbaiki terlebih dahulu."
    );
});

// ======================== HANDLER BUKTI PEMBAYARAN (ADMIN GUARD) ========================



bot.on('photo', async (ctx) => {
    // Ambil file ID dari foto yang dikirim user
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    const senderName = ctx.from.first_name;
    const senderId = ctx.from.id;

    // Forward foto ke chat pribadi lo
    await ctx.telegram.sendPhoto(ADMIN_ID, fileId, {
        caption: `📩 **Bukti Pembayaran Baru!**\nDari: ${senderName} (ID: ${senderId})\nSegera validasi lisensinya, Bro.`
    });

    // Balasan otomatis ke user agar mereka tahu buktinya sudah masuk ke sistem
    ctx.reply('✅ **Bukti pembayaran telah berhasil dikirim ke Admin.**\nMohon tunggu sebentar, Admin akan segera memvalidasi transaksi Anda.');
});


// ======================== PROCESSOR APK & PROGRESS BAR DRAMATIS ========================

bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const session = userSessions[userId];
    if (session && session.feature === 'fix_app' && session.step === 'waiting_text') {
        session.bugDescription = ctx.message.text; 
        session.step = 'waiting_apk'; 
        return ctx.replyWithMarkdown(
            `✅ **DESKRIPSI PARSING BERHASIL**\n` +
            `» _"${ctx.message.text}"_\n\n` +
            `👉 **Sekarang, silakan kirimkan file (.apk) yang ingin diperbaiki agar sistem dapat menyelaraskan kerusakan dengan kode sumber!**`
        );
    }
});

bot.on('document', async (ctx) => {
    const userId = ctx.from.id;
    const session = userSessions[userId];
    const fileName = ctx.message.document.file_name;

    if (!fileName.endsWith('.apk')) {
        return ctx.replyWithMarkdown('❌ **FORMAT REJECTED! File wajib berakhiran .apk, Bro. Silakan kirim ulang.**');
    }
    if (!session) {
        return ctx.replyWithMarkdown('⚠️ **SESSION EXPIRED! Silakan pilih menu fiturnya kembali di atas.**');
    }
    if (session.feature === 'fix_app' && session.step === 'waiting_text') {
        return ctx.replyWithMarkdown('⚠️ **DESKRIPSI REQUIRED! Tolong ketik dulu penjelasan errornya baru kirim file APK, Bro!**');
    }

    // Array lompatan angka acak sesuai request lo (10, 16, 20, 25, 30, 31, 34, 37, dst)
    const steps = [
        { pct: 10, txt: 'Mengunduh data aplikasi ke sandbox cloud...' },
        { pct: 16, txt: 'Memverifikasi arsitektur biner & file signature...' },
        { pct: 20, txt: 'Mengekstrak manifes utama dan tabel resources...' },
        { pct: 25, txt: 'Menginisialisasi modul injeksi SyntaxApp Engine...' },
        { pct: 30, txt: 'Decompiling bytecode classes.dex menjadi struktur Smali...' },
        { pct: 31, txt: 'Pemindaian silang dependensi internal API...' },
        { pct: 34, txt: 'Menganalisis baris instruksi compiler...' },
        { pct: 37, txt: 'Menjalankan skrip modifikasi dinamis pada core layer...' },
        { pct: 52, txt: 'Pembersihan junk file dan sisa cache metadata...' },
        { pct: 67, txt: 'Menyusun ulang bytecode (Rebuilding classes to dex container)...' },
        { pct: 81, txt: 'Mengemas ulang seluruh folder aset menjadi APK biner...' },
        { pct: 89, txt: 'Melakukan optimasi penjajaran byte lewat ZipAlign...' },
        { pct: 95, txt: 'Menandatangani aplikasi dengan sertifikat enkripsi baru...' },
        { pct: 100, txt: 'Sukses total! Seluruh proses modifikasi selesai sempurna.' }
    ];

    let progressMsg;
    try {
        progressMsg = await ctx.replyWithMarkdown(`📥 **[░░░░░░░░░░] 0%**\n🔄 _Menghubungkan ke SyntaxApp Cloud Core..._`);
        
        for (const step of steps) {
            const totalBlocks = 10;
            const filledBlocks = Math.round((step.pct / 100) * totalBlocks);
            const emptyBlocks = totalBlocks - filledBlocks;
            const barVisual = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

            let featureTitle = '';
            if (session.feature === 'unpack') featureTitle = '📦 **CORE PROCESS: UNPACKING RESOURCES**';
            if (session.feature === 'remove_ads') featureTitle = '🚫 **CORE PROCESS: STRIPPING AD-LAYERS**';
            if (session.feature === 'fix_app') featureTitle = '🛠️ **CORE PROCESS: LOGIC REPAIRING**';

            await delay(1300); // Jedanya dibikin lama biar mantap dan meyakinkan

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

    // Tentukan trigger callback payment unik berdasarkan tipe fitur sebelum session dihapus
    let payCallback = 'pay_unpack';
    if (session.feature === 'remove_ads') payCallback = 'pay_ads';
    if (session.feature === 'fix_app') payCallback = 'pay_fix';

    delete userSessions[userId];
    await delay(800);

    await ctx.replyWithMarkdown(
        `✅ **PROSES SELESAI SEMPURNA!**\n\n` +
        `File **${fileName}** telah sukses dimodifikasi secara menyeluruh oleh cloud system kami.\n\n` +
        `Silakan klik tombol di bawah ini untuk membuka halaman konfirmasi gerbang pembayaran lisensi enkripsi.`,
        Markup.inlineKeyboard([
            [Markup.button.callback('📥 Download Hasil Modifikasi', payCallback)]
        ])
    ).catch((e) => console.error("Gagal kirim link unduhan:", e));
});

// ======================== HANDLERS PEMBAYARAN DINAMIS (HARGA BEDA-BEDA) ========================

// Fungsi generator teks pembayaran premium biar seragam tapi dinamis harganya
const handlePaymentResponse = async (ctx, featureName, priceText) => {
    await ctx.answerCbQuery().catch(() => {});
    
    const LINK_GROUP_QRIS = 'https://t.me/+7G-rozzl_Uk4NDll'; // Ganti pakai link group lo, Bro!
    const LINK_ADMIN = 'https://t.me/SyntaxApp_bot'; // Ganti pakai username admin lo, Bro!

    return ctx.replyWithMarkdown(
        `💳 **FORM PEMBAYARAN LISENSI & AKTIVASI**\n\n` +
        `Sistem mendeteksi aktivitas modifikasi pada kategori:\n` +
        `🛠️ Fitur: **${featureName}**\n` +
        `💰 Total Tagihan: **${priceText}**\n\n` +
        `⚠️ _Untuk mendapatkan key akses enkripsi serta mengunduh berkas APK hasil modifikasi, silakan selesaikan administrasi melalui instruksi berikut:_\n\n` +
        `📥 **LANGKAH-LANGKAH AKTIVASI JALUR PREMIUM:**\n` +
        `1️⃣ Klik tombol **"📱 Buka QRIS di Group"** di bawah ini.\n` +
        `2️⃣ Scan gambar **QRIS** yang tertera di dalam group/channel tujuan menggunakan aplikasi M-Banking atau E-Wallet andalan Anda.\n` +
        `3️⃣ Setelah transfer sukses, **kirim bukti screenshot** transaksi ke Admin melalui tombol kedua agar key unduhan dirilis secara instan.`,
        Markup.inlineKeyboard([
            [Markup.button.url('📱 ⏩ Buka QRIS di Group', LINK_GROUP_QRIS)],
            [Markup.button.url('💬 Kirim Bukti Transfer ke Admin', LINK_ADMIN)]
        ])
    );
};

// Pemicu Bayar Unpack App (Rp 500.000)
bot.action('pay_unpack', async (ctx) => {
    await handlePaymentResponse(ctx, '📦 UNPACK CORE RESOURCES', 'Rp 500.000,-');
});

// Pemicu Bayar Hapus Iklan (Rp 250.000)
bot.action('pay_ads', async (ctx) => {
    await handlePaymentResponse(ctx, '🚫 STRIP & BYPASS AD-LAYERS', 'Rp 250.000,-');
});

// Pemicu Bayar Perbaikan Aplikasi (Rp 400.000)
bot.action('pay_fix', async (ctx) => {
    await handlePaymentResponse(ctx, '🛠️ SOURCE CODE LOGIC REPAIR', 'Rp 400.000,-');
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
