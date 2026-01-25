/**
 * Import-Script für Fahrzeug KO-KP-22
 */

import { importSharePointData } from './import-sharepoint';

// SharePoint-Daten für KO-KP-22
const sharePointDaten: Record<string, string | number> = {
  'KO-KP-22': 'KO-KP-22',
  'Titel': 'KO-KP-22',
  'Autohaus': 'Autohaus Scherhag Koblenz',
  'Hersteller': 'VW',
  'Modell': 'Golf Variant',
  'Motorisierung': 'Diesel',
  'Einsatzort': 'Koblenz',
  'Nutzer': 'Schenkelberg, Dominik',
  'Kauf/Leasing': 'Kauf',
  'Datum Anschaffung': '7/6/2016',
  'Vereinb. KM': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kilometerstand': 200202,
  'Meldung KM STand': '1/5/2026',
  'Laufzeit': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Laufzeitende': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bekannte Probleme': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bild': 'f9a4cb12-b131-444c-b7a5-f5c9840ff629',
  'Erinnerung Neuanschaffung': '6/10/2025',
  'Anzahl Werkstatttermine': 1,
  'Erinnerung TÜV': '9/10/2027',
  'Dokumente': 'https://kimmelzahntechnik.sharepoint.com/sites/Fuhrpark-KFZChecklisten/Shared%20Documents/KFZ%20Checklisten/Fuhrparkverwaltung/KO-KP-22',
  'Letzter Werkstatttermin': '10/28/2025',
  'KM-Stand bei Kauf': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kostenträger': '19035',
  'Status': 'OK',
  'Status-Datum': '1/6/2026',
  'Waschkarte': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Inkl. Wartung': 'Nein',
  'Profil Winter': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Profil Sommer': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'KM bis Insp.': '' // "—" - leer lassen
};

try {
  console.log('🚗 Importiere Fahrzeug KO-KP-22...\n');
  const id = importSharePointData(sharePointDaten);
  console.log(`\n✅ Import erfolgreich! Fahrzeug-ID: ${id}`);
} catch (error) {
  console.error('❌ Fehler beim Import:', error);
  process.exit(1);
}
