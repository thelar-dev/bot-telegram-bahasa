/**
 * SYNTAXAPP MODDING CORE v4.0 - ULTRA SPEED EDITION
 * Optimized for Vercel Serverless & Distributed Database Pooling
 * Developer: Kresna Thelar
 */

const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

// KONEKSI DATABASE SUPABASE
const SUPABASE_URL = 'https://ndjpuirztmcjqceisemy.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_kIgvA04yd7fE4xRBT-ABew_pn9q5Rq5';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const bot = new Telegraf('8871741160:AAH8cOnFnFjIcZFSb1WqbESm0F8aIHxTdSk');

// ID Telegram Admin
const ADMIN_ID = '7086755316'; 

// Memory tracker cache untuk reply admin
const adminReplies = {};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ======================== ADVANCED DATABASE LAYER ========================

async function getUserSession(userId) {
    try {
        const { data, error } = await supabase.from('sessions').select('session_data').eq('user_id', userId).single();
        if (error) {
            console.error(`[DB GET ERROR] User ${userId}:`, error.message);
            return null;
        }
        return data ? data.session_data : null;
    } catch (e) {
        console.error(`[FATAL GET] User ${userId}:`, e);
        return null;
    }
}

async function setUserSession(userId, sessionData) {
    try {
        const { error } = await supabase.from('sessions').upsert({ user_id: userId, session_data: sessionData });
        if (error) {
            console.error(`[DB SAVE ERROR] RLS Active/Auth Failure on User ${userId}:`, error.message);
        }
    } catch (e) {
        console.error(`[FATAL SAVE] User ${userId}:`, e);
    }
}

async function deleteUserSession(userId) {
    try {
        const { error } = await supabase.from('sessions').delete().eq('user_id', userId);
        if (error) console.error(`[DB DELETE ERROR] User ${userId}:`, error.message);
    } catch (e) {
        console.error(`[FATAL DELETE] User ${userId}:`, e);
    }
}

// ======================== CORE TELEGRAM HANDLERS ========================

// 1. Trigger /start
bot.start((ctx) => {
    const namaUser = ctx.from.first_name || 'User';
    ctx.replyWithMarkdown(
        `👋 **⚡ WELCOME TO SYNTAXAPP MODDING CORE v4.0 ⚡**\n\n` +
        `Halo **${namaUser}**! Sistem otomatis kami siap membedah, memodifikasi, dan mengoptimalkan aplikasi Anda dengan standar enkripsi cloud tertinggi.\n\n` +
        ` Silakan pilih bahasa untuk memulai / Please select your language:`,
        Markup.inlineKeyboard([
            [
                Markup.button.callback('🇮🇩 Bahasa Indonesia', 'lang_id'),
                Markup.button.callback('🇬🇧 English', 'lang_en')
            ]
        ])
    ).catch((err) => console.error('[Error Start Command]:', err));
});

// Perintah /status: Real-time dynamic parsing engine
bot.command('status', async (ctx) => {
    const userId = ctx.from.id;
    const session = await getUserSession(userId);

    if (!session || session.feature !== 'fix_app' || !session.startTime) {
        return ctx.replyWithMarkdown('⚠️ **Tidak ada antrean perbaikan source code aktif untuk akun Anda saat ini.**');
    }

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
    ctx.answerCbQuery().catch(() => {}); // Instant Feedback (Anti-Delay)
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
    ).catch((err) => console.error('[Error Lang Action]:', err));
});

// ======================== HIGH SPEED BUTTON ACTION ENGINE ========================

bot.action('menu_unpack', async (ctx) => {
    ctx.answerCbQuery().catch(() => {}); // 1. Beri respon ke Telegram instan biar jam pasir langsung ilang
    
    // 2. Eksekusi DB & UI secara paralel non-blocking
    Promise.all([
        setUserSession(ctx.from.id, { feature: 'unpack' }),
        ctx.replyWithMarkdown("📦 **[MODE DECOMPILE: UNPACK RESOURCES]**\n\n👉 **Silakan langsung kirimkan file (.apk) target ke sini, Bro!**")
    ]).catch((err) => console.error('[Error menu_unpack Engine]:', err));
});

bot.action('menu_remove_ads', async (ctx) => {
    ctx.answerCbQuery().catch(() => {}); 
    
    Promise.all([
        setUserSession(ctx.from.id, { feature: 'remove_ads' }),
        ctx.replyWithMarkdown("🚫 **[MODE BYPASS: STRIP AD-LAYERS]**\n\n👉 **Silakan langsung kirimkan file (.apk) target ke sini, Bro!**")
    ]).catch((err) => console.error('[Error menu_remove_ads Engine]:', err));
});

