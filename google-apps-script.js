// ============================================================
//  RINGASSUR — Google Apps Script  (multi-service version)
//
//  ► One spreadsheet, one sheet per service + master sheet
//  ► One Telegram bot for all services
//
//  SETUP (do this once):
//  1. script.google.com → open your project → replace ALL code with this
//  2. Click ▶ Run → select function "createAllSheets" → Run
//     (this creates all tabs immediately with correct headers)
//  3. Deploy → Manage deployments → edit → New version → Deploy
// ============================================================

var SHEET_ID       = '13LO7P7JyZLt5euFeULdrV6f9m67Nsa25ZaAfKC39QgI';

// ── Tokens stored in Script Properties (never hardcode in file) ─
// Set these in: Project Settings → Script Properties
// TELEGRAM_TOKEN    = bot 1 token from @BotFather
// TELEGRAM_CHAT     = bot 1 chat ID
// TELEGRAM_TOKEN_2  = bot 2 token from @BotFather
// TELEGRAM_CHAT_2   = bot 2 chat ID (8783262565)
var _props          = PropertiesService.getScriptProperties();
var TELEGRAM_TOKEN  = _props.getProperty('TELEGRAM_TOKEN')   || '';
var TELEGRAM_CHAT   = _props.getProperty('TELEGRAM_CHAT')    || '';
var TELEGRAM_TOKEN2 = _props.getProperty('TELEGRAM_TOKEN_2') || '';
var TELEGRAM_CHAT2  = _props.getProperty('TELEGRAM_CHAT_2')  || '';

// ── Service → sheet name + emoji ─────────────────────────────
var SERVICES = {
  'Assurance Auto':         { sheet: 'Assurance Auto',     emoji: '🚗' },
  'Energie':                { sheet: 'Energie',            emoji: '⚡' },
  'Estimation Immobiliere': { sheet: 'Estimation Immo',    emoji: '🏠' },
  'Rappel':                 { sheet: 'Rappel',             emoji: '📞' },
  'Test Drive':             { sheet: 'Test Drive',         emoji: '🏎️' },
  'RC Decennale':           { sheet: 'RC Décennale',       emoji: '🏗️' },
  'Mutuelle Sante':         { sheet: 'Mutuelle Santé',     emoji: '💚' },
  'Mutuelle Sante 1':       { sheet: 'Mutuelle Santé 1',   emoji: '💚' },
  'Mutuelle Sante 2':       { sheet: 'Mutuelle Santé 2',   emoji: '💚' },
  'Mutuelle Sante 3':       { sheet: 'Mutuelle Santé 3',   emoji: '💚' }
};

// ── Parse UTM params — supports both formats:
//   (A) legacy: p.utm = "?utm_source=facebook&utm_medium=paid&..."
//   (B) new:    p.utm_source, p.utm_medium, p.utm_campaign, p.utm_content (individual params)
function parseUtm(raw, p) {
  var out = { source: '', medium: '', campaign: '', content: '' };

  // (B) Individual params take priority (new pages send these)
  if (p) {
    if (p.utm_source)   out.source   = p.utm_source;
    if (p.utm_medium)   out.medium   = p.utm_medium;
    if (p.utm_campaign) out.campaign = p.utm_campaign;
    if (p.utm_content)  out.content  = p.utm_content;
  }

  // (A) Legacy fallback: parse the raw utm query string
  if (!out.source && raw) {
    var str = raw.replace(/^\?/, '');
    str.split('&').forEach(function(pair) {
      var kv = pair.split('=');
      var k  = decodeURIComponent(kv[0] || '').toLowerCase();
      var v  = decodeURIComponent((kv[1] || '').replace(/\+/g, ' '));
      if (k === 'utm_source')   out.source   = v;
      if (k === 'utm_medium')   out.medium   = v;
      if (k === 'utm_campaign') out.campaign = v;
      if (k === 'utm_content')  out.content  = v;
    });
  }
  return out;
}

// ── Telegram ─────────────────────────────────────────────────
function sendToBot(token, chatId, text) {
  if (!token || !chatId) return;
  try {
    UrlFetchApp.fetch(
      'https://api.telegram.org/bot' + token + '/sendMessage',
      {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'HTML' }),
        muteHttpExceptions: true
      }
    );
  } catch(e) {}
}

