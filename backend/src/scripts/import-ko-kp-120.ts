/**
 * Import-Script für Fahrzeug KO-KP-120
 */

import { importSharePointData } from './import-sharepoint';

// SharePoint-Daten für KO-KP-120
const sharePointDaten: Record<string, string | number> = {
  'KO-KP-120': 'KO-KP-120',
  'Titel': 'KO-KP-120',
  'Autohaus': 'Reifen + Autoservice W. Johann',
  'Hersteller': 'Hyundai',
  'Modell': 'I30',
  'Motorisierung': 'Benzin',
  'Einsatzort': 'Koblenz',
  'Nutzer': 'Schrenk, Rene',
  'Kauf/Leasing': 'Kauf',
  'Datum Anschaffung': '11/28/2025',
  'Vereinb. KM': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kilometerstand': 151468,
  'Meldung KM STand': '11/10/2025',
  'Laufzeit': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Laufzeitende': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bekannte Probleme': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bild': 'KO KP 240 (2)',
  'Erinnerung Neuanschaffung': '12/2/2025',
  'Anzahl Werkstatttermine': 1,
  'Erinnerung TÜV': '11/4/2027',
  'Dokumente': 'https://kimmelzahntechnik.sharepoint.com/sites/Fuhrpark-KFZChecklisten/Shared%20Documents/KFZ%20Checklisten/Fuhrparkverwaltung/KP-KP-120',
  'Letzter Werkstatttermin': '11/12/2025',
  'KM-Stand bei Kauf': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kostenträger': '19033',
  'Status': 'OK',
  'Status-Datum': '11/4/2025',
  'Waschkarte': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Inkl. Wartung': 'Nein',
  'Profil Winter': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Profil Sommer': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'KM bis Insp.': '' // "—" - leer lassen
};

try {
  console.log('🚗 Importiere Fahrzeug KO-KP-120...\n');
  const id = importSharePointData(sharePointDaten);
  console.log(`\n✅ Import erfolgreich! Fahrzeug-ID: ${id}`);
} catch (error) {
  console.error('❌ Fehler beim Import:', error);
  process.exit(1);
}
