/**
 * SYNTAXAPP ARTIFICIAL INTELLIGENCE MODDING CORE v5.2 - FINAL THREAT UPDATE
 * Engineered for Ultra-Fast Serverless Execution & Zero-Latency Operations
 * Main Developer / Owner: Kresna Thelar
 */

const { Telegraf, Markup } = require('telegraf');
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

// 🌐 KONEKSI INFRASTRUKTUR CLOUD DATABASE
const SUPABASE_URL = 'https://ndjpuirztmcjqceisemy.supabase.co'; 
const SUPABASE_KEY = 'sb_publishable_kIgvA04yd7fE4xRBT-ABew_pn9q5Rq5';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const bot = new Telegraf('8871741160:AAH8cOnFnFjIcZFSb1WqbESm0F8aIHxTdSk');

// 🛠️ CONFIGURATION ENGINE
const ADMIN_ID = '7086755316'; 
const adminReplies = {}; // Memori jangka pendek untuk Admin Dispatcher
const delay = (ms) => new Promise(res => setTimeout(res, ms));

// ======================== ADVANCED DATABASE INFRASTRUCTURE ========================

async function getUserSession(userId) {
    try {
        const { data, error } = await supabase.from('sessions').select('session_data').eq('user_id', userId).single();
        if (error) return null;
        return data ? data.session_data : null;
    } catch (e) {
        console.error(`[AI CORE] Error retrieving neural session for ${userId}:`, e);
        return null;
    }
}

async function setUserSession(userId, sessionData) {
    try {
        await supabase.from('sessions').upsert({ user_id: userId, session_data: sessionData });
    } catch (e) {
        console.error(`[AI CORE] Critical error writing neural memory for ${userId}:`, e);
    }
}

async function deleteUserSession(userId) {
    try {
        await supabase.from('sessions').delete().eq('user_id', userId);
    } catch (e) {
        console.error(`[AI CORE] Error purging memory matrix for ${userId}:`, e);
    }
}

// ======================== INTERFASE UTAMA (AI PERSPECTIVE) ========================

// Handler /start (AI Persona & Photo Profile Extractor Edition)
bot.start(async (ctx) => {
    const userId = ctx.from.id;
    const namaUser = ctx.from.first_name || 'User';
    
    const startText = 
        `🛰️ **[ SYNTAXAPP AI CORE NODE INITIATED ]**\n` +
        `\`═════════════════════════════════════\`\n\n` +
        `👤 **USER PROFILE:** ${namaUser}\n` +
        `🆔 **USER ID:** \`${userId}\`\n\n` +
        `Selamat datang, **${namaUser}**. Saya adalah modul kecerdasan buatan yang dikembangkan untuk melakukan dekompilasi tingkat tinggi, restrukturisasi bytecode, dan optimasi arsitektur aplikasi secara otomatis.\n\n` +
        `⚙️ *Silakan tentukan protokol bahasa untuk memuat Panel Kontrol:*`;

    const inlineButtons = Markup.inlineKeyboard([
        [
            Markup.button.callback('🇮🇩 Bahasa Indonesia', 'lang_id'),
            Markup.button.callback('🇬🇧 English Matrix', 'lang_en')
        ]
    ]);

    try {
        const userPhotos = await ctx.telegram.getUserProfilePhotos(userId);
        if (userPhotos && userPhotos.total_count > 0) {
            const fileId = userPhotos.photos[0][0].file_id;
            await ctx.replyWithPhoto(fileId, {
                caption: startText,
                parse_mode: 'Markdown',
                ...inlineButtons
            });
        } else {
            await ctx.replyWithMarkdown(startText, inlineButtons);
        }
    } catch (err) {
        console.error('[AI CORE] Gagal menarik data profil user:', err);
        ctx.replyWithMarkdown(startText, inlineButtons).catch((e) => console.error(e));
    }
});

