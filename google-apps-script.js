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
var TELEGRAM_TOKEN = '8919685030:AAHPqBxp9vq1w1A5ztQiVtuxgIfmQt_4Wb4';
var TELEGRAM_CHAT  = '1882834400';

// ── Service → sheet name + emoji ─────────────────────────────
var SERVICES = {
  'Assurance Auto':         { sheet: 'Assurance Auto',     emoji: '🚗' },
  'Energie':                { sheet: 'Energie',            emoji: '⚡' },
  'Estimation Immobiliere': { sheet: 'Estimation Immo',    emoji: '🏠' },
  'Rappel':                 { sheet: 'Rappel',             emoji: '📞' },
  'Test Drive':             { sheet: 'Test Drive',         emoji: '🏎️' },
  'RC Decennale':           { sheet: 'RC Décennale',       emoji: '🏗️' }
};

// ── Telegram ─────────────────────────────────────────────────
function sendTelegram(text) {
  try {
    UrlFetchApp.fetch(
      'https://api.telegram.org/bot' + TELEGRAM_TOKEN + '/sendMessage',
      {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({ chat_id: TELEGRAM_CHAT, text: text, parse_mode: 'HTML' }),
        muteHttpExceptions: true
      }
    );
  } catch(e) {}
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

  if (niche === 'RC Decennale') {
    initHeaders(sheet, [
      'Date & Heure', 'Activité', 'CA HT (€)', 'N° SIREN',
      'Civilité', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Source UTM'
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
      p.utm       || ''
    ]);

  } else if (niche === 'Assurance Auto') {
    initHeaders(sheet, ['Date & Heure', 'Nom', 'Téléphone', 'Situation', 'Source UTM']);
    sheet.appendRow([
      date,
      p.nom       || '',
      p.telephone || '',
      p.situation || '',
      p.utm       || ''
    ]);

  } else {
    // Energie / Estimation Immobiliere / Rappel / Test Drive
    initHeaders(sheet, ['Date & Heure', 'Nom', 'Téléphone', 'Source UTM']);
    sheet.appendRow([
      date,
      p.nom       || '',
      p.telephone || '',
      p.utm       || ''
    ]);
  }
}

// ── Write to master "Tous les Leads" sheet ───────────────────
function writeMasterSheet(ss, niche, p) {
  var sheet = getOrCreateSheet(ss, 'Tous les Leads');
  initHeaders(sheet, [
    'Date & Heure', 'Service', 'Nom', 'Prénom', 'Email',
    'Téléphone', 'Détails', 'Source UTM'
  ]);

  var details = '';
  if (niche === 'Assurance Auto') details = 'Situation: ' + (p.situation || '');
  if (niche === 'RC Decennale')   details = (p.activite || '') + ' | CA: ' + (p.ca || '') + ' | SIREN: ' + (p.siren || '');

  sheet.appendRow([
    new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
    niche,
    p.nom       || '',
    p.prenom    || '',
    p.email     || '',
    p.telephone || '',
    details,
    p.utm       || ''
  ]);
}

// ── Build Telegram message ────────────────────────────────────
function buildTelegramMsg(niche, p) {
  var cfg = SERVICES[niche] || { sheet: niche, emoji: '📋' };
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
  } else {
    msg += '<b>Nom :</b> ' + (p.nom || '') + '\n';
    msg += '<b>Tel :</b> ' + (p.telephone || '') + '\n';
  }

  msg += '<b>UTM :</b> ' + (p.utm || 'direct');
  return msg;
}

// ── createAllSheets — run this ONCE after pasting the script ─
// It creates every tab with the right headers so they exist before
// the first lead arrives. Safe to run multiple times (won't duplicate).
function createAllSheets() {
  var ss = SpreadsheetApp.openById(SHEET_ID);

  // 1. Assurance Auto
  var s1 = getOrCreateSheet(ss, 'Assurance Auto');
  initHeaders(s1, ['Date & Heure', 'Nom', 'Téléphone', 'Situation', 'Source UTM']);

  // 2. Energie
  var s2 = getOrCreateSheet(ss, 'Energie');
  initHeaders(s2, ['Date & Heure', 'Nom', 'Téléphone', 'Source UTM']);

  // 3. Estimation Immo
  var s3 = getOrCreateSheet(ss, 'Estimation Immo');
  initHeaders(s3, ['Date & Heure', 'Nom', 'Téléphone', 'Source UTM']);

  // 4. Rappel
  var s4 = getOrCreateSheet(ss, 'Rappel');
  initHeaders(s4, ['Date & Heure', 'Nom', 'Téléphone', 'Source UTM']);

  // 5. Test Drive
  var s5 = getOrCreateSheet(ss, 'Test Drive');
  initHeaders(s5, ['Date & Heure', 'Nom', 'Téléphone', 'Source UTM']);

  // 6. RC Décennale
  var s6 = getOrCreateSheet(ss, 'RC Décennale');
  initHeaders(s6, [
    'Date & Heure', 'Activité', 'CA HT (€)', 'N° SIREN',
    'Civilité', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Source UTM'
  ]);

  // 7. Tous les Leads (master)
  var s7 = getOrCreateSheet(ss, 'Tous les Leads');
  initHeaders(s7, [
    'Date & Heure', 'Service', 'Nom', 'Prénom', 'Email',
    'Téléphone', 'Détails', 'Source UTM'
  ]);

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
