const crypto = require('crypto');

function hash(val) {
  if (!val) return undefined;
  return crypto.createHash('sha256').update(String(val).trim().toLowerCase()).digest('hex');
}

module.exports = async function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    var body = req.body || {};
    var prenom     = body.prenom     || '';
    var nom        = body.nom        || '';
    var email      = body.email      || '';
    var telephone  = body.telephone  || '';
    var codePostal = body.codePostal || '';
    var activite   = body.activite   || '';
    var ca         = body.ca         || '';
    var eventId    = body.eventId    || ('lead_capi_' + Date.now());
    var fbp        = body.fbp        || '';
    var fbc        = body.fbc        || '';

    var clientIp  = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '';
    var userAgent = req.headers['user-agent'] || '';

    // Build user_data with hashed PII
    var userData = {};
    if (email)      userData.em = [hash(email)];
    if (telephone)  userData.ph = [hash(telephone.replace(/\D/g, ''))];
    if (prenom)     userData.fn = [hash(prenom)];
    if (nom)        userData.ln = [hash(nom)];
    if (codePostal) userData.zp = [hash(codePostal)];
    userData.country = ['fr'];
    if (clientIp)  userData.client_ip_address = clientIp;
    if (userAgent) userData.client_user_agent = userAgent;
    if (fbp)       userData.fbp = fbp;
    if (fbc)       userData.fbc = fbc;

    var eventData = {
      data: [{
        event_name: 'Lead',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: 'https://ringassur.com/merci.html',
        user_data: userData,
        custom_data: {
          content_name: 'Formulaire Artisans BTP',
          content_category: 'Artisans BTP',
          activite: activite,
          ca: ca
        }
      }]
    };

    var pixelId    = '944605845074489';
    var capiToken  = process.env.META_CAPI_TOKEN || '';
    var capiUrl    = 'https://graph.facebook.com/v19.0/' + pixelId + '/events?access_token=' + capiToken;

    // Send to Facebook CAPI
    var https = require('https');
    var capiPayload = JSON.stringify(eventData);

    await new Promise(function(resolve) {
      var capiReq = https.request(capiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(capiPayload)
        }
      }, function(r) {
        r.resume();
        r.on('end', resolve);
      });
      capiReq.on('error', resolve);
      capiReq.write(capiPayload);
      capiReq.end();
    });

    // Send Telegram notification
    var telegramToken  = process.env.TELEGRAM_TOKEN   || '';
    var telegramChat   = process.env.TELEGRAM_CHAT_ID || '1882834400';
    var telegramUrl    = 'https://api.telegram.org/bot' + telegramToken + '/sendMessage';

    var msg = '🔔 Nouveau lead Ringassur\n\n'
      + 'Nom : ' + prenom + ' ' + nom + '\n'
      + 'Email : ' + email + '\n'
      + 'Tel : ' + telephone + '\n'
      + 'CP : ' + codePostal + '\n'
      + 'Activite : ' + activite + '\n'
      + 'CA HT : ' + ca + ' EUR\n'
      + 'SIREN : ' + (body.siren || '') + '\n'
      + 'EventID : ' + eventId;

    var tgPayload = JSON.stringify({ chat_id: telegramChat, text: msg });

    await new Promise(function(resolve) {
      var tgReq = https.request(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(tgPayload)
        }
      }, function(r) {
        r.resume();
        r.on('end', resolve);
      });
      tgReq.on('error', resolve);
      tgReq.write(tgPayload);
      tgReq.end();
    });

    return res.status(200).json({ status: 'ok', eventId: eventId });

  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