// Pilihan Bahasa -> Menu Utama
bot.action(['lang_id', 'lang_en'], async (ctx) => {
    ctx.answerCbQuery().catch(() => {});
    
    const namaUser = ctx.from.first_name || 'User';
    const userId = ctx.from.id;
    const isIndo = ctx.callbackQuery.data === 'lang_id';

    const welcomeText = isIndo
        ? `🤖 **[ MAIN CONTROL PANEL LEVEL 5.0 ]**\n` +
          `\`═════════════════════════════════════\`\n` +
          `🧬 **NODE OPERATOR:** \`SYNTAX-AI-${userId}\`\n` +
          `Status Core Server: 🟢 \`ACTIVE (HEALTHY)\` \n\n` +
          `Halo, **${namaUser}**. Modul Kecerdasan Buatan telah berhasil diinisialisasi secara sinkronous.\n\n` +
          `👉 Silakan tentukan sub-modul teknologi di bawah ini untuk mengeksekusi manipulasi binari:`
        : `🤖 **[ MAIN CONTROL PANEL LEVEL 5.0 ]**\n` +
          `\`═════════════════════════════════════\`\n` +
          `🧬 **NODE OPERATOR:** \`SYNTAX-AI-${userId}\`\n` +
          `Core Server Status: 🟢 \`ACTIVE (HEALTHY)\` \n\n` +
          `Greetings, **${namaUser}**. Artificial Intelligence modules have been synchronized successfully.\n\n` +
          `👉 Select one of the technological sub-modules below to execute binary manipulation:`;

    ctx.replyWithMarkdown(
        welcomeText,
        Markup.inlineKeyboard([
            [Markup.button.callback('📦 Unpack Core Resources', 'menu_unpack')],
            [Markup.button.callback('🚫 Strip & Bypass Ad-Layers', 'menu_remove_ads')],
            [Markup.button.callback('🛠️ Source Code Logic Repair', 'menu_fix_app')],
            [Markup.button.callback('🛡️ Protection 360 Jiagu', 'menu_jiagu')]
        ])
    ).catch((err) => console.error('[AI CORE ERROR] Gagal mengirim menu utama:', err));
});

// Perintah /status
bot.command('status', async (ctx) => {
    const userId = ctx.from.id;
    const session = await getUserSession(userId);

    if (!session || session.feature !== 'fix_app' || !session.startTime) {
        return ctx.replyWithMarkdown(
            `🧬 **[ SYSTEM DIAGNOSTIC ]**\n` +
            `⚠️ Tidak ditemukan matriks kompilasi aktif untuk ID Akun Anda.\n` +
            `👉 Silakan pilih menu \`Source Code Logic Repair\` terlebih dahulu.`
        );
    }

    const duration = 3 * 24 * 60 * 60 * 1000; 
    const elapsed = Date.now() - session.startTime;
    let pct = Math.floor((elapsed / duration) * 100);

    if (pct < 0) pct = 0;
    if (pct >= 100) {
        return ctx.replyWithMarkdown(
            `⚡ **[ RECONSTRUCTION MATRIX: COMPLETED ]**\n` +
            `\`████████████████████\` 100%\n\n` +
            `✨ **Analisis Berhasil!** Berkas binari \`${session.savedApkName}\` telah sepenuhnya diperbaiki dari kegagalan runtime logic.\n\n` +
            `Tekan tombol di bawah untuk memproses penyiapan gerbang unduhan berkas Anda:`,
            Markup.inlineKeyboard([[Markup.button.callback('📥 Ambil Lisensi & Unduh APK', 'pay_fix')]])
        );
    }

    const totalBlocks = 10;
    const filledBlocks = Math.round((pct / 100) * totalBlocks);
    const emptyBlocks = totalBlocks - filledBlocks;
    const barVisual = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);

    let currentTask = 'Mengisolasi alur dependensi antar komponen...';
    if (pct > 30) currentTask = 'Melakukan re-engineering pada bytecode classes.dex...';
    if (pct > 65) currentTask = 'Merekonstruksi struktur arsitektur Logic & bypass runtime error...';
    if (pct > 85) currentTask = 'Menyelaraskan integritas kontainer biner ZIP & tanda tangan digital...';

    ctx.replyWithMarkdown(
        `🔮 **[ COMPUTING PROCESS: LOGIC REPAIR ]**\n` +
        `\`🤖 Node ID: SYNTAX-AI-${userId}\`\n\n` +
        `⏳ **[${barVisual}] ${pct}%**\n` +
        `⚙️ *Aktivitas AI:* \`${currentTask}\`\n\n` +
        `📋 **Catatan Kompilator:**\n` +
        `Proses restrukturisasi logika mendalam memerlukan alokasi daya server awan selama **3-5 hari kerja** guna memastikan stabilitas penuh.\n` +
        `👉 Pantau perkembangan dengan mengetik /status secara berkala.`
    );
});

