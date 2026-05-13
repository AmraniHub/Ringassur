// ============================================================
//  RINGASSUR — Google Apps Script
//  1. Go to https://script.google.com → New project
//  2. Paste ALL this code, replacing the default content
//  3. Click Deploy → New deployment → Web App
//     - Execute as: Me
//     - Who has access: Anyone
//  4. Click Deploy → copy the Web App URL
//  5. Paste that URL into index.html where it says GOOGLE_SCRIPT_URL
// ============================================================

function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();

    // Write headers on first use
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Date & Heure',
        'Activité',
        'CA HT (€)',
        'N° SIREN',
        'Civilité',
        'Prénom',
        'Nom',
        'Email',
        'Téléphone',
        'Code Postal',
        'Source UTM',
        'User Agent'
      ]);
      sheet.getRange(1, 1, 1, 12).setFontWeight('bold').setBackground('#002d52').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }

    const p = e.parameter;

    sheet.appendRow([
      new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
      p.activite  || '',
      p.ca        || '',
      p.siren     || '',
      p.civilite  || '',
      p.prenom    || '',
      p.nom       || '',
      p.email     || '',
      p.telephone || '',
      p.codePostal || '',
      p.utm       || '',
      p.ua        || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
