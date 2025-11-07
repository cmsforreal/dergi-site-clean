// netlify/functions/submit.js
export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const data = JSON.parse(event.body || '{}');
    const { name, email, title, category, link } = data;

    if (!name || !email || !title) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Zorunlu alanlar eksik.' }) };
    }

    // --- E-POSTA: Resend ---
    if (!process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Mail yapılandırması eksik.' }) };
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TurkMSIC Dergi <onboarding@resend.dev>',
        to: [process.env.NOTIFY_EMAIL],
        subject: `[Katkı] ${category || 'Kategori'} — ${title}`,
        text:
`Ad: ${name}
E-posta: ${email}
Kategori: ${category || '-'}
Başlık: ${title}
Link: ${link || '-'}

Zaman: ${new Date().toISOString()}`,
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'Mail gönderilemedi', details: msg }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Sunucu hatası' }) };
  }
};
