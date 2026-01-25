/**
 * Import-Script für Fahrzeug KO-KI-200
 */

import { importSharePointData } from './import-sharepoint';

// SharePoint-Daten für KO-KI-200
const sharePointDaten: Record<string, string | number> = {
  'KO-KI-200': 'KO-KI-200',
  'Titel': 'KO-KI-200',
  'Autohaus': 'Autohaus Wahl',
  'Hersteller': 'Renault',
  'Modell': 'Clio',
  'Motorisierung': 'Benzin',
  'Einsatzort': 'Bad Kreuznach',
  'Nutzer': 'Bote',
  'Kauf/Leasing': 'Kauf',
  'Datum Anschaffung': '11/25/2022',
  'Vereinb. KM': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kilometerstand': 120535,
  'Meldung KM STand': '1/5/2026',
  'Laufzeit': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Laufzeitende': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bekannte Probleme': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bild': 'a7dc5440-7390-4b7c-a136-75da2c5cd2be',
  'Erinnerung Neuanschaffung': '11/25/2027',
  'Anzahl Werkstatttermine': 1,
  'Erinnerung TÜV': '9/25/2027',
  'Dokumente': 'https://kimmelzahntechnik.sharepoint.com/sites/Fuhrpark-KFZChecklisten/Shared%20Documents/KFZ%20Checklisten/Fuhrparkverwaltung/KO-KI-200',
  'Letzter Werkstatttermin': '10/10/2024',
  'KM-Stand bei Kauf': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kostenträger': '19015',
  'Status': 'OK',
  'Status-Datum': '9/25/2025',
  'Waschkarte': '10064-1569',
  'Inkl. Wartung': 'Nein',
  'Profil Winter': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Profil Sommer': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'KM bis Insp.': '' // "—" - leer lassen
};

try {
  console.log('🚗 Importiere Fahrzeug KO-KI-200...\n');
  const id = importSharePointData(sharePointDaten);
  console.log(`\n✅ Import erfolgreich! Fahrzeug-ID: ${id}`);
} catch (error) {
  console.error('❌ Fehler beim Import:', error);
  process.exit(1);
}
