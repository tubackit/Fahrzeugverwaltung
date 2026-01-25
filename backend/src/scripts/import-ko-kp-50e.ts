/**
 * Import-Script für Fahrzeug KO-KP-50E
 */

import { importSharePointData } from './import-sharepoint';

// SharePoint-Daten für KO-KP-50E
const sharePointDaten: Record<string, string | number> = {
  'KO-KP-50E': 'KO-KP-50E',
  'Titel': 'KO-KP-50E',
  'Autohaus': 'Autohaus Scherhag Koblenz',
  'Hersteller': 'VW',
  'Modell': 'Golf',
  'Motorisierung': 'Hybrid',
  'Einsatzort': 'Koblenz',
  'Nutzer': 'Bote',
  'Kauf/Leasing': 'Kauf',
  'Datum Anschaffung': '11/26/2020',
  'Vereinb. KM': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kilometerstand': 225000,
  'Meldung KM STand': '11/9/2025',
  'Laufzeit': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Laufzeitende': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bekannte Probleme': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bild': '1',
  'Erinnerung Neuanschaffung': '11/26/2025',
  'Anzahl Werkstatttermine': 2,
  'Erinnerung TÜV': '11/1/2027',
  'Dokumente': 'https://kimmelzahntechnik.sharepoint.com/sites/Fuhrpark-KFZChecklisten/Shared%20Documents/KFZ%20Checklisten/Fuhrparkverwaltung/KO-KP-50E',
  'Letzter Werkstatttermin': '11/10/2025',
  'KM-Stand bei Kauf': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kostenträger': '19012',
  'Status': 'OK',
  'Status-Datum': '11/10/2025',
  'Waschkarte': '10064-1564',
  'Inkl. Wartung': 'Nein',
  'Profil Winter': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Profil Sommer': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'KM bis Insp.': '' // "—" - leer lassen
};

try {
  console.log('🚗 Importiere Fahrzeug KO-KP-50E...\n');
  const id = importSharePointData(sharePointDaten);
  console.log(`\n✅ Import erfolgreich! Fahrzeug-ID: ${id}`);
} catch (error) {
  console.error('❌ Fehler beim Import:', error);
  process.exit(1);
}
