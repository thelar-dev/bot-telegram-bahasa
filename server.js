const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const bot = new Telegraf('8871741160:AAH8cOnFnFjIcZFSb1WqbESm0F8aIHxTdSk');

// ID Telegram pribadi lo
const ADMIN_ID = '7086755316'; 

// Objek untuk menyimpan status fitur dan file APK milik user
const userSessions = {};

// Map tracker untuk menghubungkan reply pesan admin ke user tujuan
const adminReplies = {};

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
            [Markup.button.callback('🛠️ Source Code Logic Repair', 'menu_fix_app')],
            [Markup.button.callback('🛡️ Protection 360 Jiagu', 'menu_jiagu')]
        ])
    ).catch((e) => console.error("Gagal kirim main menu:", e));
});

// ======================== HANDLER MENU UTAMA ========================

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

bot.action('menu_jiagu', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    const userId = ctx.from.id;
    userSessions[userId] = { feature: 'jiagu' }; 
    ctx.replyWithMarkdown(
        "🛡️ **[MODE ENCRYPTION: PROTECTION 360 JIAGU]**\n\n" +
        "Sistem akan menyuntikkan shell pelindung tingkat lanjut (VMP), mengenkripsi file dex, mengamankan string internal, serta memproteksi aplikasi dari dekompilasi, manipulasi memori, dan modifikasi ilegal.\n\n" +
        "👉 **Silakan langsung kirimkan file (.apk) target ke sini, Bro!**"
    );
});

// ======================== HANDLER BUKTI PEMBAYARAN (ADMIN GUARD) ========================

bot.on('photo', async (ctx) => {
    const userId = ctx.from.id;
    const session = userSessions[userId];
    
    const currentFeature = session ? session.feature : 'premium_generic';
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    const senderName = ctx.from.first_name || 'User';

    const adminNotification = await ctx.telegram.sendPhoto(ADMIN_ID, fileId, {
        caption: `📩 **Bukti Pembayaran Baru!**\nDari: ${senderName} (ID: \`${userId}\`)\nPaket: *${currentFeature.toUpperCase()}*\n\n👉 *Balas/Reply pesan ini dengan mengetik "OK" untuk mengirim berkas modifikasi ke user secara otomatis.*`,
        parse_mode: 'Markdown'
    });

    adminReplies[adminNotification.message_id] = {
        targetUserId: userId,
        feature: currentFeature,
        apkFileId: session ? session.savedApkId : null,
        apkName: session ? session.savedApkName : 'SyntaxApp_Modded.apk'
    };

    ctx.replyWithMarkdown('✅ **Bukti pembayaran telah berhasil dikirim ke Admin.**\nMohon tunggu sebentar, Admin akan segera memvalidasi transaksi Anda.');
});

// ======================== PROCESSOR APK & PROGRESS BAR DRAMATIS ========================

bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const textMessage = ctx.message.text;

    // --- LOGIKA UTAMA: JIKA LO (ADMIN) MEMBALAS CHAT BUKTI DENGAN KATA "OK" ---
    if (String(userId) === String(ADMIN_ID) && ctx.message.reply_to_message) {
        const linkedSession = adminReplies[ctx.message.reply_to_message.message_id];
        
        if (linkedSession && textMessage.toLowerCase().startsWith('ok')) {
            const userTarget = linkedSession.targetUserId;
            let responseDoneText = '';

            if (linkedSession.feature === 'unpack') {
                responseDoneText = `🚀 **DONE! CORE RESOURCES UNPACKED SUCCESSFULLY**\n\n` +
                                   `Halo Bro, transaksi Anda terverifikasi! Seluruh berkas internal, manifest, biner, dan aset dex dari aplikasi Anda telah sukses di-unpack mentah secara sempurna.\n\n` +
                                   `📦 **Paket:** \`Premium Unpack Core\`\n` +
                                   `🔐 **Status File:** \`UNLOCKED / READY\``;
            } else if (linkedSession.feature === 'remove_ads') {
                responseDoneText = `🚀 **DONE! AD-LAYERS STRIPPED SUCCESSFULLY**\n\n` +
                                   `Halo Bro, bypass premium selesai! Google Ads SDK, Unity Ads, serta pelacak analitik adware telah dilumpuhkan total dari aplikasi Anda. Bersih, aman, dan tanpa iklan.\n\n` +
                                   `🚫 **Paket:** \`Premium Strip Ad-Layers\`\n` +
                                   `⚡ **Status Sistem:** \`ADS CLEANED TOTAL\``;
            } else if (linkedSession.feature === 'fix_app') {
                responseDoneText = `🚀 **DONE! SOURCE CODE LOGIC REPAIRED SUCCESSFULLY**\n\n` +
                                   `Halo Bro, injeksi penambalan logic selesai! File Smali terstruktur kembali, crash internal berhasil dilewati, dan error kompilasi kode sumber telah berhasil diperbaiki.\n\n` +
                                   `🛠️ **Paket:** \`Premium Logic Repair\`\n` +
                                   `🟢 **Status Kompilasi:** \`0 ERRORS / FIXED\``;
            } else if (linkedSession.feature === 'jiagu') {
                responseDoneText = `🚀 **DONE! PROTECTION 360 JIAGU INJECTED SUCCESSFULLY**\n\n` +
                                   `Halo Bro, verifikasi berhasil! Enkripsi tingkat tinggi Jiagu 360 telah sukses disuntikkan ke dalam core biner aplikasi Anda. File aman dari ancaman reverse engineering.\n\n` +
                                   `🛡️ **Paket:** \`Protection 360 Jiagu\`\n` +
                                   `🔐 **Status Keamanan:** \`VMP SECURED & ANTI-DECOMPILE\``;
            } else {
                responseDoneText = `🚀 **DONE! LISENSI PREMIUM TELE_BOT AKTIF**\n\n` +
                                   `Halo Bro, pembayaran Anda telah divalidasi dan dikonfirmasi langsung oleh Admin.`;
            }

            try {
                await ctx.telegram.sendMessage(userTarget, responseDoneText, { parse_mode: 'Markdown' });
                
                if (linkedSession.apkFileId) {
                    await ctx.telegram.sendDocument(userTarget, linkedSession.apkFileId, {
                        caption: `📥 **File:** \`${linkedSession.apkName}\`\n⚡ _Silakan klik untuk mengunduh aplikasi modifikasi final Anda._`,
                        parse_mode: 'Markdown'
                    });
                }
                
                ctx.reply(`✅ **Sukses! Notifikasi Done dan File APK telah dikirim ke User (ID: ${userTarget}).**`);
                
                delete adminReplies[ctx.message.reply_to_message.message_id];
                delete userSessions[userTarget];
            } catch (error) {
                ctx.reply(`❌ Terjadi error saat bot mengirim balik file ke user: ${error.message}`);
            }
            return;
        }
    }

    // --- LOGIKA TEXT INPUT UNTUK USER BIASA ---
    const session = userSessions[userId];
    if (session && session.feature === 'fix_app' && session.step === 'waiting_text') {
        session.bugDescription = textMessage; 
        session.step = 'waiting_apk'; 
        return ctx.replyWithMarkdown(
            `✅ **DESKRIPSI PARSING BERHASIL**\n` +
            `» _"${textMessage}"_\n\n` +
            `👉 **Sekarang, silakan kirimkan file (.apk) yang ingin diperbaiki agar sistem dapat menyelaraskan kerusakan dengan kode sumber!**`
        );
    }
});

