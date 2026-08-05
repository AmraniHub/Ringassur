const crypto = require('crypto');
const https  = require('https');

var PIXEL_ID_DEFAULT = '944605845074489';
var PIXEL_ID_NEW     = '1011230188058686';
var PAGE_URL = 'https://www.ringassur.com';

function hash(val) {
  if (!val) return undefined;
  return crypto.createHash('sha256').update(String(val).trim().toLowerCase()).digest('hex');
}

// EMQ Fix 1 — Normalize phone to E.164 before hashing
// 0612345678 → 33612345678 → hash. Matches Meta's user graph.
function hashPhone(phone) {
  if (!phone) return undefined;
  var digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10 && digits.startsWith('0')) {
    digits = '33' + digits.slice(1);
  }
  return crypto.createHash('sha256').update(digits).digest('hex');
}

// EMQ Fix 2 — Approximate DOB from age bracket
// Ringassur form has tranche_age: 36-55, 55-65, 65+
// Converts to approximate birth year → adds signal to user_data
function approxDob(tranche) {
  var yr = new Date().getFullYear();
  var map = { '65+': yr - 67, '55-65': yr - 60, '36-55': yr - 45 };
  var birthYear = map[tranche];
  if (!birthYear) return undefined;
  return hash(String(birthYear) + '0101');
}

function postHttps(url, payload) {
  return new Promise(function(resolve) {
    var req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, function(r) { r.resume(); r.on('end', resolve); });
    req.on('error', resolve);
    req.write(payload);
    req.end();
  });
}

module.exports = async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  try {
    var body      = req.body || {};
    var eventName = body.eventName || 'Lead';
    var eventId   = body.eventId   || (eventName.toLowerCase() + '_capi_' + Date.now());
    var sourceUrl = body.sourceUrl || PAGE_URL;
    var fbp       = body.fbp || '';
    var fbc       = body.fbc || '';

    // Accept pixelId from the page — allows variants to use a different pixel
    var pixelId = (body.pixelId === PIXEL_ID_NEW) ? PIXEL_ID_NEW : PIXEL_ID_DEFAULT;

    // ── service info (dynamic per page) ───────────────────────
    var serviceName = body.content_name     || body.activite || 'Ringassur';
    var serviceCat  = body.content_category || body.activite || 'Assurance';

    var clientIp  = (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
                    || (req.socket && req.socket.remoteAddress) || '';
    var userAgent = req.headers['user-agent'] || '';

    // ── user_data ──────────────────────────────────────────────
    var userData = { country: ['fr'] };
    if (clientIp)  userData.client_ip_address = clientIp;
    if (userAgent) userData.client_user_agent  = userAgent;
    if (fbp)       userData.fbp = fbp;
    if (fbc)       userData.fbc = fbc;
    if (body.email)        userData.em          = [hash(body.email)];
    if (body.telephone)    userData.ph          = [hashPhone(body.telephone)];  // EMQ Fix 1: E.164
    if (body.prenom)       userData.fn          = [hash(body.prenom)];
    if (body.nom)          userData.ln          = [hash(body.nom)];
    if (body.tranche_age)  userData.db          = [approxDob(body.tranche_age)].filter(Boolean); // EMQ Fix 2: DOB

    // EMQ Fix 3 — Stable external_id built from phone + name (no email — phone is the stable identifier)
    // Gives Meta a consistent ID to link multiple events from same user
    var extRaw = (body.telephone || '') + (body.nom || '');
    if (extRaw.trim()) userData.external_id = [hash(extRaw)];

    // ── custom_data — ONLY generic fields sent to Meta ───────────
    // Financial/sensitive details (activite, situation, ca, siren)
    // are stored in Google Sheets only — never sent to Meta CAPI
    // to avoid financial service data restrictions.
    var customData = {
      content_name:     serviceName,
      content_category: serviceCat,
      content_type:     'lead_form'
    };

    // ── build events batch ─────────────────────────────────────
    // Always include the standard event (Lead / ViewContent / PageView)
    var events = [{
      event_name:       eventName,
      event_time:       Math.floor(Date.now() / 1000),
      event_id:         eventId,
      action_source:    'website',
      event_source_url: sourceUrl,
      user_data:        userData,
      custom_data:      customData
    }];

    // Custom events (Lead_XXX) are blocked by Meta for financial service domains.
    // We send ONLY the standard Lead event — differentiation is done via
    // URL-based Custom Conversions in Ads Manager.

    // ── send to Meta CAPI ──────────────────────────────────────
    // Use dedicated token per pixel — META_CAPI_TOKEN_2 for the new pixel
    var capiToken = (pixelId === PIXEL_ID_NEW)
      ? (process.env.META_CAPI_TOKEN_2 || process.env.META_CAPI_TOKEN || '')
      : (process.env.META_CAPI_TOKEN   || '');
    var capiUrl   = 'https://graph.facebook.com/v19.0/' + pixelId + '/events?access_token=' + capiToken;
    var capiPayload = JSON.stringify({ data: events });
    await postHttps(capiUrl, capiPayload);

    // Telegram notifications are handled by Google Apps Script (client-side)
    // to avoid duplicate messages. CAPI handles Meta tracking only.

    return res.status(200).json({ status: 'ok', eventName: eventName, eventId: eventId });

  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
