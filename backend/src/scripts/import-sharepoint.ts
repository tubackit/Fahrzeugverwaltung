/**
 * Import-Script für SharePoint-Daten
 * 
 * Konvertiert SharePoint-Fahrzeugdaten in das AutoLogic-Format
 * und importiert sie in die Datenbank.
 */

import { getDatabase } from '../db/database';
import { migrateDatabase } from '../db/migrate';

// Lokale Fahrzeug-Typ-Definition (vereinfacht)
interface Fahrzeug {
  id?: number;
  kennzeichen: string;
  hersteller: string;
  modell: string;
  [key: string]: unknown;
}

/**
 * Konvertiert ein Datum von verschiedenen Formaten in ISO-Format (YYYY-MM-DD)
 */
function parseDate(dateStr: string | undefined): string | undefined {
  if (!dateStr || dateStr.trim() === '') return undefined;
  
  // Format: "2/3/2022" oder "7/15/2025"
  const usDateMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (usDateMatch) {
    const [, month, day, year] = usDateMatch;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  
  // Format: "2. Februar" (nur Monat/Tag, Jahr fehlt)
  const deDateMatch = dateStr.match(/^(\d{1,2})\.\s+(\w+)$/);
  if (deDateMatch) {
    // Für Laufzeitende ohne Jahr: aktuelles Jahr verwenden
    const [, day, monthName] = deDateMatch;
    const monthMap: Record<string, string> = {
      'Januar': '01', 'Februar': '02', 'März': '03', 'April': '04',
      'Mai': '05', 'Juni': '06', 'Juli': '07', 'August': '08',
      'September': '09', 'Oktober': '10', 'November': '11', 'Dezember': '12'
    };
    const month = monthMap[monthName];
    if (month) {
      const currentYear = new Date().getFullYear();
      return `${currentYear}-${month}-${day.padStart(2, '0')}`;
    }
  }
  
  // Bereits ISO-Format
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return dateStr;
  }
  
  return undefined;
}

/**
 * Parst Reifen-Profiltiefe aus Text
 * Format: "Profiltiefe: 5.0 5.0 5.5 5.5 / /"
 * oder "VL: 4.0mm / VR:4.0 mmHL: 5.5mm/ HR: 5.5 mm"
 */
