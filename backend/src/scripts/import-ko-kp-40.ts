/**
 * Import-Script für Fahrzeug KO-KP-40
 */

import { importSharePointData } from './import-sharepoint';

// SharePoint-Daten für KO-KP-40
const sharePointDaten: Record<string, string | number> = {
  'KO-KP-40': 'KO-KP-40',
  'Titel': 'KO-KP-40',
  'Autohaus': 'Autohaus Hakvoort',
  'Hersteller': 'VW',
  'Modell': 'Golf',
  'Motorisierung': 'Diesel',
  'Einsatzort': 'Bad Marienberg',
  'Nutzer': 'Bote',
  'Kauf/Leasing': 'Kauf',
  'Datum Anschaffung': '10/12/2021',
  'Vereinb. KM': 50000,
  'Kilometerstand': 229613,
  'Meldung KM STand': '1/5/2026',
  'Laufzeit': 48,
  'Laufzeitende': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bekannte Probleme': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bild': '20241216_111845',
  'Erinnerung Neuanschaffung': '11/1/2024',
  'Anzahl Werkstatttermine': 0,
  'Erinnerung TÜV': '10/1/2027',
  'Dokumente': 'https://kimmelzahntechnik.sharepoint.com/sites/Fuhrpark-KFZChecklisten/Shared%20Documents/KFZ%20Checklisten/Fuhrparkverwaltung/KO-KP-40',
  'Letzter Werkstatttermin': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'KM-Stand bei Kauf': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kostenträger': '19016',
  'Status': 'OK',
  'Status-Datum': '10/1/2025',
  'Waschkarte': '10064-1570',
  'Inkl. Wartung': 'Nein',
  'Profil Winter': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Profil Sommer': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'KM bis Insp.': '' // "—" - leer lassen
};

try {
  console.log('🚗 Importiere Fahrzeug KO-KP-40...\n');
  const id = importSharePointData(sharePointDaten);
  console.log(`\n✅ Import erfolgreich! Fahrzeug-ID: ${id}`);
} catch (error) {
  console.error('❌ Fehler beim Import:', error);
  process.exit(1);
}