function sendTelegram(text) {
  sendToBot(TELEGRAM_TOKEN,  TELEGRAM_CHAT,  text);
  sendToBot(TELEGRAM_TOKEN2, TELEGRAM_CHAT2, text);
}

// ── Get or create a sheet by name ────────────────────────────
function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

// ── Add bold blue header row if sheet is empty ───────────────
function initHeaders(sheet, headers) {
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var r = sheet.getRange(1, 1, 1, headers.length);
    r.setFontWeight('bold')
     .setBackground('#002d52')
     .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
}

// ── Write to service sheet ────────────────────────────────────
function writeServiceSheet(ss, niche, p) {
  var cfg   = SERVICES[niche] || { sheet: niche, emoji: '📋' };
  var sheet = getOrCreateSheet(ss, cfg.sheet);
  var date  = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
  var utm   = parseUtm(p.utm || '', p);

  if (niche === 'RC Decennale') {
    initHeaders(sheet, [
      'Date & Heure', 'Activité', 'CA HT (€)', 'N° SIREN',
      'Civilité', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Consentement',
      'Source', 'Médium', 'Campagne', 'Contenu'
    ]);
    sheet.appendRow([
      date,
      p.activite  || '',
      p.ca        || '',
      p.siren     || '',
      p.civilite  || '',
      p.prenom    || '',
      p.nom       || '',
      p.email     || '',
      p.telephone || '',
      p.consent   || '',
      utm.source, utm.medium, utm.campaign, utm.content
    ]);

  } else if (niche === 'Assurance Auto') {
    initHeaders(sheet, [
      'Date & Heure', 'Nom', 'Téléphone', 'Situation', 'Consentement',
      'Source', 'Médium', 'Campagne', 'Contenu'
    ]);
    sheet.appendRow([
      date,
      p.nom       || '',
      p.telephone || '',
      p.situation || '',
      p.consent   || '',
      utm.source, utm.medium, utm.campaign, utm.content
    ]);

  } else if (niche === 'Mutuelle Sante' || niche === 'Mutuelle Sante 1' ||
             niche === 'Mutuelle Sante 2' || niche === 'Mutuelle Sante 3') {
    initHeaders(sheet, [
      'Date & Heure', 'Nom', 'Téléphone', 'Âge', 'Situation', 'Consentement',
      'Source', 'Médium', 'Campagne', 'Contenu'
    ]);
    sheet.appendRow([
      date,
      p.nom       || '',
      p.telephone || '',
      p.age       || '',
      p.situation || '',
      p.consent   || '',
      utm.source, utm.medium, utm.campaign, utm.content
    ]);

  } else {
    // Energie / Estimation Immobiliere / Rappel / Test Drive
    initHeaders(sheet, [
      'Date & Heure', 'Nom', 'Téléphone', 'Consentement',
      'Source', 'Médium', 'Campagne', 'Contenu'
    ]);
    sheet.appendRow([
      date,
      p.nom       || '',
      p.telephone || '',
      p.consent   || '',
      utm.source, utm.medium, utm.campaign, utm.content
    ]);
  }
}

// ── Write to master "Tous les Leads" sheet ───────────────────
function writeMasterSheet(ss, niche, p) {
  var sheet = getOrCreateSheet(ss, 'Tous les Leads');
  initHeaders(sheet, [
    'Date & Heure', 'Service', 'Nom', 'Prénom', 'Email',
    'Téléphone', 'Consentement', 'Détails',
    'Source', 'Médium', 'Campagne', 'Contenu'
  ]);

  var details = '';
  if (niche === 'Assurance Auto') details = 'Situation: ' + (p.situation || '');
  if (niche === 'RC Decennale')   details = (p.activite || '') + ' | CA: ' + (p.ca || '') + ' | SIREN: ' + (p.siren || '');
  if (niche === 'Mutuelle Sante' || niche === 'Mutuelle Sante 1' ||
      niche === 'Mutuelle Sante 2' || niche === 'Mutuelle Sante 3') {
    details = 'Âge: ' + (p.age || '') + ' | Situation: ' + (p.situation || '');
  }

  var utm = parseUtm(p.utm || '', p);
  sheet.appendRow([
    new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
    niche,
    p.nom       || '',
    p.prenom    || '',
    p.email     || '',
    p.telephone || '',
    p.consent   || '',
    details,
    utm.source, utm.medium, utm.campaign, utm.content
  ]);
}