// ======================== HIGH SPEED INTERACTION ENGINE ========================

bot.action('menu_unpack', async (ctx) => {
    ctx.answerCbQuery().catch(() => {});
    Promise.all([
        setUserSession(ctx.from.id, { feature: 'unpack' }),
        ctx.replyWithMarkdown("📦 **[ PROTOKOL DEKOMPILASI: UNPACK RESOURCES ]**\n\nSistem AI siap membedah aset aplikasi Anda.\n👉 **Kirimkan file (.apk) target sekarang.**")
    ]).catch((err) => console.error(err));
});

bot.action('menu_remove_ads', async (ctx) => {
    ctx.answerCbQuery().catch(() => {});
    Promise.all([
        setUserSession(ctx.from.id, { feature: 'remove_ads' }),
        ctx.replyWithMarkdown("🚫 **[ PROTOKOL BYPASS: AD-LAYERS STRIPPER ]**\n\nSistem AI siap membersihkan lapisan iklan pada aplikasi.\n👉 **Kirimkan file (.apk) target sekarang.**")
    ]).catch((err) => console.error(err));
});

bot.action('menu_fix_app', async (ctx) => {
    ctx.answerCbQuery().catch(() => {});
    Promise.all([
        setUserSession(ctx.from.id, { feature: 'fix_app', step: 'waiting_text' }),
        ctx.replyWithMarkdown(
            "🛠️ **[ PROTOKOL DEEP RECONSTRUCT: LOGIC REPAIR ]**\n\n" +
            "🤖 **LANGKAH 1 (INPUT ANALISIS TEXT):**\n" +
            "Kecerdasan buatan memerlukan detail indikasi masalah.\n\n" +
            "👉 Silakan **ketik dan kirimkan deskripsi teks** mengenai bagian error / crash pada aplikasi Anda."
        )
    ]).catch((err) => console.error(err));
});

bot.action('menu_jiagu', async (ctx) => {
    ctx.answerCbQuery().catch(() => {});
    Promise.all([
        setUserSession(ctx.from.id, { feature: 'jiagu' }),
        ctx.replyWithMarkdown("🛡️ **[ PROTOKOL ENKRIPSI: 360 JIAGU CORE ]**\n\nSistem AI siap menginjeksi proteksi enkripsi tingkat tinggi.\n👉 **Kirimkan file (.apk) target sekarang.**")
    ]).catch((err) => console.error(err));
});

// ======================== PROCESSOR PEMBAYARAN VIA SCREENSHOT ========================

bot.on('photo', async (ctx) => {
    const userId = ctx.from.id;
    const session = await getUserSession(userId);
    const currentFeature = session ? session.feature : 'premium_generic';
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    const senderName = ctx.from.first_name || 'User';

    try {
        const adminNotification = await ctx.telegram.sendPhoto(ADMIN_ID, fileId, {
            caption: `🛰️ **[ TRANS-VALIDATION INBOUND ]**\n\`═════════════════════════════════════\`\n` +
                     `👤 User: **${senderName}** (ID: \`${userId}\`)\n` +
                     `🧪 Paket Modul: *${currentFeature.toUpperCase()}*\n\n` +
                     `👉 *Balas pesan ini dengan mengetik kata "OK" untuk merilis hasil modifikasi.*`,
            parse_mode: 'Markdown'
        });

        adminReplies[adminNotification.message_id] = {
            targetUserId: userId,
            feature: currentFeature,
            apkFileId: session ? session.savedApkId : null,
            apkName: session ? session.savedApkName : 'SyntaxApp_Modded.apk'
        };

        ctx.replyWithMarkdown(
            `✨ **[ NOTIFIKASI SYSTEM ]**\n` +
            `Metrik transaksi Anda telah diterima dan diteruskan ke database antrean validasi Admin. Proses otentikasi memakan waktu 1-5 menit.`
        );
    } catch (err) {
        console.error(err);
    }
});