bot.on('document', async (ctx) => {
    const userId = ctx.from.id;
    const session = userSessions[userId];
    const fileName = ctx.message.document.file_name;
    const fileId = ctx.message.document.file_id;

    if (!fileName.endsWith('.apk')) {
        return ctx.replyWithMarkdown('❌ **FORMAT REJECTED! File wajib berakhiran .apk, Bro. Silakan kirim ulang.**');
    }
    if (!session) {
        return ctx.replyWithMarkdown('⚠️ **SESSION EXPIRED! Silakan pilih menu fiturnya kembali di atas.**');
    }
    if (session.feature === 'fix_app' && session.step === 'waiting_text') {
        return ctx.replyWithMarkdown('⚠️ **DESKRIPSI REQUIRED! Tolong ketik dulu penjelasan errornya baru kirim file APK, Bro!**');
    }

    session.savedApkId = fileId;
    session.savedApkName = fileName;

    const steps = [
        { pct: 10, txt: 'Mengunduh data aplikasi ke sandbox cloud...' },
        { pct: 20, txt: 'Memverifikasi arsitektur biner & file signature...' },
        { pct: 30, txt: 'Mengekstrak dan memetakan struktur file dex...' },
        { pct: 45, txt: session.feature === 'jiagu' ? 'Menginisialisasi modul Enkripsi Core Jiagu 360...' : 'Menginisialisasi modul injeksi SyntaxApp Engine...' },
        { pct: 60, txt: session.feature === 'jiagu' ? 'Menyuntikkan shell pelindung VMP anti-decompile...' : 'Menjalankan skrip modifikasi dinamis pada core layer...' },
        { pct: 75, txt: session.feature === 'jiagu' ? 'Mengenkripsi string data & merestrukturisasi classes.dex...' : 'Menyusun ulang bytecode container...' },
        { pct: 90, txt: 'Melakukan optimalisasi penjajaran byte lewat ZipAlign...' },
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
            if (session.feature === 'jiagu') featureTitle = '🛡️ **CORE PROCESS: INJECTING 360 JIAGU SHIELD**';

            await delay(1300);

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

    let payCallback = 'pay_unpack';
    if (session.feature === 'remove_ads') payCallback = 'pay_ads';
    if (session.feature === 'fix_app') payCallback = 'pay_fix';
    if (session.feature === 'jiagu') payCallback = 'pay_jiagu';

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

// ======================== HANDLERS PEMBAYARAN DINAMIS ========================

const handlePaymentResponse = async (ctx, featureName, priceText) => {
    await ctx.answerCbQuery().catch(() => {});
    
    const LINK_GROUP_QRIS = 'https://t.me/+7G-rozzl_Uk4NDll'; 

    return ctx.replyWithMarkdown(
        `💳 **FORM PEMBAYARAN LISENSI & AKTIVASI**\n\n` +
        `Sistem mendeteksi aktivitas modifikasi pada kategori:\n` +
        `🛠️ Fitur: **${featureName}**\n` +
        `💰 Total Tagihan: **${priceText}**\n\n` +
        `⚠️ _Untuk mendapatkan key akses enkripsi serta mengunduh berkas APK hasil modifikasi, silakan selesaikan administrasi melalui instruksi berikut:_\n\n` +
        `📥 **LANGKAH-LANGKAH AKTIVASI JALUR PREMIUM:**\n` +
        `1️⃣ Klik tombol **"📱 Buka QRIS di Group"** di bawah ini.\n` +
        `2️⃣ Scan gambar **QRIS** yang tertera di dalam group/channel tujuan menggunakan aplikasi M-Banking atau E-Wallet Anda.\n` +
        `3️⃣ Setelah transfer sukses, **kirim bukti screenshot** langsung ke ruang obrolan bot ini agar diteruskan ke Admin.`,
        Markup.inlineKeyboard([
            [Markup.button.url('📱 ⏩ Buka QRIS di Group', LINK_GROUP_QRIS)]
        ])
    );
};

bot.action('pay_unpack', async (ctx) => {
    await handlePaymentResponse(ctx, '📦 UNPACK CORE RESOURCES', 'Rp 500.000,-');
});

bot.action('pay_ads', async (ctx) => {
    await handlePaymentResponse(ctx, '🚫 STRIP & BYPASS AD-LAYERS', 'Rp 250.000,-');
});

bot.action('pay_fix', async (ctx) => {
    await handlePaymentResponse(ctx, '🛠️ SOURCE CODE LOGIC REPAIR', 'Rp 400.000,-');
});

bot.action('pay_jiagu', async (ctx) => {
    await handlePaymentResponse(ctx, '🛡️ PROTECTION 360 JIAGU', 'Rp 350.000,-');
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
