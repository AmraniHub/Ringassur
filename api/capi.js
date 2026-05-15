const crypto = require('crypto');

function hash(value) {
  if (!value) return undefined;
  return crypto.createHash('sha256').update(String(value).trim().toLowerCase()).digest('hex');
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const {
      prenom, nom, email, telephone, codePostal,
      activite, eventId, fbp, fbc
    } = req.body;

    const clientIp =
      req.headers['x-forwarded-for']?.split(',')[0].trim() ||
      req.headers['x-real-ip'] ||
      '0.0.0.0';
    const userAgent = req.headers['user-agent'] || '';
    const eventTime = Math.floor(Date.now() / 1000);
    const finalEventId = eventId || `lead_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const userData = {
      em:                  hash(email),
      ph:                  hash(telephone ? telephone.replace(/[\s\-\.]/g, '') : null),
      fn:                  hash(prenom),
      ln:                  hash(nom),
      zp:                  hash(codePostal),
      ct:                  hash('france'),
      country:             hash('fr'),
      client_ip_address:   clientIp,
      client_user_agent:   userAgent,
    };

    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    // Remove undefined fields
    Object.keys(userData).forEach(k => {
      if (!userData[k]) delete userData[k];
    });

    const payload = {
      data: [{
        event_name:       'Lead',
        event_time:       eventTime,
        event_id:         finalEventId,
        action_source:    'website',
        event_source_url: 'https://www.ringassur.com/merci.html',
        user_data:        userData,
        custom_data: {
          content_name:     'Formulaire Artisans BTP',
          content_category: 'Artisans BTP',
          activite:         activite || ''
        }
      }]
    };

    // ---- Send to Facebook CAPI ----
    const fbRes = await fetch(
      `https://graph.facebook.com/v19.0/944605845074489/events?access_token=${process.env.META_CAPI_TOKEN}`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      }
    );

    const result = await fbRes.json();

    if (!fbRes.ok) {
      console.error('CAPI error:', JSON.stringify(result));
    }

    // ---- Send Telegram notification ----
    const now = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
    const message =
      `🔔 <b>Nouveau Lead Ringassur</b>\n\n` +
      `📅 <b>Date :</b> ${now}\n` +
      `👤 <b>Nom :</b> ${prenom || ''} ${nom || ''}\n` +
      `📧 <b>Email :</b> ${email || '-'}\n` +
      `📞 <b>Téléphone :</b> ${telephone || '-'}\n` +
      `📍 <b>Code Postal :</b> ${codePostal || '-'}\n` +
      `🏗️ <b>Activité :</b> ${activite || '-'}\n` +
      `💶 <b>CA estimé :</b> ${req.body.ca ? Number(req.body.ca).toLocaleString('fr-FR') + ' € HT' : '-'}`;

    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`,
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          chat_id:    process.env.TELEGRAM_CHAT_ID,
          text:       message,
          parse_mode: 'HTML'
        })
      }
    ).catch(err => console.error('Telegram error:', err.message));

    return res.status(200).json({ success: true, events_received: result.events_received });

  } catch (err) {
    console.error('CAPI exception:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
