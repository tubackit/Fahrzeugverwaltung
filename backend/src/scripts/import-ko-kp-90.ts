/**
 * Import-Script für Fahrzeug KO-KP-90
 */

import { importSharePointData } from './import-sharepoint';

// SharePoint-Daten für KO-KP-90
const sharePointDaten: Record<string, string | number> = {
  'KO-KP-90': 'KO-KP-90',
  'Titel': 'KO-KP-90',
  'Autohaus': 'A.T.U.',
  'Hersteller': 'Hyundai',
  'Modell': 'I10',
  'Motorisierung': 'Benzin',
  'Einsatzort': 'Bad Kreuznach',
  'Nutzer': 'Bote',
  'Kauf/Leasing': 'Kauf',
  'Datum Anschaffung': '7/24/2019',
  'Vereinb. KM': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kilometerstand': 172860,
  'Meldung KM STand': '1/20/2026',
  'Laufzeit': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Laufzeitende': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bekannte Probleme': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bild': '373d771c-2e9b-4219-81dd-61b5dc5b2f66',
  'Erinnerung Neuanschaffung': '1/10/2025',
  'Anzahl Werkstatttermine': 0,
  'Erinnerung TÜV': '5/1/2026',
  'Dokumente': 'https://kimmelzahntechnik.sharepoint.com/sites/Fuhrpark-KFZChecklisten/Shared%20Documents/KFZ%20Checklisten/Fuhrparkverwaltung/KO-KP-90',
  'Letzter Werkstatttermin': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'KM-Stand bei Kauf': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kostenträger': '19026',
  'Status': 'Inspektionstermin',
  'Status-Datum': '1/20/2026',
  'Waschkarte': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Inkl. Wartung': 'Nein',
  'Profil Winter': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Profil Sommer': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'KM bis Insp.': '' // "—" - leer lassen
};

try {
  console.log('🚗 Importiere Fahrzeug KO-KP-90...\n');
  const id = importSharePointData(sharePointDaten);
  console.log(`\n✅ Import erfolgreich! Fahrzeug-ID: ${id}`);
} catch (error) {
  console.error('❌ Fehler beim Import:', error);
  process.exit(1);
}