// ── Build Telegram message ────────────────────────────────────
function buildTelegramMsg(niche, p) {
  var cfg = SERVICES[niche] || { sheet: niche, emoji: '📋' };
  var utm = parseUtm(p.utm || '');
  var msg = cfg.emoji + ' <b>Nouveau lead — ' + cfg.sheet + '</b>\n\n';

  if (niche === 'RC Decennale') {
    msg += '<b>Activité :</b> ' + (p.activite || '') + '\n';
    msg += '<b>CA HT :</b> '    + (p.ca || '') + ' €\n';
    msg += '<b>SIREN :</b> '    + (p.siren || '') + '\n';
    msg += '<b>Civilité :</b> ' + (p.civilite || '') + ' ' + (p.prenom || '') + ' ' + (p.nom || '') + '\n';
    msg += '<b>Email :</b> '    + (p.email || '') + '\n';
    msg += '<b>Tel :</b> '      + (p.telephone || '') + '\n';
  } else if (niche === 'Assurance Auto') {
    msg += '<b>Nom :</b> '       + (p.nom || '') + '\n';
    msg += '<b>Tel :</b> '       + (p.telephone || '') + '\n';
    msg += '<b>Situation :</b> ' + (p.situation || '') + '\n';
  } else if (niche === 'Mutuelle Sante' || niche === 'Mutuelle Sante 1' ||
             niche === 'Mutuelle Sante 2' || niche === 'Mutuelle Sante 3') {
    msg += '<b>Nom :</b> '       + (p.nom || '') + '\n';
    msg += '<b>Tel :</b> '       + (p.telephone || '') + '\n';
    msg += '<b>Âge :</b> '       + (p.age || '—') + '\n';
    msg += '<b>Situation :</b> ' + (p.situation || '—') + '\n';
  } else {
    msg += '<b>Nom :</b> ' + (p.nom || '') + '\n';
    msg += '<b>Tel :</b> ' + (p.telephone || '') + '\n';
  }

  msg += '\n';
  msg += '📊 <b>Source :</b> '   + (utm.source   || 'direct') + '\n';
  if (utm.medium)   msg += '📡 <b>Médium :</b> '   + utm.medium   + '\n';
  if (utm.campaign) msg += '🎯 <b>Campagne :</b> ' + utm.campaign + '\n';
  if (utm.content)  msg += '🖼 <b>Contenu :</b> '  + utm.content  + '\n';
  return msg;
}

