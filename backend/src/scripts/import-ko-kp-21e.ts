/**
 * Import-Script für Fahrzeug KO-KP-21E
 */

import { importSharePointData } from './import-sharepoint';

// SharePoint-Daten für KO-KP-21E
const sharePointDaten: Record<string, string | number> = {
  'KO-KP-21E': 'KO-KP-21E',
  'Titel': 'KO-KP-21E',
  'Autohaus': 'Autohaus Wahl',
  'Hersteller': 'Renault',
  'Modell': 'ZOE',
  'Motorisierung': 'Elektro',
  'Einsatzort': 'Koblenz',
  'Nutzer': 'Bote',
  'Kauf/Leasing': 'Kauf',
  'Datum Anschaffung': '6/11/2021',
  'Vereinb. KM': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kilometerstand': 133974,
  'Meldung KM STand': '10/13/2025',
  'Laufzeit': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Laufzeitende': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bekannte Probleme': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bild': '2089a216-df5e-4374-be99-689458a53540',
  'Erinnerung Neuanschaffung': '6/11/2026',
  'Anzahl Werkstatttermine': 0,
  'Erinnerung TÜV': '8/23/2026',
  'Dokumente': 'https://kimmelzahntechnik.sharepoint.com/:f:/s/Fuhrpark-KFZChecklisten/EtYfxgh4s_ZOg32q9JU6UnUBCOBnab6gISEvGsBg8L_d8w?e=h4oNIp',
  'Letzter Werkstatttermin': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'KM-Stand bei Kauf': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kostenträger': '19010',
  'Status': 'OK',
  'Status-Datum': '4/4/2025',
  'Waschkarte': '10091-5773',
  'Inkl. Wartung': 'Nein',
  'Profil Winter': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Profil Sommer': 'VL: 1.5mm / VR:1.5 mmHL: 4.5mm/ HR: 4.5 mm',
  'KM bis Insp.': '' // "—" - leer lassen
};

try {
  console.log('🚗 Importiere Fahrzeug KO-KP-21E...\n');
  const id = importSharePointData(sharePointDaten);
  console.log(`\n✅ Import erfolgreich! Fahrzeug-ID: ${id}`);
} catch (error) {
  console.error('❌ Fehler beim Import:', error);
  process.exit(1);
}
