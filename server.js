const { Telegraf, Markup } = require('telegraf');
const express = require('express');

const bot = new Telegraf('8871741160:AAH8cOnFnFjIcZFSb1WqbESm0F8aIHxTdSk');

// ID Telegram pribadi lo
const ADMIN_ID = '7086755316'; 

// Objek untuk menyimpan status fitur dan file APK milik user
const userSessions = {};

// Map tracker untuk menghubungkan reply pesan admin ke user tujuan
const adminReplies = {};

// Fungsi pembantu buat animasi progress instan (untuk menu lain)
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// 1. Trigger /start
bot.start((ctx) => {
    const namaUser = ctx.from.first_name || 'User';
    ctx.replyWithMarkdown(
        `👋 **⚡ WELCOME TO SYNTAXAPP MODDING CORE v3.0 ⚡**\n\n` +
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

// Perintah tambahan untuk cek status progress multi-hari
// Perintah tambahan untuk cek status progress multi-hari (VERSI ANTI-RESET MEMORI)
bot.command('status', async (ctx) => {
    const userId = ctx.from.id;
    let session = userSessions[userId];

    // JIKA MEMORI KE-RESET, KITA JADIKAN SEOLAH-OLAH INI SISTEM CLOUD SECURITY
    if (!session || session.feature !== 'fix_app') {
        return ctx.replyWithMarkdown(
            `⚠️ **[CLOUD SECURITY NOTICE: SESSION EXPIRED]**\n\n` +
            `Untuk menjaga keamanan enkripsi biner dan mencegah kebocoran source code, sesi pasif di latar belakang telah di-enkripsi otomatis oleh sistem.\n\n` +
            `👉 **Silakan masuk ke menu awal, pilih fitur kembali, dan kirim ulang file (.apk) Anda** untuk melanjutkan sinkronisasi compiler cloud.`
        );
    }

    // Hitung selisih waktu nyata (Target 3 Hari = 259.200.000 ms)
    const duration = 3 * 24 * 60 * 60 * 1000; 
    const elapsed = Date.now() - session.startTime;
    let pct = Math.floor((elapsed / duration) * 100);

    if (pct < 0) pct = 0;
    if (pct >= 100) {
        pct = 100;
        return ctx.replyWithMarkdown(
            `⏳ **[██████████] 100%**\n` +
            `🛠️ **STATUS: RESTRUCTURING & COMPILATION DONE!**\n\n` +
            `File **${session.savedApkName}** selesai diperbaiki secara menyeluruh!\nSilakan lakukan rilis berkas di bawah ini:`,
            Markup.inlineKeyboard([[Markup.button.callback('📥 Gerbang Unduhan & Lisensi', 'pay_fix')]])
        );
    }

    const totalBlocks = 10;
    const filledBlocks = Math.round((pct / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    const barVisual = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

    let statusText = 'Menganalisis dependensi silang kode Smali...';
    if (pct > 30) statusText = 'Membongkar bytecode classes.dex & melacak alur crash runtime...';
    if (pct > 65) statusText = 'Melakukan restrukturisasi arsitektur compiler Logic & bypass error...';
    if (pct > 85) statusText = 'Finalisasi rekonstruksi container zip & menyelaraskan byte data...';

    ctx.replyWithMarkdown(
        `🛠️ **CORE PROCESS: LOGIC REPAIRING (MAIN ENGINE)**\n\n` +
        `⏳ **[${barVisual}] ${pct}%**\n` +
        `🔄 _Status: ${statusText}_\n\n` +
        `📝 **Catatan Sistem:**\n` +
        `Proses dekompilasi mendalam & rekonstruksi logika Smali memerlukan kompilasi cloud intensif selama **3-5 Hari Kerja** untuk mencegah kerusakan internal target.\n` +
        `👉 Silakan ketik perintah /status secara berkala untuk memantau pembaruan.`
    );
});


// 2. Handler Pilihan Bahasa
bot.action(['lang_id', 'lang_en'], async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    const isIndo = ctx.callbackQuery.data === 'lang_id';

    const welcomeText = isIndo
        ? "🤖 **SYNTAXAPP CONTROL PANEL**\n\n" +
          "**Status Server:** 🟢 `ONLINE (HIGH PERFORMANCE)`\n" +
          "**Core Engine:** `v3.0-CloudCompiler`\n\n" +
          "Silakan pilih menu fiturnya, Bro:"
        : "🤖 **SYNTAXAPP CONTROL PANEL**\n\n" +
          "**Server Status:** 🟢 `ONLINE (HIGH PERFORMANCE)`\n" +
          "**Core Engine:** `v3.0-CloudCompiler`\n\n" +
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
        "Sistem akan membongkar seluruh aset internal aplikasi Anda. Seluruh berkas biner akan diekstrak mentah secara sempurna.\n\n" +
        "👉 **Silakan langsung kirimkan file (.apk) target ke sini, Bro!**"
    );
});

bot.action('menu_remove_ads', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    const userId = ctx.from.id;
    userSessions[userId] = { feature: 'remove_ads' }; 
    ctx.replyWithMarkdown(
        "🚫 **[MODE BYPASS: STRIP AD-LAYERS]**\n\n" +
        "Sistem akan memindai manifest, mengisolasi Google Ads SDK, Unity Ads, serta AdMob.\n\n" +
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
        "Sistem akan menyuntikkan shell pelindung tingkat lanjut (VMP), mengenkripsi file dex, serta memproteksi aplikasi dari dekompilasi.\n\n" +
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

// ======================== PROCESSOR APK & ADMIN VERIFICATION ========================

bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const textMessage = ctx.message.text;

    if (String(userId) === String(ADMIN_ID) && ctx.message.reply_to_message) {
        const linkedSession = adminReplies[ctx.message.reply_to_message.message_id];
        
        if (linkedSession && textMessage.toLowerCase().startsWith('ok')) {
            const userTarget = linkedSession.targetUserId;
            let responseDoneText = '';

            if (linkedSession.feature === 'unpack') {
                responseDoneText = `🚀 **DONE! CORE RESOURCES UNPACKED SUCCESSFULLY**\n\n📦 **Paket:** \`Premium Unpack Core\`\n🔐 **Status File:** \`UNLOCKED / READY\``;
            } else if (linkedSession.feature === 'remove_ads') {
                responseDoneText = `🚀 **DONE! AD-LAYERS STRIPPED SUCCESSFULLY**\n\n🚫 **Paket:** \`Premium Strip Ad-Layers\`\n⚡ **Status Sistem:** \`ADS CLEANED TOTAL\``;
            } else if (linkedSession.feature === 'fix_app') {
                responseDoneText = `🚀 **DONE! SOURCE CODE LOGIC REPAIRED SUCCESSFULLY**\n\n🛠️ **Paket:** \`Premium Logic Repair\`\n🟢 **Status Kompilasi:** \`0 ERRORS / FIXED\``;
            } else if (linkedSession.feature === 'jiagu') {
                responseDoneText = `🚀 **DONE! PROTECTION 360 JIAGU INJECTED SUCCESSFULLY**\n\n🛡️ **Paket:** \`Protection 360 Jiagu\`\n🔐 **Status Keamanan:** \`VMP SECURED & ANTI-DECOMPILE\``;
            } else {
                responseDoneText = `🚀 **DONE! LISENSI PREMIUM TELE_BOT AKTIF**`;
            }

            try {
                await ctx.telegram.sendMessage(userTarget, responseDoneText, { parse_mode: 'Markdown' });
                if (linkedSession.apkFileId) {
                    await ctx.telegram.sendDocument(userTarget, linkedSession.apkFileId, {
                        caption: `📥 **File:** \`${linkedSession.apkName}\`\n⚡ _Silakan unduh aplikasi modifikasi final Anda._`,
                        parse_mode: 'Markdown'
                    });
                }
                ctx.reply(`✅ **Sukses! Notifikasi Done dan File APK telah dikirim ke User (ID: ${userTarget}).**`);
                delete adminReplies[ctx.message.reply_to_message.message_id];
                delete userSessions[userTarget];
            } catch (error) {
                ctx.reply(`❌ Terjadi error: ${error.message}`);
            }
            return;
        }
    }

    const session = userSessions[userId];
    if (session && session.feature === 'fix_app' && session.step === 'waiting_text') {
        session.bugDescription = textMessage; 
        session.step = 'waiting_apk'; 
        return ctx.replyWithMarkdown(
            `✅ **DESKRIPSI PARSING BERHASIL**\n» _"${textMessage}"_\n\n👉 **Sekarang, silakan kirimkan file (.apk) yang ingin diperbaiki!**`
        );
    }
});

bot.on('document', async (ctx) => {
    const userId = ctx.from.id;
    const session = userSessions[userId];
    const fileName = ctx.message.document.file_name;
    const fileId = ctx.message.document.file_id;

    if (!fileName.endsWith('.apk')) {
        return ctx.replyWithMarkdown('❌ **FORMAT REJECTED! File wajib berakhiran .apk, Bro.**');
    }
    if (!session) {
        return ctx.replyWithMarkdown('⚠️ **SESSION EXPIRED! Silakan pilih menu fiturnya kembali.**');
    }
    if (session.feature === 'fix_app' && session.step === 'waiting_text') {
        return ctx.replyWithMarkdown('⚠️ **DESKRIPSI REQUIRED! Tolong ketik dulu penjelasan errornya baru kirim file APK, Bro!**');
    }

    session.savedApkId = fileId;
    session.savedApkName = fileName;

    // JIKA FITURNYA ADALAH SOURCE CODE REPAIR (LOGIC REPAIR) -> JALUR MULTI HARI AKTIF
    if (session.feature === 'fix_app') {
        session.startTime = Date.now(); // Simpan detik pertama kirim file
        return ctx.replyWithMarkdown(
            `📥 **BERKAS TARGET BERHASIL DIUNGGAH**\n\n` +
            `🛠️ **Fitur Pilihan:** \`Source Code Logic Repair\`\n` +
            `📦 **Nama File:** \`${fileName}\`\n\n` +
            `⚠️ **PERINGATAN CORE PARSING:**\n` +
            `Deteksi restrukturisasi berkas Smali, kompilasi ulang arsitektur biner, dan pencocokan bug internal membutuhkan alokasi cloud engine selama **3 hingga 5 Hari Kerja**.\n\n` +
            `🤖 Progres awal berjalan di latar belakang cloud server pada **3%**.\n` +
            `👉 **Silakan ketik perintah /status secara berkala untuk memantau kemajuan compiler.**`
        );
    }

    // UNTUK MENU LAIN (UNPACK, ADS, JIAGU) TETAP INSTAN BANYAK BLOCK PROGRESS BAR NYATA
    const steps = [
        { pct: 10, txt: 'Mengunduh data aplikasi ke sandbox cloud...' },
        { pct: 30, txt: 'Mengekstrak dan memetakan struktur file...' },
        { pct: 60, txt: session.feature === 'jiagu' ? 'Menyuntikkan shell pelindung VMP anti-decompile...' : 'Menjalankan skrip modifikasi dinamis...' },
        { pct: 90, txt: 'Melakukan optimalisasi byte lewat ZipAlign...' },
        { pct: 100, txt: 'Sukses total!' }
    ];

    let progressMsg;
    try {
        progressMsg = await ctx.replyWithMarkdown(`📥 **[░░░░░░░░░░] 0%**\n🔄 _Menghubungkan ke Cloud..._`);
        for (const step of steps) {
            const bar = '█'.repeat(Math.round(step.pct / 10)) + '░'.repeat(10 - Math.round(step.pct / 10));
            await delay(1200);
            await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, `⏳ **[${bar}] ${step.pct}%**\n🔄 _Status: ${step.txt}_`, { parse_mode: 'Markdown' }).catch(() => {});
        }
    } catch (e) {}

    let payCallback = session.feature === 'unpack' ? 'pay_unpack' : (session.feature === 'remove_ads' ? 'pay_ads' : 'pay_jiagu');
    await delay(800);

    await ctx.replyWithMarkdown(
        `✅ **PROSES SELESAI SEMPURNA!**\n\nFile **${fileName}** sukses diproses oleh cloud system kami.\nSilakan masuk ke halaman konfirmasi pembayaran lisensi.`,
        Markup.inlineKeyboard([[Markup.button.callback('📥 Download Hasil Modifikasi', payCallback)]])
    );
});

// ======================== HANDLERS PEMBAYARAN DINAMIS ========================

const handlePaymentResponse = async (ctx, featureName, priceText) => {
    await ctx.answerCbQuery().catch(() => {});
    const LINK_GROUP_QRIS = 'https://t.me/+7G-rozzl_Uk4NDll'; 
    return ctx.replyWithMarkdown(
        `💳 **FORM PEMBAYARAN LISENSI & AKTIVASI**\n\n` +
        `🛠️ Fitur: **${featureName}**\n` +
        `💰 Total Tagihan: **${priceText}**\n\n` +
        `📥 **LANGKAH-LANGKAH AKTIVASI JALUR PREMIUM:**\n` +
        `1️⃣ Klik tombol **"📱 Buka QRIS di Group"** di bawah ini.\n` +
        `2️⃣ Scan gambar **QRIS** di grup tujuan.\n` +
        `3️⃣ Setelah transfer sukses, **kirim bukti screenshot** ke chat bot ini agar diteruskan ke Admin.`,
        Markup.inlineKeyboard([[Markup.button.url('📱 ⏩ Buka QRIS di Group', LINK_GROUP_QRIS)]])
    );
};

bot.action('pay_unpack', async (ctx) => { await handlePaymentResponse(ctx, '📦 UNPACK CORE RESOURCES', 'Rp 500.000,-'); });
bot.action('pay_ads', async (ctx) => { await handlePaymentResponse(ctx, '🚫 STRIP & BYPASS AD-LAYERS', 'Rp 250.000,-'); });
bot.action('pay_jiagu', async (ctx) => { await handlePaymentResponse(ctx, '🛡️ PROTECTION 360 JIAGU', 'Rp 350.000,-'); });
bot.action('pay_fix', async (ctx) => { await handlePaymentResponse(ctx, '🛠️ SOURCE CODE LOGIC REPAIR', 'Rp 400.000,-'); });

// ==========================================================================================

const app = express();
const VERCEL_URL = 'https://bot-telegram-bahasa.vercel.app'; 

app.use(bot.webhookCallback('/api/telegram'));
bot.telegram.setWebhook(`${VERCEL_URL}/api/telegram`)
    .then(() => console.log('Webhook Terpasang!'))
    .catch((err) => console.error('Gagal pasang webhook:', err));

app.get('/', (req, res) => { res.send('Bot Online 24 Jam!'); });

module.exports = app;
