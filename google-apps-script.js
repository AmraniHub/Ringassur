// ============================================================
//  RINGASSUR — Google Apps Script (Fixed)
//
//  SETUP STEPS:
//  1. Go to sheets.google.com → create a new sheet → name it "Ringassur Leads"
//  2. Copy the Sheet ID from the URL:
//     https://docs.google.com/spreadsheets/d/  >>>COPY_THIS<<<  /edit
//  3. Paste it below replacing PASTE_YOUR_SHEET_ID_HERE
//  4. Go to script.google.com → open your project → replace ALL code with this
//  5. Deploy → Manage Deployments → edit the existing deployment → New version → Deploy
// ============================================================

var SHEET_ID = '13LO7P7JyZLt5euFeULdrV6f9m67Nsa25ZaAfKC39QgI';

function doGet(e) {
  try {
    var ss    = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getActiveSheet();

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
      var header = sheet.getRange(1, 1, 1, 12);
      header.setFontWeight('bold')
            .setBackground('#002d52')
            .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
      sheet.setName('Leads');
    }

    var p = e.parameter;

    sheet.appendRow([
      new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }),
      p.activite   || '',
      p.ca         || '',
      p.siren      || '',
      p.civilite   || '',
      p.prenom     || '',
      p.nom        || '',
      p.email      || '',
      p.telephone  || '',
      p.codePostal || '',
      p.utm        || '',
      p.ua         || ''
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
