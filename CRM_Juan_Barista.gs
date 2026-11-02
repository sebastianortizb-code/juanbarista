/**
 * CRM de captación - Juan Barista
 * Google Apps Script Web App que registra contactos en una hoja de cálculo.
 *
 * CONFIGURACIÓN:
 * 1) Crea/abre un Google Sheet destinado al CRM.
 * 2) Copia su ID desde la URL y pégalo en SPREADSHEET_ID.
 * 3) Ejecuta setupCRM() manualmente y autoriza los permisos.
 * 4) Implementa como Web App: Ejecutar como "Yo"; acceso "Cualquiera".
 * 5) Copia la URL /exec del despliegue en CRM_WEB_APP_URL del HTML.
 */

const SPREADSHEET_ID = 'PEGA_AQUI_EL_ID_DE_TU_GOOGLE_SHEET';
const SHEET_NAME = 'LEADS';

const HEADERS = [
  'ID_Lead',
  'Fecha_Registro',
  'Nombre',
  'Apellido',
  'Correo',
  'Interes',
  'Mensaje',
  'Origen',
  'Pagina',
  'Estado',
  'Consentimiento'
];

function setupCRM() {
  if (!SPREADSHEET_ID || SPREADSHEET_ID.indexOf('PEGA_AQUI') !== -1) {
    throw new Error('Configura SPREADSHEET_ID antes de ejecutar setupCRM().');
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.autoResizeColumns(1, HEADERS.length);
  }
  return 'CRM listo: pestaña ' + SHEET_NAME;
}

function doPost(e) {
  try {
    const data = (e && e.parameter) ? e.parameter : {};

    // Honeypot: si fue llenado, descartar silenciosamente el registro.
    if (String(data.website || '').trim()) {
      return jsonResponse({ ok: true, message: 'Registro recibido.' });
    }

    const nombre = clean_(data.nombre, 100);
    const apellido = clean_(data.apellido, 100);
    const email = clean_(data.email, 200).toLowerCase();
    const interes = clean_(data.interes, 200);
    const mensaje = clean_(data.mensaje, 5000);
    const origen = clean_(data.origen || 'Landing page Juan Barista', 200);
    const pagina = clean_(data.pagina, 1000);

    if (!nombre || !email || !mensaje) {
      return jsonResponse({ ok: false, message: 'Faltan campos obligatorios.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ ok: false, message: 'Correo inválido.' });
    }
    if (!SPREADSHEET_ID || SPREADSHEET_ID.indexOf('PEGA_AQUI') !== -1) {
      throw new Error('Falta configurar SPREADSHEET_ID.');
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      let sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME);
        sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
        sheet.setFrozenRows(1);
      }

      const leadId = 'JB-' + Utilities.getUuid().split('-')[0].toUpperCase();
      const now = new Date();
      sheet.appendRow([
        leadId,
        now,
        nombre,
        apellido,
        email,
        interes,
        mensaje,
        origen,
        pagina,
        'Nuevo',
        'Sí'
      ]);

      return jsonResponse({ ok: true, id: leadId, message: 'Lead registrado.' });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    console.error(err);
    return jsonResponse({ ok: false, message: 'No fue posible registrar el contacto.' });
  }
}

function clean_(value, maxLength) {
  let text = String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim();
  if (text.length > maxLength) text = text.substring(0, maxLength);
  // Evitar que texto ingresado sea interpretado como fórmula en Sheets.
  if (/^[=+\-@]/.test(text)) text = "'" + text;
  return text;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Función auxiliar para comprobar permisos y acceso al Sheet. */
function testCRM() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No existe la pestaña LEADS. Ejecuta setupCRM().');
  Logger.log('Conectado: ' + ss.getName() + ' | filas: ' + sheet.getLastRow());
}