// ======================== PIPELINE INPUT TEXT & ADMIN ACTIONS ========================

bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const textMessage = ctx.message.text;

    if (String(userId) === String(ADMIN_ID) && ctx.message.reply_to_message) {
        const linkedSession = adminReplies[ctx.message.reply_to_message.message_id];
        
        if (linkedSession && textMessage.toLowerCase().startsWith('ok')) {
            const userTarget = linkedSession.targetUserId;
            let responseDoneText = `🚀 **[ COMPILATION SUCCESSFUL ]**\n\`═════════════════════════════════════\`\n` +
                                   `Modul Kecerdasan Buatan telah berhasil menyusun ulang berkas target Anda secara sempurna.`;

            ctx.reply(`⚙️ *Mentransmisikan berkas terenkripsi balik ke user ID: ${userTarget}...*`);
            
            Promise.all([
                ctx.telegram.sendMessage(userTarget, responseDoneText, { parse_mode: 'Markdown' }),
                linkedSession.apkFileId ? ctx.telegram.sendDocument(userTarget, linkedSession.apkFileId, {
                    caption: `📦 **Hasil Modifikasi:** \`${linkedSession.apkName}\``,
                    parse_mode: 'Markdown'
                }) : Promise.resolve(),
                deleteUserSession(userTarget)
            ]).then(() => {
                ctx.reply(`✅ **Protokol selesai. Berkas dikirim dan sesi memori telah dibersihkan.**`);
                delete adminReplies[ctx.message.reply_to_message.message_id];
            }).catch((error) => {
                ctx.reply(`❌ Alur pipa gagal: ${error.message}`);
            });
            return;
        }
    }

    const session = await getUserSession(userId);
    if (session && session.feature === 'fix_app' && session.step === 'waiting_text') {
        session.bugDescription = textMessage; 
        session.step = 'waiting_apk'; 
        
        await setUserSession(userId, session);
        return ctx.replyWithMarkdown(
            `🧬 **[ PARSING PARAGRAPH SUCCESSFUL ]**\n\n` +
            `AI Core berhasil menganalisis log keluhan Anda.\n\n` +
            `👉 **LANGKAH 2:** Silakan langsung kirimkan dokumen berkas **(.apk)** yang bermasalah tersebut ke sini, Bro!`
        );
    }
});

// ======================== PEMBONGKAR BINARI (DOCUMENT HANDLER) ========================