// ── updateHeaders — run this to fix existing sheets that are missing
//    the Consentement column. Safe to run multiple times.
function updateHeaders() {
  var ss = SpreadsheetApp.openById(SHEET_ID);

  function setHeader(name, headers) {
    var sheet = ss.getSheetByName(name);
    if (!sheet) return;
    var r = sheet.getRange(1, 1, 1, headers.length);
    r.setValues([headers]);
    r.setFontWeight('bold')
     .setBackground('#002d52')
     .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }

  var utmCols = ['Source', 'Médium', 'Campagne', 'Contenu'];
  setHeader('Assurance Auto',   ['Date & Heure', 'Nom', 'Téléphone', 'Situation',  'Consentement'].concat(utmCols));
  setHeader('Energie',          ['Date & Heure', 'Nom', 'Téléphone', 'Consentement'].concat(utmCols));
  setHeader('Estimation Immo',  ['Date & Heure', 'Nom', 'Téléphone', 'Consentement'].concat(utmCols));
  setHeader('Rappel',           ['Date & Heure', 'Nom', 'Téléphone', 'Consentement'].concat(utmCols));
  setHeader('Test Drive',       ['Date & Heure', 'Nom', 'Téléphone', 'Consentement'].concat(utmCols));
  var mutCols = ['Date & Heure', 'Nom', 'Téléphone', 'Âge', 'Situation', 'Consentement'].concat(utmCols);
  setHeader('Mutuelle Santé',   mutCols);
  setHeader('Mutuelle Santé 1', mutCols);
  setHeader('Mutuelle Santé 2', mutCols);
  setHeader('Mutuelle Santé 3', mutCols);
  setHeader('RC Décennale',     ['Date & Heure', 'Activité', 'CA HT (€)', 'N° SIREN', 'Civilité', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Consentement'].concat(utmCols));
  setHeader('Tous les Leads',   ['Date & Heure', 'Service', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Consentement', 'Détails'].concat(utmCols));

  Logger.log('✅ En-têtes mis à jour sur tous les onglets.');
}

// ── createAllSheets — run this ONCE after pasting the script ─
// It creates every tab with the right headers so they exist before
// the first lead arrives. Safe to run multiple times (won't duplicate).
function createAllSheets() {
  var ss = SpreadsheetApp.openById(SHEET_ID);

  var utmCols = ['Source', 'Médium', 'Campagne', 'Contenu'];

  // 1. Assurance Auto
  var s1 = getOrCreateSheet(ss, 'Assurance Auto');
  initHeaders(s1, ['Date & Heure', 'Nom', 'Téléphone', 'Situation', 'Consentement'].concat(utmCols));

  // 2. Energie
  var s2 = getOrCreateSheet(ss, 'Energie');
  initHeaders(s2, ['Date & Heure', 'Nom', 'Téléphone', 'Consentement'].concat(utmCols));

  // 3. Estimation Immo
  var s3 = getOrCreateSheet(ss, 'Estimation Immo');
  initHeaders(s3, ['Date & Heure', 'Nom', 'Téléphone', 'Consentement'].concat(utmCols));

  // 4. Rappel
  var s4 = getOrCreateSheet(ss, 'Rappel');
  initHeaders(s4, ['Date & Heure', 'Nom', 'Téléphone', 'Consentement'].concat(utmCols));

  // 5. Test Drive
  var s5 = getOrCreateSheet(ss, 'Test Drive');
  initHeaders(s5, ['Date & Heure', 'Nom', 'Téléphone', 'Consentement'].concat(utmCols));

  // 6. RC Décennale
  var s6 = getOrCreateSheet(ss, 'RC Décennale');
  initHeaders(s6, ['Date & Heure', 'Activité', 'CA HT (€)', 'N° SIREN',
    'Civilité', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Consentement'].concat(utmCols));

  // 7. Mutuelle Santé (original + 3 variants) — includes Âge + Situation
  var mutCols = ['Date & Heure', 'Nom', 'Téléphone', 'Âge', 'Situation', 'Consentement'].concat(utmCols);
  var s8 = getOrCreateSheet(ss, 'Mutuelle Santé');
  initHeaders(s8, mutCols);
  var s8a = getOrCreateSheet(ss, 'Mutuelle Santé 1');
  initHeaders(s8a, mutCols);
  var s8b = getOrCreateSheet(ss, 'Mutuelle Santé 2');
  initHeaders(s8b, mutCols);
  var s8c = getOrCreateSheet(ss, 'Mutuelle Santé 3');
  initHeaders(s8c, mutCols);

  // 8. Tous les Leads (master)
  var s7 = getOrCreateSheet(ss, 'Tous les Leads');
  initHeaders(s7, ['Date & Heure', 'Service', 'Nom', 'Prénom', 'Email',
    'Téléphone', 'Consentement', 'Détails'].concat(utmCols));

  Logger.log('✅ Tous les onglets créés avec succès.');
}

// ── Main ──────────────────────────────────────────────────────
function doGet(e) {
  try {
    var p     = e.parameter;
    var niche = p.niche || 'Autre';
    var ss    = SpreadsheetApp.openById(SHEET_ID);

    writeServiceSheet(ss, niche, p);
    writeMasterSheet(ss, niche, p);
    sendTelegram(buildTelegramMsg(niche, p));

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', service: niche }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