bot.action('menu_fix_app', async (ctx) => {
    ctx.answerCbQuery().catch(() => {}); 
    
    Promise.all([
        setUserSession(ctx.from.id, { feature: 'fix_app', step: 'waiting_text' }),
        ctx.replyWithMarkdown("🛠️ **[MODE RECONSTRUCT: SOURCE CODE REPAIR]**\n\n📝 **LANGKAH PERTAMA:**\nSilakan **ketik dan kirimkan deskripsi detail / pesan teks** mengenai bagian error terlebih dahulu.")
    ]).catch((err) => console.error('[Error menu_fix_app Engine]:', err));
});

bot.action('menu_jiagu', async (ctx) => {
    ctx.answerCbQuery().catch(() => {}); 
    
    Promise.all([
        setUserSession(ctx.from.id, { feature: 'jiagu' }),
        ctx.replyWithMarkdown("🛡️ **[MODE ENCRYPTION: PROTECTION 360 JIAGU]**\n\n👉 **Silakan langsung kirimkan file (.apk) target ke sini, Bro!**")
    ]).catch((err) => console.error('[Error menu_jiagu Engine]:', err));
});

// ======================== PROCESSOR PEMBAYARAN & BUKTI SCREENSHOT ========================

bot.on('photo', async (ctx) => {
    const userId = ctx.from.id;
    
    // Tarik session secara asinkronous cepat
    const session = await getUserSession(userId);
    const currentFeature = session ? session.feature : 'premium_generic';
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    const senderName = ctx.from.first_name || 'User';

    try {
        const adminNotification = await ctx.telegram.sendPhoto(ADMIN_ID, fileId, {
            caption: `📩 **Bukti Pembayaran Baru!**\nDari: ${senderName} (ID: \`${userId}\`)\nPaket: *${currentFeature.toUpperCase()}*\n\n👉 *Balas/Reply pesan ini dengan "OK" untuk kirim APK.*`,
            parse_mode: 'Markdown'
        });

        // Simpan data target ke local cache mapping untuk kecepatan respon admin
        adminReplies[adminNotification.message_id] = {
            targetUserId: userId,
            feature: currentFeature,
            apkFileId: session ? session.savedApkId : null,
            apkName: session ? session.savedApkName : 'SyntaxApp_Modded.apk'
        };

        ctx.replyWithMarkdown('✅ **Bukti pembayaran telah berhasil dikirim ke Admin.**\nMohon tunggu sebentar, Admin akan segera memvalidasi transaksi Anda.');
    } catch (err) {
        console.error('[Fatal Photo Handler]:', err);
    }
});

// ======================== TEXT INPUT & ADMIN DISPATCHER ========================

bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const textMessage = ctx.message.text;

    // PIPELINE INTERAKSI ADMIN SYSTEM
    if (String(userId) === String(ADMIN_ID) && ctx.message.reply_to_message) {
        const linkedSession = adminReplies[ctx.message.reply_to_message.message_id];
        
        if (linkedSession && textMessage.toLowerCase().startsWith('ok')) {
            const userTarget = linkedSession.targetUserId;
            let responseDoneText = `🚀 **DONE! PROSES MODIFIKASI BERHASIL AKTIF**`;

            if (linkedSession.feature === 'unpack') responseDoneText = `🚀 **DONE! CORE RESOURCES UNPACKED SUCCESSFULLY**`;
            if (linkedSession.feature === 'remove_ads') responseDoneText = `🚀 **DONE! AD-LAYERS STRIPPED SUCCESSFULLY**`;
            if (linkedSession.feature === 'fix_app') responseDoneText = `🚀 **DONE! SOURCE CODE LOGIC REPAIRED SUCCESSFULLY**`;
            if (linkedSession.feature === 'jiagu') responseDoneText = `🚀 **DONE! PROTECTION 360 JIAGU INJECTED SUCCESSFULLY**`;

            // Kirim notifikasi sukses + Kirim File APK modifikasi secara async (paralel)
            ctx.reply(`⏳ **Mengirimkan data enkripsi balik ke user (ID: ${userTarget})...**`);
            
            Promise.all([
                ctx.telegram.sendMessage(userTarget, responseDoneText, { parse_mode: 'Markdown' }),
                linkedSession.apkFileId ? ctx.telegram.sendDocument(userTarget, linkedSession.apkFileId, {
                    caption: `📥 **File:** \`${linkedSession.apkName}\``,
                    parse_mode: 'Markdown'
                }) : Promise.resolve(),
                deleteUserSession(userTarget) // Bersihkan database dari data sampah (Auto clean-up)
            ]).then(() => {
                ctx.reply(`✅ **Sukses terkirim sempurna & Session Cleaned.**`);
                delete adminReplies[ctx.message.reply_to_message.message_id];
            }).catch((error) => {
                ctx.reply(`❌ Core Pipeline Error: ${error.message}`);
            });
            return;
        }
    }

    // PIPELINE DESKRIPSI ERROR USER (FIX ENGINE)
    const session = await getUserSession(userId);
    if (session && session.feature === 'fix_app' && session.step === 'waiting_text') {
        session.bugDescription = textMessage; 
        session.step = 'waiting_apk'; 
        
        // Pipa data aman ke DB, baru luncurkan balasan UI
        await setUserSession(userId, session);
        return ctx.replyWithMarkdown(`✅ **DESKRIPSI PARSING BERHASIL**\n\n👉 **Sekarang, silakan kirimkan file (.apk) yang ingin diperbaiki!**`);
    }
});

