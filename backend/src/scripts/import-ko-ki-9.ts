/**
 * Import-Script für Fahrzeug KO-KI-9
 */

import { importSharePointData } from './import-sharepoint';

// SharePoint-Daten für KO-KI-9
const sharePointDaten: Record<string, string | number> = {
  'KO-KI-9': 'KO-KI-9',
  'Titel': 'KO-KI-9',
  'Autohaus': 'Autohaus Scherhag Koblenz',
  'Hersteller': 'Hyundai',
  'Modell': 'Kona',
  'Motorisierung': 'Benzin',
  'Einsatzort': 'City',
  'Nutzer': 'Dennert, Daniela',
  'Kauf/Leasing': 'Kauf',
  'Datum Anschaffung': '11/29/2022',
  'Vereinb. KM': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kilometerstand': 64000,
  'Meldung KM STand': '10/17/2025',
  'Laufzeit': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Laufzeitende': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bekannte Probleme': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bild': '3820cb7c-a6ab-45be-aacc-d9656ef35510',
  'Erinnerung Neuanschaffung': '11/29/2027',
  'Anzahl Werkstatttermine': 1,
  'Erinnerung TÜV': '9/29/2027',
  'Dokumente': 'https://kimmelzahntechnik.sharepoint.com/sites/Fuhrpark-KFZChecklisten/Shared%20Documents/KFZ%20Checklisten/Fuhrparkverwaltung/KO-KI-9',
  'Letzter Werkstatttermin': '11/4/2024',
  'KM-Stand bei Kauf': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kostenträger': '19041',
  'Status': 'OK',
  'Status-Datum': '10/27/2025',
  'Waschkarte': '10064-1575',
  'Inkl. Wartung': 'Nein',
  'Profil Winter': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Profil Sommer': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'KM bis Insp.': '' // "—" - leer lassen
};

try {
  console.log('🚗 Importiere Fahrzeug KO-KI-9...\n');
  const id = importSharePointData(sharePointDaten);
  console.log(`\n✅ Import erfolgreich! Fahrzeug-ID: ${id}`);
} catch (error) {
  console.error('❌ Fehler beim Import:', error);
  process.exit(1);
}