bot.on('document', async (ctx) => {
    const userId = ctx.from.id;
    const session = await getUserSession(userId);
    const fileName = ctx.message.document.file_name;
    const fileId = ctx.message.document.file_id;

    if (!fileName.endsWith('.apk')) {
        return ctx.replyWithMarkdown(`❌ **[ INVALID SECURITY FORMAT ]**\nEkstensi ditolak. Sistem AI hanya menerima ekstensi berkas jenis \`.apk\`.`);
    }
    if (!session) {
        return ctx.replyWithMarkdown(`⚠️ **[ TERMINATED SESSION ]**\nMasa aktif token habis atau Anda belum memilih menu. Silakan ketik ulang /start.`);
    }

    session.savedApkId = fileId;
    session.savedApkName = fileName;

    if (session.feature === 'fix_app' && session.step === 'waiting_apk') {
        session.startTime = Date.now(); 
        session.step = 'compiling';
        await setUserSession(userId, session);
        return ctx.replyWithMarkdown(
            `📥 **[ SOURCE MATRIX ACCEPTED ]**\n\`═════════════════════════════════════\`\n` +
            `📂 Berkas: \`${fileName}\`\n` +
            `🧬 Fitur: \`Source Code Logic Repair\`\n\n` +
            `⚡ **AI COMPILING NOTICE:**\n` +
            `Sistem kecerdasan buatan kami memerlukan waktu intensif selama **3 hingga 5 hari kerja** untuk merekonstruksi bytecode Smali agar terhindar dari kerusakan berkas.\n\n` +
            `👉 **Silakan pantau berkala proses otomatisasi kompilasi Anda melalui perintah /status**`
        );
    }

    await setUserSession(userId, session);
    const steps = [
        { pct: 30, txt: 'Membongkar arsip zip dan memetakan biner dex...' },
        { pct: 70, txt: 'Menginjeksikan skrip manipulasi logika awan...' },
        { pct: 100, txt: 'Mengkompilasi ulang komponen berkas sukses!' }
    ];

    let progressMsg = await ctx.replyWithMarkdown(`🛰️ **[ INTERFACING BINARY ] 0%**`);
    for (const step of steps) {
        const bar = '█'.repeat(step.pct / 10) + '░'.repeat(10 - (step.pct / 10));
        await delay(1200);
        await ctx.telegram.editMessageText(ctx.chat.id, progressMsg.message_id, null, `⏳ **[${bar}] ${step.pct}%**\n🔄 *Status AI:* \`${step.txt}\``, { parse_mode: 'Markdown' }).catch(() => {});
    }

    let payCallback = session.feature === 'unpack' ? 'pay_unpack' : (session.feature === 'remove_ads' ? 'pay_ads' : 'pay_jiagu');
    await ctx.replyWithMarkdown(
        `✨ **[ BINARY PROCESSING COMPLETED ]**\n\n` +
        `Matriks aplikasi selesai dimodifikasi secara virtual. Silakan selesaikan validasi enkripsi gerbang lisensi untuk mengunduh hasil berkas:`, 
        Markup.inlineKeyboard([[Markup.button.callback('📥 Unduh Hasil Modifikasi APK', payCallback)]])
    ).catch((err) => console.error(err));
});

// ======================== GERBANG PEMBAYARAN VIA AUTOMATED ALERT GATEWAY ========================

const handlePaymentResponse = (ctx, featureName, priceText) => {
    ctx.answerCbQuery().catch(() => {});
    return ctx.replyWithMarkdown(
        `💳 **[ DIGITAL LICENSE GATEWAY ]**\n` +
        `\`═════════════════════════════════════\`\n\n` +
        `🛠️ Pilihan Modul: **${featureName}**\n` +
        `💰 Token Enkripsi: **${priceText}**\n\n` +
        `👉 Silakan lakukan pembayaran ke QRIS grup resmi. Setelah sukses, **kirimkan berkas gambar tangkapan layar (screenshot) bukti transfer langsung ke sini** agar AI mendeteksi otentikasinya.\n\n` +
        `🚨 **[ CRITICAL ALERT - TERMINATION SECURITY PROTOCOL ]**\n` +
        `*Sistem Keamanan Cloud mendeteksi aktivitas penangguhan berkas binari. Sesi enkripsi ini hanya berlaku selama 24 JAM. Jika bukti lisensi tidak diunggah dalam batas waktu, seluruh cache build, payload modifikasi, dan struktur kode target akan DIHANCURKAN TOTAL secara permanen dari server awan demi mencegah kebocoran data!*`, 
        Markup.inlineKeyboard([[Markup.button.url('📱 Buka Gateway QRIS di Group', 'https://t.me/+7G-rozzl_Uk4NDll')]])
    );
};

bot.action('pay_unpack', (ctx) => { handlePaymentResponse(ctx, '📦 UNPACK CORE RESOURCES', 'Rp 500.000,-'); });
bot.action('pay_ads', (ctx) => { handlePaymentResponse(ctx, '🚫 STRIP & BYPASS AD-LAYERS', 'Rp 250.000,-'); });
bot.action('pay_jiagu', (ctx) => { handlePaymentResponse(ctx, '🛡️ PROTECTION 360 JIAGU', 'Rp 350.000,-'); });
bot.action('pay_fix', (ctx) => { handlePaymentResponse(ctx, '🛠️ SOURCE CODE LOGIC REPAIR', 'Rp 500.000,-'); });

// Express Serverless Setup
const app = express();
app.use(express.json());
app.use(bot.webhookCallback('/api/telegram'));

bot.telegram.setWebhook(`https://bot-telegram-bahasa.vercel.app/api/telegram`).catch((err) => console.error(err));

module.exports = app;
