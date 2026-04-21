import nodemailer from 'nodemailer';

// ============================================================
// Baca dari .env.local (sama persis dengan env yang ada)
// ============================================================
const FONNTE_TOKEN  = process.env.WHATSAPP_API_KEY  || '';
const WA_NUMBERS    = (process.env.WHATSAPP_ADMIN_PHONE || '').split(',').map(n => n.trim()).filter(Boolean);
const EMAIL_TO      = process.env.SMTP_USER || 'rahmatfadila717@gmail.com';
const SMTP_HOST     = process.env.SMTP_HOST     || 'smtp.gmail.com';
const SMTP_PORT     = parseInt(process.env.SMTP_PORT || '587');
const SMTP_SECURE   = process.env.SMTP_SECURE === 'true';  // false = STARTTLS
const SMTP_USER     = process.env.SMTP_USER     || '';
const SMTP_PASS     = process.env.SMTP_PASS     || '';
const SMTP_FROM     = process.env.SMTP_FROM     || `"Furniture Co." <${SMTP_USER}>`;

// ----------------------------------------------------------------
// Format Rupiah
// ----------------------------------------------------------------
function fmt(n: number) {
  return 'Rp ' + Math.round(n).toLocaleString('id-ID');
}

// ================================================================
// 1. WHATSAPP via Fonnte
// ================================================================
export async function sendWhatsAppNotification({
  orderId, buyerName, total, itemSummary,
}: { orderId: string; buyerName: string; total: number; itemSummary: string }) {
  const message =
    `✅ *Pesanan Berhasil – Furniture Co.*\n\n` +
    `Halo, ada pesanan baru masuk!\n\n` +
    `📦 *No. Pesanan:* ${orderId}\n` +
    `👤 *Pelanggan:* ${buyerName}\n` +
    `🛒 *Barang:*\n${itemSummary}\n` +
    `💰 *Total Dibayar:* ${fmt(total)}\n\n` +
    `Silakan segera diproses. Terima kasih! 🙏`;

  for (const number of WA_NUMBERS) {
    try {
      const res = await fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: {
          Authorization: FONNTE_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ target: number, message, countryCode: '62' }),
      });
      const json = await res.json();
      console.log(`[WA ${number}]`, json);
    } catch (err) {
      console.error(`[WA ${number}] Gagal kirim:`, err);
    }
  }
}

// ================================================================
// 2. EMAIL via Nodemailer (Gmail SMTP)
// ================================================================
export async function sendEmailNotification({
  orderId, buyerName, buyerEmail, total, items,
}: {
  orderId: string;
  buyerName: string;
  buyerEmail: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
}) {
  if (!SMTP_PASS) {
    console.warn('[EMAIL] SMTP_PASS belum diset di .env.local, skip kirim email.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  const rows = items
    .map(i => `<tr>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">${i.name}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center">${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right">${fmt(i.price * i.quantity)}</td>
    </tr>`)
    .join('');

  const html = `
  <div style="font-family:sans-serif;max-width:600px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
    <div style="background:#133A42;padding:40px 32px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:26px">✅ Pembayaran Berhasil!</h1>
      <p style="color:#a7dbd8;margin:8px 0 0">Ada pesanan baru dari Furniture Co.</p>
    </div>
    <div style="padding:32px">
      <p style="color:#555">Halo Admin,</p>
      <p style="color:#555">Pesanan baru telah berhasil dibayar. Berikut detailnya:</p>

      <table style="width:100%;margin:24px 0;border-collapse:collapse">
        <tr style="background:#f8f8f8">
          <th style="padding:10px 12px;text-align:left;font-size:12px;color:#888;text-transform:uppercase">Produk</th>
          <th style="padding:10px 12px;text-align:center;font-size:12px;color:#888;text-transform:uppercase">Qty</th>
          <th style="padding:10px 12px;text-align:right;font-size:12px;color:#888;text-transform:uppercase">Subtotal</th>
        </tr>
        ${rows}
      </table>

      <div style="display:flex;justify-content:space-between;align-items:center;background:#133A42;border-radius:12px;padding:20px 24px;margin-top:16px">
        <span style="color:#a7dbd8;font-weight:bold">Total Dibayar</span>
        <span style="color:#00A19D;font-size:24px;font-weight:900">${fmt(total)}</span>
      </div>

      <table style="margin-top:24px;width:100%">
        <tr><td style="color:#888;padding:4px 0;font-size:13px;width:140px">No. Pesanan</td><td style="color:#133A42;font-weight:bold;font-size:13px">${orderId}</td></tr>
        <tr><td style="color:#888;padding:4px 0;font-size:13px">Pelanggan</td><td style="color:#133A42;font-weight:bold;font-size:13px">${buyerName}</td></tr>
        <tr><td style="color:#888;padding:4px 0;font-size:13px">Email</td><td style="color:#133A42;font-size:13px">${buyerEmail}</td></tr>
        <tr><td style="color:#888;padding:4px 0;font-size:13px">Tanggal</td><td style="color:#133A42;font-size:13px">${new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td></tr>
      </table>

      <p style="color:#aaa;font-size:12px;margin-top:32px;text-align:center">
        © ${new Date().getFullYear()} Furniture Co. — Email otomatis, tidak perlu dibalas.
      </p>
    </div>
  </div>`;

  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to: EMAIL_TO,
      subject: `[Furniture Co.] Pesanan Baru – ${orderId}`,
      html,
    });
    console.log('[EMAIL] Terkirim:', info.messageId);
  } catch (err) {
    console.error('[EMAIL] Gagal kirim:', err);
  }
}
