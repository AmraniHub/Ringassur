/**
 * /api/qualify-lead
 * ─────────────────────────────────────────────────────────────────────────────
 * Called by the broker when a lead is confirmed as qualified.
 * Fires a CAPI "Purchase" event so Meta learns what a good lead looks like.
 *
 * Result after 4-8 weeks: CPL drops ~54% as Meta optimises for real buyers.
 *
 * Usage (broker calls this when they confirm a lead):
 *   POST https://ringassur.com/api/qualify-lead
 *   Headers: { "X-Secret": "your_secret" }
 *   Body: { "phone": "0612345678", "email": "marie@gmail.com", "value": 20 }
 *
 * Requires env vars on Vercel:
 *   META_CAPI_TOKEN_2   — pixel 1011230188058686 token
 *   QUALIFY_SECRET      — shared secret to authenticate broker calls
 */

const crypto = require('crypto');
const https  = require('https');

const PIXEL_ID   = '1011230188058686';
const LEAD_VALUE = 20; // €20 default — your lead sell price

function hash(val) {
  if (!val) return undefined;
  return crypto.createHash('sha256').update(String(val).trim().toLowerCase()).digest('hex');
}

function postHttps(url, payload) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (r) => {
      let data = '';
      r.on('data', d => data += d);
      r.on('end', () => resolve({ status: r.statusCode, body: data }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

module.exports = async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Secret');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  // ── Auth ───────────────────────────────────────────────────────────────────
  const secret = process.env.QUALIFY_SECRET;
  if (secret && req.headers['x-secret'] !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const body  = req.body || {};
    const phone = body.phone ? String(body.phone).replace(/\D/g, '') : null;
    const email = body.email ? String(body.email).trim().toLowerCase() : null;
    const value = parseFloat(body.value) || LEAD_VALUE;

    if (!phone && !email) {
      return res.status(400).json({ error: 'Provide phone or email to match the lead' });
    }

    // ── user_data ──────────────────────────────────────────────────────────
    const userData = { country: ['fr'] };
    if (email) userData.em = [hash(email)];
    if (phone) userData.ph = [hash(phone)];

    const clientIp  = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || '';
    const userAgent = req.headers['user-agent'] || '';
    if (clientIp)  userData.client_ip_address = clientIp;
    if (userAgent) userData.client_user_agent  = userAgent;

    // ── Purchase event ─────────────────────────────────────────────────────
    const eventId = 'qual_' + Date.now() + '_' + Math.random().toString(36).slice(2);

    // The lead's own landing page, so qualified conversions are attributed to
    // the campaign that produced them. Hardcoding one page sent every vertical's
    // Purchase to /mutuelle-sante3 and made cross-niche attribution meaningless.
    const sourceUrl = typeof body.sourceUrl === 'string' && /^https:\/\/(www\.)?ringassur\.com\//.test(body.sourceUrl)
      ? body.sourceUrl
      : 'https://www.ringassur.com/';

    const events = [{
      event_name:       'Purchase',
      event_time:       Math.floor(Date.now() / 1000),
      event_id:         eventId,
      action_source:    'website',
      event_source_url: sourceUrl,
      user_data:        userData,
      custom_data: {
        value:        value,
        currency:     'EUR',
        content_name: body.contentName || 'Lead qualifié',
        content_type: 'lead_qualified'
      }
    }];

    // ── Fire CAPI ──────────────────────────────────────────────────────────
    const token   = process.env.META_CAPI_TOKEN_2 || process.env.META_CAPI_TOKEN || '';
    const capiUrl = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${token}`;
    const result  = await postHttps(capiUrl, JSON.stringify({ data: events }));

    console.log('[qualify-lead] fired Purchase event:', eventId, '| CAPI status:', result.status);

    return res.status(200).json({
      status:     'ok',
      event:      'Purchase',
      value,
      eventId,
      capiStatus: result.status
    });

  } catch (err) {
    console.error('[qualify-lead] Error:', err.message);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
