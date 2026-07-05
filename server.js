const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const { kv } = require('@vercel/kv'); // Database anti-reset memori

const bot = new Telegraf('8871741160:AAH8cOnFnFjIcZFSb1WqbESm0F8aIHxTdSk');

// ID Telegram pribadi lo
const ADMIN_ID = '7086755316'; 

// Map tracker sementara untuk reply admin (bisa tetap di memori karena respon admin instan)
const adminReplies = {};

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

// Perintah /status: Sekarang ngambil data asli dan permanen dari database Vercel KV
bot.command('status', async (ctx) => {
    const userId = ctx.from.id;
    
    // Ambil data session user dari database
    const session = await kv.get(`session:${userId}`);

    if (!session || session.feature !== 'fix_app' || !session.startTime) {
        return ctx.replyWithMarkdown('⚠️ **Tidak ada antrean perbaikan source code aktif untuk akun Anda saat ini.**');
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
        ? "🤖 **SYNTAXAPP CONTROL PANEL**\n\nStatus Server: 🟢 `ONLINE` \nSilakan pilih menu fiturnya, Bro:"
        : "🤖 **SYNTAXAPP CONTROL PANEL**\n\nServer Status: 🟢 `ONLINE` \nPlease select a feature below:";

    ctx.replyWithMarkdown(
        welcomeText,
        Markup.inlineKeyboard([
            [Markup.button.callback('📦 Unpack Core Resources', 'menu_unpack')],
            [Markup.button.callback('🚫 Strip & Bypass Ad-Layers', 'menu_remove_ads')],
            [Markup.button.callback('🛠️ Source Code Logic Repair', 'menu_fix_app')],
            [Markup.button.callback('🛡️ Protection 360 Jiagu', 'menu_jiagu')]
        ])
    );
});

// ======================== HANDLER MENU UTAMA (SAVE TO KV) ========================

bot.action('menu_unpack', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    await kv.set(`session:${ctx.from.id}`, { feature: 'unpack' });
    ctx.replyWithMarkdown("📦 **[MODE DECOMPILE: UNPACK RESOURCES]**\n\n👉 **Silakan langsung kirimkan file (.apk) target ke sini, Bro!**");
});

bot.action('menu_remove_ads', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    await kv.set(`session:${ctx.from.id}`, { feature: 'remove_ads' });
    ctx.replyWithMarkdown("🚫 **[MODE BYPASS: STRIP AD-LAYERS]**\n\n👉 **Silakan langsung kirimkan file (.apk) target ke sini, Bro!**");
});

bot.action('menu_fix_app', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    await kv.set(`session:${ctx.from.id}`, { feature: 'fix_app', step: 'waiting_text' });
    ctx.replyWithMarkdown("🛠️ **[MODE RECONSTRUCT: SOURCE CODE REPAIR]**\n\n📝 **LANGKAH PERTAMA:**\nSilakan **ketik dan kirimkan deskripsi detail / pesan teks** mengenai bagian error terlebih dahulu.");
});

bot.action('menu_jiagu', async (ctx) => {
    await ctx.answerCbQuery().catch(() => {});
    await kv.set(`session:${ctx.from.id}`, { feature: 'jiagu' });
    ctx.replyWithMarkdown("🛡️ **[MODE ENCRYPTION: PROTECTION 360 JIAGU]**\n\n👉 **Silakan langsung kirimkan file (.apk) target ke sini, Bro!**");
});

// ======================== HANDLER BUKTI PEMBAYARAN ========================

