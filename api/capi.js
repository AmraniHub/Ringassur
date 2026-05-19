const crypto = require('crypto');
const https  = require('https');

var PIXEL_ID = '944605845074489';
var PAGE_URL = 'https://ringassur.com';

function hash(val) {
  if (!val) return undefined;
  return crypto.createHash('sha256').update(String(val).trim().toLowerCase()).digest('hex');
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
    if (body.email)     userData.em = [hash(body.email)];
    if (body.telephone) userData.ph = [hash(String(body.telephone).replace(/\D/g, ''))];
    if (body.prenom)    userData.fn = [hash(body.prenom)];
    if (body.nom)       userData.ln = [hash(body.nom)];

    // ── custom_data (service-specific) ────────────────────────
    var customData = {
      content_name:     serviceName,
      content_category: serviceCat,
      content_type:     'lead_form'
    };
    if (body.activite)   customData.activite  = body.activite;
    if (body.situation)  customData.situation = body.situation;
    if (body.ca)         customData.ca        = body.ca;

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

    // If caller provided a custom event name (e.g. Lead_AssuranceAuto),
    // include it in the SAME batch call → Facebook deduplicates both separately
    if (body.customEventName && body.customEventId) {
      events.push({
        event_name:       body.customEventName,
        event_time:       Math.floor(Date.now() / 1000),
        event_id:         body.customEventId,
        action_source:    'website',
        event_source_url: sourceUrl,
        user_data:        userData,
        custom_data:      customData
      });
    }

    // ── send to Meta CAPI ──────────────────────────────────────
    var capiToken   = process.env.META_CAPI_TOKEN || '';
    var capiUrl     = 'https://graph.facebook.com/v19.0/' + PIXEL_ID + '/events?access_token=' + capiToken;
    var capiPayload = JSON.stringify({ data: events });
    await postHttps(capiUrl, capiPayload);

    // ── Telegram — only for Lead events ───────────────────────
    if (eventName === 'Lead') {
      var telegramToken = process.env.TELEGRAM_TOKEN   || '';
      var telegramChat  = process.env.TELEGRAM_CHAT_ID || '1882834400';
      var telegramUrl   = 'https://api.telegram.org/bot' + telegramToken + '/sendMessage';

      var msg = '🔔 Nouveau lead — ' + serviceName + '\n\n'
        + 'Nom : '      + (body.prenom || '') + ' ' + (body.nom || '') + '\n'
        + 'Tel : '      + (body.telephone  || '') + '\n'
        + 'Email : '    + (body.email      || '') + '\n'
        + 'Service : '  + serviceName + '\n'
        + (body.situation ? 'Situation : ' + body.situation + '\n' : '')
        + (body.activite  ? 'Activite : '  + body.activite  + '\n' : '')
        + (body.ca        ? 'CA HT : '     + body.ca + ' EUR\n' : '')
        + (body.siren     ? 'SIREN : '     + body.siren + '\n' : '')
        + 'EventID : '  + eventId;

      await postHttps(telegramUrl, JSON.stringify({ chat_id: telegramChat, text: msg }));
    }

    return res.status(200).json({ status: 'ok', eventName: eventName, eventId: eventId });

  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
