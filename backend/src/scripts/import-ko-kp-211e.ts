/**
 * Import-Script für Fahrzeug KO-KP-211E
 */

import { importSharePointData } from './import-sharepoint';

// SharePoint-Daten für KO-KP-211E
const sharePointDaten: Record<string, string | number> = {
  'KO-KP-211E': 'KO-KP-211E',
  'Titel': 'KO-KP-211E',
  'Autohaus': 'Autohaus Wahl',
  'Hersteller': 'Renault',
  'Modell': 'ZOE',
  'Motorisierung': 'Elektro',
  'Einsatzort': 'Koblenz',
  'Nutzer': 'Bote',
  'Kauf/Leasing': 'Kauf',
  'Datum Anschaffung': '2/9/2022',
  'Vereinb. KM': 50000,
  'Kilometerstand': 121110,
  'Meldung KM STand': '11/27/2025',
  'Laufzeit': 36,
  'Laufzeitende': '2/9/2025',
  'Bekannte Probleme': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bild': '2089a216-df5e-4374-be99-689458a53540',
  'Erinnerung Neuanschaffung': '8/9/2024',
  'Anzahl Werkstatttermine': 1,
  'Erinnerung TÜV': '2/26/2027',
  'Dokumente': 'https://kimmelzahntechnik.sharepoint.com/:f:/s/Fuhrpark-KFZChecklisten/EtYfxgh4s_ZOg32q9JU6UnUBCOBnab6gISEvGsBg8L_d8w?e=h4oNIp',
  'Letzter Werkstatttermin': '1/27/2025',
  'KM-Stand bei Kauf': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kostenträger': '19011',
  'Status': 'OK',
  'Status-Datum': '4/28/2025',
  'Waschkarte': '10064-1562',
  'Inkl. Wartung': 'Nein',
  'Profil Winter': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Profil Sommer': 'Profiltiefe:', // Leer - nur Label vorhanden
  'KM bis Insp.': '' // "—" - leer lassen
};

try {
  console.log('🚗 Importiere Fahrzeug KO-KP-211E...\n');
  const id = importSharePointData(sharePointDaten);
  console.log(`\n✅ Import erfolgreich! Fahrzeug-ID: ${id}`);
} catch (error) {
  console.error('❌ Fehler beim Import:', error);
  process.exit(1);
}