function parseReifenProfiltiefe(text: string | undefined, isWinter: boolean): {
  vl?: number;
  vr?: number;
  hl?: number;
  hr?: number;
} {
  if (!text || text.trim() === '') return {};
  
  const result: { vl?: number; vr?: number; hl?: number; hr?: number } = {};
  
  // Format: "Profiltiefe: 5.0 5.0 5.5 5.5 / /"
  const simpleMatch = text.match(/Profiltiefe:\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (simpleMatch) {
    result.vl = parseFloat(simpleMatch[1]);
    result.vr = parseFloat(simpleMatch[2]);
    result.hl = parseFloat(simpleMatch[3]);
    result.hr = parseFloat(simpleMatch[4]);
    return result;
  }
  
  // Format: "VL: 4.0mm / VR:4.0 mmHL: 5.5mm/ HR: 5.5 mm"
  const vlMatch = text.match(/VL:\s*([\d.]+)/i);
  const vrMatch = text.match(/VR:\s*([\d.]+)/i);
  const hlMatch = text.match(/HL:\s*([\d.]+)/i);
  const hrMatch = text.match(/HR:\s*([\d.]+)/i);
  
  if (vlMatch) result.vl = parseFloat(vlMatch[1]);
  if (vrMatch) result.vr = parseFloat(vrMatch[1]);
  if (hlMatch) result.hl = parseFloat(hlMatch[1]);
  if (hrMatch) result.hr = parseFloat(hrMatch[1]);
  
  return result;
}

/**
 * Konvertiert SharePoint-Daten in AutoLogic-Format
 */
function convertSharePointData(sharePointData: Record<string, string | number>): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  
  // Basis-Felder
  if (sharePointData['KO-KP-255'] || sharePointData['Titel']) {
    data.kennzeichen = String(sharePointData['KO-KP-255'] || sharePointData['Titel'] || '').trim();
  }
  
  if (sharePointData['Hersteller']) {
    data.hersteller = String(sharePointData['Hersteller']).trim();
  }
  
  if (sharePointData['Modell']) {
    data.modell = String(sharePointData['Modell']).trim();
  }
  
  if (sharePointData['Motorisierung']) {
    data.kraftstoffart = String(sharePointData['Motorisierung']).trim();
  }
  
  if (sharePointData['Einsatzort']) {
    data.einsatzort = String(sharePointData['Einsatzort']).trim();
  }
  
  if (sharePointData['Nutzer']) {
    data.nutzer = String(sharePointData['Nutzer']).trim();
  }
  
  if (sharePointData['Autohaus']) {
    data.autohaus = String(sharePointData['Autohaus']).trim();
  }
  
  if (sharePointData['Kostenträger']) {
    data.kostentraeger = String(sharePointData['Kostenträger']).trim();
  }
  
  if (sharePointData['Kauf/Leasing']) {
    data.kaufOderLeasing = String(sharePointData['Kauf/Leasing']).trim();
  }
  
  // Datum-Felder
  if (sharePointData['Datum Anschaffung']) {
    data.datumAnschaffung = parseDate(String(sharePointData['Datum Anschaffung']));
  }
  
  if (sharePointData['Laufzeitende']) {
    data.leasingEnde = parseDate(String(sharePointData['Laufzeitende']));
  }
  
  if (sharePointData['Erinnerung TÜV']) {
    data.huTermin = parseDate(String(sharePointData['Erinnerung TÜV']));
  }
  
  if (sharePointData['Erinnerung Neuanschaffung']) {
    data.erinnerungNeuanschaffung = parseDate(String(sharePointData['Erinnerung Neuanschaffung']));
  }
  
  if (sharePointData['Letzter Werkstatttermin']) {
    data.letzterWerkstatttermin = parseDate(String(sharePointData['Letzter Werkstatttermin']));
  }
  
  if (sharePointData['Meldung KM STand']) {
    data.meldungKmStandDatum = parseDate(String(sharePointData['Meldung KM STand']));
  }
  
  if (sharePointData['Status-Datum']) {
    data.statusDatum = parseDate(String(sharePointData['Status-Datum']));
  }
  
  // Numerische Felder
  if (sharePointData['Vereinb. KM']) {
    data.vereinbarteKm = Number(sharePointData['Vereinb. KM']) || undefined;
  }
  
  if (sharePointData['Kilometerstand']) {
    data.aktuellerKmStand = Number(sharePointData['Kilometerstand']) || undefined;
  }
  
  if (sharePointData['Laufzeit']) {
    // Laufzeit ist in Monaten, wird nicht direkt gespeichert
  }
  
  if (sharePointData['Anzahl Werkstatttermine']) {
    data.anzahlWerkstatttermine = Number(sharePointData['Anzahl Werkstatttermine']) || undefined;
  }
  
  if (sharePointData['KM-Stand bei Kauf']) {
    data.kmStandBeiKauf = Number(sharePointData['KM-Stand bei Kauf']) || undefined;
  }
  
  if (sharePointData['KM bis Insp.']) {
    data.kmBisInsp = Number(sharePointData['KM bis Insp.']) || undefined;
  }
  
  // Text-Felder
  if (sharePointData['Bekannte Probleme']) {
    data.bemerkungen = String(sharePointData['Bekannte Probleme']).trim();
  }
  
  if (sharePointData['Bild']) {
    data.bildUrl = String(sharePointData['Bild']).trim();
  }
  
  if (sharePointData['Dokumente']) {
    data.dokumenteUrl = String(sharePointData['Dokumente']).trim();
  }
  
  if (sharePointData['Inkl. Wartung']) {
    data.inklWartung = String(sharePointData['Inkl. Wartung']).trim();
  }
  
  if (sharePointData['Status']) {
    data.status = String(sharePointData['Status']).trim();
  }
  
  if (sharePointData['Waschkarte']) {
    data.waschkarte = String(sharePointData['Waschkarte']).trim();
  }
  
  // Reifen-Daten
  if (sharePointData['Profil Winter']) {
    const winter = parseReifenProfiltiefe(String(sharePointData['Profil Winter']), true);
    if (winter.vl !== undefined) data.reifenProfiltiefeVLWinter = winter.vl;
    if (winter.vr !== undefined) data.reifenProfiltiefeVRWinter = winter.vr;
    if (winter.hl !== undefined) data.reifenProfiltiefeHLWinter = winter.hl;
    if (winter.hr !== undefined) data.reifenProfiltiefeHRWinter = winter.hr;
  }
  
  if (sharePointData['Profil Sommer']) {
    const sommer = parseReifenProfiltiefe(String(sharePointData['Profil Sommer']), false);
    if (sommer.vl !== undefined) data.reifenProfiltiefeVLSommer = sommer.vl;
    if (sommer.vr !== undefined) data.reifenProfiltiefeVRSommer = sommer.vr;
    if (sommer.hl !== undefined) data.reifenProfiltiefeHLSommer = sommer.hl;
    if (sommer.hr !== undefined) data.reifenProfiltiefeHRSommer = sommer.hr;
  }
  
  return data;
}

