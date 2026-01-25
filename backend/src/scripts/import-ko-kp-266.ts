/**
 * Import-Script für Fahrzeug KO-KP-266
 */

import { importSharePointData } from './import-sharepoint';

// SharePoint-Daten für KO-KP-266
const sharePointDaten: Record<string, string | number> = {
  'KO-KP-266': 'KO-KP-266',
  'Titel': 'KO-KP-266',
  'Autohaus': 'Autohaus Kämpflein',
  'Hersteller': 'VW',
  'Modell': 'Golf',
  'Motorisierung': 'Diesel',
  'Einsatzort': 'Bad Marienberg',
  'Nutzer': 'Bote',
  'Kauf/Leasing': 'Kauf',
  'Datum Anschaffung': '2/10/2021',
  'Vereinb. KM': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kilometerstand': 112969,
  'Meldung KM STand': '1/5/2026',
  'Laufzeit': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Laufzeitende': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bekannte Probleme': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bild': '1de12e20-145c-49ce-8a0f-b5721eb535a4',
  'Erinnerung Neuanschaffung': '2/10/2026',
  'Anzahl Werkstatttermine': 4,
  'Erinnerung TÜV': '12/10/2023',
  'Dokumente': 'https://kimmelzahntechnik.sharepoint.com/sites/Fuhrpark-KFZChecklisten/Shared%20Documents/KFZ%20Checklisten/Fuhrparkverwaltung/KO-KP-266',
  'Letzter Werkstatttermin': '5/23/2025',
  'KM-Stand bei Kauf': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kostenträger': '19029',
  'Status': 'Inspektionsmeldung',
  'Status-Datum': '1/23/2026',
  'Waschkarte': '10091-5779',
  'Inkl. Wartung': 'Nein',
  'Profil Winter': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Profil Sommer': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'KM bis Insp.': '' // "—" - leer lassen
};

try {
  console.log('🚗 Importiere Fahrzeug KO-KP-266...\n');
  const id = importSharePointData(sharePointDaten);
  console.log(`\n✅ Import erfolgreich! Fahrzeug-ID: ${id}`);
} catch (error) {
  console.error('❌ Fehler beim Import:', error);
  process.exit(1);
}