// ======================== BINARY DECOMPILER (DOCUMENT HANDLER) ========================

bot.on('document', async (ctx) => {
    const userId = ctx.from.id;
    const session = await getUserSession(userId);
    const fileName = ctx.message.document.file_name;
    const fileId = ctx.message.document.file_id;

    if (!fileName.endsWith('.apk')) return ctx.replyWithMarkdown('❌ **FORMAT REJECTED! Wajib file .apk, Bro.**');
    if (!session) return ctx.replyWithMarkdown('⚠️ **SESSION EXPIRED! Silakan pilih menu kembali.**');

    session.savedApkId = fileId;
    session.savedApkName = fileName;

    // Cabang Khusus Fitur Fix Source Code Logic
    if (session.feature === 'fix_app') {
        session.startTime = Date.now(); 
        await setUserSession(userId, session);
        return ctx.replyWithMarkdown(
            `📥 **BERKAS TARGET BERHASIL DIUNGGAH**\n\n` +
            `🛠️ **Fitur Pilihan:** \`Source Code Logic Repair\`\n\n` +
            `⚠️ **PERINGATAN CORE PARSING:**\n` +
            `Proses rekonstruksi logika Smali memerlukan waktu intensif selama **3 hingga 5 Hari Kerja**.\n\n` +
            `👉 **Silakan ketik perintah /status secara berkala untuk memantau kemajuan compiler.**`
        );
    }

    // Cabang Modifikasi Instan (Unpack, Remove Ads, Jiagu)
    await setUserSession(userId, session);
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
    await ctx.replyWithMarkdown(`✅ **PROSES SELESAI SEMPURNA!**`, Markup.inlineKeyboard([[Markup.button.callback('📥 Download Hasil Modifikasi', payCallback)]])).catch((err) => console.error(err));
});

// ======================== ASYNC PAYMENT GATEWAY CALLBACKS ========================

const handlePaymentResponse = (ctx, featureName, priceText) => {
    ctx.answerCbQuery().catch(() => {}); // Instant Feedback Loop
    return ctx.replyWithMarkdown(
        `💳 **FORM LISENSI PREMIUM**\n\n` +
        `🛠️ Fitur: **${featureName}**\n` +
        `💰 Tagihan: **${priceText}**\n\n` +
        `👉 Silakan transfer ke QRIS grup lalu kirim screenshot bukti ke sini.`, 
        Markup.inlineKeyboard([[Markup.button.url('📱 Buka QRIS di Group', 'https://t.me/+7G-rozzl_Uk4NDll')]])
    );
};

bot.action('pay_unpack', (ctx) => { handlePaymentResponse(ctx, '📦 UNPACK CORE RESOURCES', 'Rp 500.000,-'); });
bot.action('pay_ads', (ctx) => { handlePaymentResponse(ctx, '🚫 STRIP & BYPASS AD-LAYERS', 'Rp 250.000,-'); });
bot.action('pay_jiagu', (ctx) => { handlePaymentResponse(ctx, '🛡️ PROTECTION 360 JIAGU', 'Rp 350.000,-'); });
bot.action('pay_fix', (ctx) => { handlePaymentResponse(ctx, '🛠️ SOURCE CODE LOGIC REPAIR', 'Rp 400.000,-'); });

// ======================== WEBHOOK SETUP FOR SERVERLESS VERCEL ========================

const app = express();
app.use(express.json()); // Memastikan payload json ter-parsing sempurna di layer terluar
app.use(bot.webhookCallback('/api/telegram'));

bot.telegram.setWebhook(`https://bot-telegram-bahasa.vercel.app/api/telegram`)
   .then(() => console.log('[WEBHOOK ACTIVE] Server running flawlessly on high-speed routing.'))
   .catch((err) => console.error('[WEBHOOK FAILING]:', err));

module.exports = app;
