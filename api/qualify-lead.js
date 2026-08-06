/**
 * /api/qualify-lead
 * ─────────────────────────────────────────────────────────────────────────────
 * Called by XLead24 (or a courtier) once a lead is confirmed as real business.
 * Fires a CAPI "Purchase" so Meta learns what a *buyer* looks like, instead of
 * optimising for whoever fills in a form.
 *
 * Usage:
 *   POST https://ringassur.com/api/qualify-lead
 *   Headers: { "X-Secret": "<QUALIFY_SECRET>", "Content-Type": "application/json" }
 *   Body: {
 *     "phone":     "0612345678",                              // required (or email)
 *     "email":     "marie@gmail.com",                         // optional, improves matching
 *     "value":     20,                                        // what the courtier actually paid
 *     "sourceUrl": "https://www.ringassur.com/mutuelle-sante", // page the lead came from
 *     "pixelId":   "1011230188058686"                         // optional, see registry
 *   }
 *
 * Env vars on Vercel: QUALIFY_SECRET, plus the pixel tokens below.
 *
 * IMPORTANT — the hashing here must stay byte-identical to api/capi.js.
 * Meta matches a Purchase to its original Lead purely by comparing hashes, so
 * any divergence silently breaks the loop: events keep returning 200, Ads
 * Manager keeps showing Purchases, and none of them attach to a real person.
 * That is exactly what happened before this rewrite — capi.js normalised
 * phones to E.164 first and this file did not, so every hash disagreed.
 */

const crypto = require('crypto');
const https  = require('https');

const PAGE_URL          = 'https://www.ringassur.com';
const PIXEL_ID_DEFAULT  = '1011230188058686'; // Mutuelle Santé — the only vertical running ads
const LEAD_VALUE        = 20;                 // €, fallback when the caller omits value

// Mirrors the registry in api/capi.js. Keep the two in step.
const PIXEL_REGISTRY = {
  '944605845074489':  { tokenEnv: 'META_CAPI_TOKEN'   }, // auto/immo/energie/rappel/rc-decennale/emprunteur
  '1011230188058686': { tokenEnv: 'META_CAPI_TOKEN_2' }, // mutuelle-sante + variants 1/2/3
  '995355740169875':  { tokenEnv: 'META_CAPI_TOKEN_3' }  // indemnite-journaliere
};

function hash(val) {
  if (!val) return undefined;
  return crypto.createHash('sha256').update(String(val).trim().toLowerCase()).digest('hex');
}

/** 0612345678 → 33612345678 → sha256. Must match capi.js exactly. */
function hashPhone(phone) {
  if (!phone) return undefined;
  let digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10 && digits.startsWith('0')) {
    digits = '33' + digits.slice(1);
  }
  return crypto.createHash('sha256').update(digits).digest('hex');
}

/**
 * Meta restricts URL parameters for health-adjacent verticals, and the query
 * string carries UTMs we don't want to forward. Keeps scheme + host + path,
 * which campaign reporting relies on via URL-based Custom Conversions.
 */
function sanitizeSourceUrl(raw) {
  try {
    const u = new URL(String(raw));
    if (!/(^|\.)ringassur\.com$/.test(u.hostname)) return PAGE_URL;
    return u.origin + u.pathname;
  } catch (e) {
    return PAGE_URL;
  }
}

function postHttps(url, payload) {
  return new Promise(function (resolve) {
    const req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, function (r) {
      let data = '';
      r.on('data', function (d) { data += d; });
      r.on('end', function () { resolve({ status: r.statusCode, body: data }); });
    });
    req.on('error', function (e) { resolve({ status: 0, body: 'request_error: ' + e.message }); });
    req.write(payload);
    req.end();
  });
}

module.exports = async function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Secret');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const secret = process.env.QUALIFY_SECRET;
  if (secret && req.headers['x-secret'] !== secret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Refuse to run unauthenticated: without this, anyone who finds the URL can
  // inject fake Purchases and poison the optimisation this endpoint exists for.
  if (!secret) {
    console.error('[qualify-lead] QUALIFY_SECRET is not set — refusing to fire');
    return res.status(503).json({ error: 'QUALIFY_SECRET not configured' });
  }

  try {
    const body  = req.body || {};
    const phone = body.phone ? String(body.phone) : null;
    const email = body.email ? String(body.email).trim().toLowerCase() : null;
    const value = parseFloat(body.value) || LEAD_VALUE;

    if (!phone && !email) {
      return res.status(400).json({ error: 'Provide phone or email to match the lead' });
    }

    const pixelId   = PIXEL_REGISTRY[body.pixelId] ? body.pixelId : PIXEL_ID_DEFAULT;
    const sourceUrl = sanitizeSourceUrl(body.sourceUrl || PAGE_URL);

    // ── user_data — same shape capi.js sends, so the hashes line up ────────
    const userData = { country: ['fr'] };
    if (email) userData.em = [hash(email)];
    if (phone) userData.ph = [hashPhone(phone)];

    // capi.js builds external_id from phone + surname. We rarely have the name
    // here, so phone alone is used; Meta still links on ph/em above.
    const extRaw = (phone || '') + (body.nom || '');
    if (extRaw.trim()) userData.external_id = [hash(extRaw)];

    // NOTE: no client_ip_address / client_user_agent. Those belong to the
    // courtier's server, not the lead — sending them would attach a stranger's
    // device signals to this person and degrade matching.

    // ── Deterministic event_id: same lead on the same day ⇒ same id, so a
    // retry or a double-confirmation is deduplicated by Meta rather than
    // counted twice and inflating apparent lead quality. ───────────────────
    const dayStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const eventId  = 'qual_' + crypto.createHash('sha256')
      .update((phone || email) + '_' + dayStamp)
      .digest('hex').slice(0, 24);

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

    const tokenEnv = PIXEL_REGISTRY[pixelId].tokenEnv;
    const token    = process.env[tokenEnv] || process.env.META_CAPI_TOKEN || '';
    if (!token) {
      console.error('[qualify-lead] no CAPI token for pixel', pixelId, '(' + tokenEnv + ')');
      return res.status(503).json({ error: 'CAPI token not configured for pixel ' + pixelId });
    }

    const capiUrl = 'https://graph.facebook.com/v19.0/' + pixelId + '/events?access_token=' + token;
    const result  = await postHttps(capiUrl, JSON.stringify({ data: events }));
    const capiOk  = result.status >= 200 && result.status < 300;

    // Surface Meta's verdict rather than always answering "ok" — a rejected
    // token and a real success must not look the same from the caller's side.
    if (!capiOk) {
      console.error('[qualify-lead] Meta rejected Purchase', {
        pixelId: pixelId, tokenEnv: tokenEnv, eventId: eventId,
        httpStatus: result.status, metaResponse: result.body
      });
    } else {
      console.log('[qualify-lead] Purchase accepted', eventId, 'pixel', pixelId, 'value', value);
    }

    return res.status(capiOk ? 200 : 502).json({
      status:     capiOk ? 'ok' : 'capi_error',
      event:      'Purchase',
      value:      value,
      eventId:    eventId,
      pixelId:    pixelId,
      capiStatus: result.status,
      capiError:  capiOk ? undefined : result.body
    });

  } catch (err) {
    console.error('[qualify-lead] Error:', err.message);
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
