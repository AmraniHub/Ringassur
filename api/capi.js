const crypto = require('crypto');
const https  = require('https');

var PIXEL_ID_DEFAULT = '944605845074489';
var PAGE_URL = 'https://www.ringassur.com';

// ── Pixel registry — one entry per active pixel, each with its own token ──
// A page opts in by sending pixelId in the CAPI body; anything unset or
// unrecognised falls back to PIXEL_ID_DEFAULT. To add a pixel: create it in
// Meta, generate a System User token (never a short-lived user token — see
// skills/ringassur-error-log.md ERROR #008), add it to Vercel env, add one
// line here.
var PIXEL_REGISTRY = {
  '944605845074489':  { tokenEnv: 'META_CAPI_TOKEN'   }, // ringassurPixel — auto/immo/energie/rappel/test-drive/rc-decennale/emprunteur
  '1011230188058686': { tokenEnv: 'META_CAPI_TOKEN_2' }, // Pixel Mutuelle Santé — mutuelle-sante + variants 1/2/3
  '995355740169875':  { tokenEnv: 'META_CAPI_TOKEN_3' }  // Indemnité journalière — indemnite-journaliere
};

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

// EMQ Fix 2b — Exact DOB, for forms that actually collect one (e.g. an
// <input type="date"> gives YYYY-MM-DD). Meta wants YYYYMMDD before hashing.
// Stronger signal than approxDob() — use this whenever a real date exists.
function hashExactDob(dateStr) {
  if (!dateStr) return undefined;
  var digits = String(dateStr).replace(/\D/g, '');
  if (!/^\d{8}$/.test(digits)) return undefined;
  return hash(digits);
}

// Reads Meta's response instead of discarding it. Previously this called
// r.resume() and resolved with nothing, so a rejected token, a wrong pixel
// ID and a genuine success were all indistinguishable — the endpoint always
// answered {status:'ok'} and CAPI failures were invisible for days.
function postHttps(url, payload) {
  return new Promise(function(resolve) {
    var req = https.request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, function(r) {
      var data = '';
      r.on('data', function(d) { data += d; });
      r.on('end', function() { resolve({ status: r.statusCode, body: data }); });
    });
    req.on('error', function(e) { resolve({ status: 0, body: 'request_error: ' + e.message }); });
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

    // Accept pixelId from the page — allows variants to use a different pixel.
    // Unset or unrecognised falls back to the legacy default pixel + its token.
    var pixelId = PIXEL_REGISTRY[body.pixelId] ? body.pixelId : PIXEL_ID_DEFAULT;

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
    // Exact DOB (date_naissance) beats an approximated bracket when a form
    // actually collects one — prefer it whenever both could apply.
    if (body.date_naissance) userData.db = [hashExactDob(body.date_naissance)].filter(Boolean);
    else if (body.tranche_age) userData.db = [approxDob(body.tranche_age)].filter(Boolean); // EMQ Fix 2: DOB

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
    // Each pixel has its own token; fall back to the legacy default token
    // if a pixel's dedicated one isn't set yet in Vercel.
    var tokenEnv  = PIXEL_REGISTRY[pixelId].tokenEnv;
    var capiToken = process.env[tokenEnv] || process.env.META_CAPI_TOKEN || '';
    var capiUrl   = 'https://graph.facebook.com/v19.0/' + pixelId + '/events?access_token=' + capiToken;
    var capiPayload = JSON.stringify({ data: events });
    var capiRes = await postHttps(capiUrl, capiPayload);

    // Surface Meta's verdict. NOTE: never echo capiUrl — it carries the token.
    var capiOk = capiRes.status >= 200 && capiRes.status < 300;
    if (!capiOk) {
      console.error('[capi] Meta rejected event', {
        pixelId: pixelId, tokenEnv: tokenEnv, tokenPresent: !!capiToken,
        eventName: eventName, httpStatus: capiRes.status, metaResponse: capiRes.body
      });
    }

    // Telegram notifications are handled by Google Apps Script (client-side)
    // to avoid duplicate messages. CAPI handles Meta tracking only.

    return res.status(200).json({
      status:    capiOk ? 'ok' : 'capi_error',
      eventName: eventName,
      eventId:   eventId,
      pixelId:   pixelId,
      // Lets you tell a rejected token from a genuine success instead of
      // always seeing "ok". Kept on a 200 so a CAPI failure never breaks
      // the form's success path for the visitor.
      capiStatus: capiRes.status,
      capiError:  capiOk ? undefined : capiRes.body
    });

  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