/**
 * Importiert ein Fahrzeug in die Datenbank
 */
function importFahrzeug(data: Record<string, unknown>): number {
  const db = getDatabase();
  
  // Prüfe ob Fahrzeug bereits existiert
  if (data.kennzeichen) {
    const existing = db.prepare('SELECT id FROM fahrzeuge WHERE kennzeichen = ?').get(data.kennzeichen) as { id: number } | undefined;
    if (existing) {
      console.log(`⚠️  Fahrzeug ${data.kennzeichen} existiert bereits (ID: ${existing.id}). Überspringe...`);
      return existing.id;
    }
  }
  
  // Erstelle INSERT-Statement
  const cleanedData: Record<string, unknown> = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== '' && value !== null && value !== undefined) {
      cleanedData[key] = value;
    }
  });
  
  if (Object.keys(cleanedData).length === 0) {
    throw new Error('Keine Daten zum Importieren');
  }
  
  const columns = Object.keys(cleanedData).join(', ');
  const placeholders = Object.keys(cleanedData).map(() => '?').join(', ');
  const values = Object.values(cleanedData);
  
  const result = db.prepare(`
    INSERT INTO fahrzeuge (${columns}, createdAt, updatedAt)
    VALUES (${placeholders}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).run(...values);
  
  return Number(result.lastInsertRowid);
}

/**
 * Hauptfunktion zum Importieren der SharePoint-Daten
 */
export function importSharePointData(sharePointData: Record<string, string | number>): number {
  // Migration durchführen, um sicherzustellen, dass alle Spalten existieren
  const db = getDatabase();
  migrateDatabase(db);
  
  // Konvertiere Daten
  const fahrzeugData = convertSharePointData(sharePointData);
  
  // Validiere Pflichtfelder
  if (!fahrzeugData.kennzeichen || !fahrzeugData.hersteller || !fahrzeugData.modell) {
    throw new Error('Pflichtfelder fehlen: Kennzeichen, Hersteller und Modell sind erforderlich');
  }
  
  // Importiere Fahrzeug
  const id = importFahrzeug(fahrzeugData);
  console.log(`✅ Fahrzeug ${fahrzeugData.kennzeichen} erfolgreich importiert (ID: ${id})`);
  
  return id;
}

// Direkter Aufruf, wenn das Script direkt ausgeführt wird
if (require.main === module) {
  // Beispiel-Daten aus der SharePoint-Liste
  const beispielDaten: Record<string, string | number> = {
    'KO-KP-255': 'KO-KP-255',
    'Titel': 'KO-KP-255',
    'Autohaus': 'Autohaus Scherhag Koblenz',
    'Hersteller': 'SEAT',
    'Modell': 'Tarraco FR',
    'Motorisierung': 'Benzin',
    'Einsatzort': 'Koblenz',
    'Nutzer': 'Holzbach, Timo',
    'Kauf/Leasing': 'Leasing',
    'Datum Anschaffung': '2/3/2022',
    'Vereinb. KM': 17500,
    'Kilometerstand': 43454,
    'Meldung KM STand': '7/15/2025',
    'Laufzeit': 48,
    'Laufzeitende': '2. Februar',
    'Bekannte Probleme': 'Geben Sie hier einen Wert ein',
    'Bild': '20220221_122714',
    'Erinnerung Neuanschaffung': '11/19/2024',
    'Anzahl Werkstatttermine': 5,
    'Erinnerung TÜV': '1/15/2027',
    'Dokumente': 'https://kimmelzahntechnik.sharepoint.com/:f:/s/Fuhrpark-KFZChecklisten/Ekog9fnxACBBs1HbsnU0EcABciZOOjZH3IdpMerYaEppNA?e=v3OpsZ',
    'Letzter Werkstatttermin': '6/22/2024',
    'KM-Stand bei Kauf': 0,
    'Kostenträger': '19036',
    'Status': 'OK',
    'Status-Datum': '6/16/2025',
    'Waschkarte': '10064-1579',
    'Inkl. Wartung': 'Nein',
    'Profil Winter': 'Profiltiefe: 5.0 5.0 5.5 5.5 / /',
    'Profil Sommer': 'VL: 4.0mm / VR:4.0 mmHL: 5.5mm/ HR: 5.5 mm',
    'KM bis Insp.': 0
  };
  
  try {
    const id = importSharePointData(beispielDaten);
    console.log(`\n✅ Import erfolgreich! Fahrzeug-ID: ${id}`);
  } catch (error) {
    console.error('❌ Fehler beim Import:', error);
    process.exit(1);
  }
}