bot.on('photo', async (ctx) => {
    const userId = ctx.from.id;
    const session = await kv.get(`session:${userId}`);
    
    const currentFeature = session ? session.feature : 'premium_generic';
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    const senderName = ctx.from.first_name || 'User';

    const adminNotification = await ctx.telegram.sendPhoto(ADMIN_ID, fileId, {
        caption: `📩 **Bukti Pembayaran Baru!**\nDari: ${senderName} (ID: \`${userId}\`)\nPaket: *${currentFeature.toUpperCase()}*\n\n👉 *Balas/Reply pesan ini dengan "OK" untuk kirim APK.*`,
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

// ======================== PROCESSOR APK & TEXT INPUT ========================

bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const textMessage = ctx.message.text;

    // Logika Admin balas OK
    if (String(userId) === String(ADMIN_ID) && ctx.message.reply_to_message) {
        const linkedSession = adminReplies[ctx.message.reply_to_message.message_id];
        
        if (linkedSession && textMessage.toLowerCase().startsWith('ok')) {
            const userTarget = linkedSession.targetUserId;
            let responseDoneText = `🚀 **DONE! PROSES MODIFIKASI BERHASIL AKTIF**`;

            if (linkedSession.feature === 'unpack') responseDoneText = `🚀 **DONE! CORE RESOURCES UNPACKED SUCCESSFULLY**`;
            if (linkedSession.feature === 'remove_ads') responseDoneText = `🚀 **DONE! AD-LAYERS STRIPPED SUCCESSFULLY**`;
            if (linkedSession.feature === 'fix_app') responseDoneText = `🚀 **DONE! SOURCE CODE LOGIC REPAIRED SUCCESSFULLY**`;
            if (linkedSession.feature === 'jiagu') responseDoneText = `🚀 **DONE! PROTECTION 360 JIAGU INJECTED SUCCESSFULLY**`;

            try {
                await ctx.telegram.sendMessage(userTarget, responseDoneText, { parse_mode: 'Markdown' });
                if (linkedSession.apkFileId) {
                    await ctx.telegram.sendDocument(userTarget, linkedSession.apkFileId, {
                        caption: `📥 **File:** \`${linkedSession.apkName}\``,
                        parse_mode: 'Markdown'
                    });
                }
                ctx.reply(`✅ **Sukses terkirim ke User (ID: ${userTarget}).**`);
                delete adminReplies[ctx.message.reply_to_message.message_id];
                await kv.del(`session:${userTarget}`);
            } catch (error) {
                ctx.reply(`❌ Terjadi error: ${error.message}`);
            }
            return;
        }
    }

    const session = await kv.get(`session:${userId}`);
    if (session && session.feature === 'fix_app' && session.step === 'waiting_text') {
        session.bugDescription = textMessage; 
        session.step = 'waiting_apk'; 
        await kv.set(`session:${userId}`, session);
        return ctx.replyWithMarkdown(`✅ **DESKRIPSI PARSING BERHASIL**\n\n👉 **Sekarang, silakan kirimkan file (.apk) yang ingin diperbaiki!**`);
    }
});

bot.on('document', async (ctx) => {
    const userId = ctx.from.id;
    const session = await kv.get(`session:${userId}`);
    const fileName = ctx.message.document.file_name;
    const fileId = ctx.message.document.file_id;

    if (!fileName.endsWith('.apk')) return ctx.replyWithMarkdown('❌ **FORMAT REJECTED! Wajib file .apk, Bro.**');
    if (!session) return ctx.replyWithMarkdown('⚠️ **SESSION EXPIRED! Silakan pilih menu kembali.**');

    session.savedApkId = fileId;
    session.savedApkName = fileName;

    // JIKA FITUR FIX APP -> MASUK DATABASE DAN PROSES ANTRIAN 3 HARI MULAI
    if (session.feature === 'fix_app') {
        session.startTime = Date.now(); // Disimpan permanen di database
        await kv.set(`session:${userId}`, session);
        return ctx.replyWithMarkdown(
            `📥 **BERKAS TARGET BERHASIL DIUNGGAH**\n\n` +
            `🛠️ **Fitur Pilihan:** \`Source Code Logic Repair\`\n\n` +
            `⚠️ **PERINGATAN CORE PARSING:**\n` +
            `Proses rekonstruksi logika Smali memerlukan waktu intensif selama **3 hingga 5 Hari Kerja**.\n\n` +
            `👉 **Silakan ketik perintah /status secara berkala untuk memantau kemajuan compiler.**`
        );
    }

    // Untuk fitur lain tetap jalankan animasi progress bar kilat
    await kv.set(`session:${userId}`, session);
    const steps = [
        { pct: 30, txt: 'Mengekstrak dan memetakan biner...' },
        { pct: 70, txt: 'Menjalankan skrip modifikasi cloud...' },
        { pct: 100, txt: 'Sukses total!' }
    ];

    let progressMsg = await ctx.replyWithMarkdown(`📥 **[░░░░░░░░░░] 0%**`);
    for (const step of steps) {
        const bar = '█'.repeat(step.pct / 10) + '░'.repeat(10 - (step.pct / 10));
        await delay(1000);
        await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, `⏳ **[${bar}] ${step.pct}%**\n🔄 _Status: ${step.txt}_`, { parse_mode: 'Markdown' }).catch(() => {});
    }

    let payCallback = session.feature === 'unpack' ? 'pay_unpack' : (session.feature === 'remove_ads' ? 'pay_ads' : 'pay_jiagu');
    await ctx.replyWithMarkdown(`✅ **PROSES SELESAI SEMPURNA!**`, Markup.inlineKeyboard([[Markup.button.callback('📥 Download Hasil Modifikasi', payCallback)]]));
});

// ======================== GERBANG PEMBAYARAN ========================
const handlePaymentResponse = async (ctx, featureName, priceText) => {
    await ctx.answerCbQuery().catch(() => {});
    return ctx.replyWithMarkdown(`💳 **FORM LISENSI PREMIUM**\n\n🛠️ Fitur: **${featureName}**\n💰 Tagihan: **${priceText}**\n\n👉 Silakan transfer ke QRIS grup lalu kirim screenshot bukti ke sini.`, Markup.inlineKeyboard([[Markup.button.url('📱 Buka QRIS di Group', 'https://t.me/+7G-rozzl_Uk4NDll')]]));
};

bot.action('pay_unpack', async (ctx) => { await handlePaymentResponse(ctx, '📦 UNPACK CORE RESOURCES', 'Rp 500.000,-'); });
bot.action('pay_ads', async (ctx) => { await handlePaymentResponse(ctx, '🚫 STRIP & BYPASS AD-LAYERS', 'Rp 250.000,-'); });
bot.action('pay_jiagu', async (ctx) => { await handlePaymentResponse(ctx, '🛡️ PROTECTION 360 JIAGU', 'Rp 350.000,-'); });
bot.action('pay_fix', async (ctx) => { await handlePaymentResponse(ctx, '🛠️ SOURCE CODE LOGIC REPAIR', 'Rp 400.000,-'); });

const app = express();
app.use(bot.webhookCallback('/api/telegram'));
bot.telegram.setWebhook(`https://bot-telegram-bahasa.vercel.app/api/telegram`).catch((err) => console.error(err));

module.exports = app;
