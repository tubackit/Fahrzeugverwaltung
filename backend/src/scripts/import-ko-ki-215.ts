/**
 * Import-Script für Fahrzeug KO-KI-215
 */

import { importSharePointData } from './import-sharepoint';

// SharePoint-Daten für KO-KI-215
const sharePointDaten: Record<string, string | number> = {
  'KO-KI-215': 'KO-KI-215',
  'Titel': 'KO-KI-215',
  'Autohaus': 'Renault Autohaus Wölm oHG, Mayen',
  'Hersteller': 'Suzuki',
  'Modell': 'Swift',
  'Motorisierung': 'Hybrid',
  'Einsatzort': 'Koblenz',
  'Nutzer': 'Würges, Lana',
  'Kauf/Leasing': 'Leasing',
  'Datum Anschaffung': '8/21/2023',
  'Vereinb. KM': 15000,
  'Kilometerstand': 20500,
  'Meldung KM STand': '7/24/2025',
  'Laufzeit': 48,
  'Laufzeitende': '8/20/2027',
  'Bekannte Probleme': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bild': '53978fd9-9948-4139-9a3d-fa6bb8e3c5fa',
  'Erinnerung Neuanschaffung': '8/20/2026',
  'Anzahl Werkstatttermine': 1,
  'Erinnerung TÜV': '6/21/2026',
  'Dokumente': 'https://kimmelzahntechnik.sharepoint.com/sites/Fuhrpark-KFZChecklisten/Shared%20Documents/KFZ%20Checklisten/Fuhrparkverwaltung/KO-KI-215',
  'Letzter Werkstatttermin': '7/4/2024',
  'KM-Stand bei Kauf': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kostenträger': '19019',
  'Status': 'OK',
  'Status-Datum': '8/18/2025',
  'Waschkarte': '10064-1574',
  'Inkl. Wartung': 'Nein',
  'Profil Winter': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Profil Sommer': 'VL: 4.5mm / VR:4.5 mmHL: 5.0mm/ HR: 5.0 mm',
  'KM bis Insp.': '' // "—" - leer lassen
};

try {
  console.log('🚗 Importiere Fahrzeug KO-KI-215...\n');
  const id = importSharePointData(sharePointDaten);
  console.log(`\n✅ Import erfolgreich! Fahrzeug-ID: ${id}`);
} catch (error) {
  console.error('❌ Fehler beim Import:', error);
  process.exit(1);
}
