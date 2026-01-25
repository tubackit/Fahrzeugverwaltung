/**
 * Import-Script für Fahrzeug KO-KI-10
 */

import { importSharePointData } from './import-sharepoint';

// SharePoint-Daten für KO-KI-10
const sharePointDaten: Record<string, string | number> = {
  'KO-KI-10': 'KO-KI-10',
  'Titel': 'KO-KI-10',
  'Autohaus': 'Autohaus Scherhag Koblenz',
  'Hersteller': 'SEAT',
  'Modell': 'Cupra Leon',
  'Motorisierung': 'Hybrid',
  'Einsatzort': 'Koblenz',
  'Nutzer': 'Münchow, Stefan',
  'Kauf/Leasing': 'Leasing',
  'Datum Anschaffung': '7/20/2023',
  'Vereinb. KM': 80000,
  'Kilometerstand': 57642,
  'Meldung KM STand': '7/15/2025',
  'Laufzeit': 36,
  'Laufzeitende': '16. Juli', // Wird zu aktuellem Jahr konvertiert
  'Bekannte Probleme': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Bild': '3',
  'Erinnerung Neuanschaffung': '1/1/2028',
  'Anzahl Werkstatttermine': 1,
  'Erinnerung TÜV': '5/20/2026',
  'Dokumente': 'https://kimmelzahntechnik.sharepoint.com/sites/Fuhrpark-KFZChecklisten/Shared%20Documents/KFZ%20Checklisten/Fuhrparkverwaltung/KO-KI-10',
  'Letzter Werkstatttermin': '3/24/2025',
  'KM-Stand bei Kauf': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Kostenträger': '19017',
  'Status': 'OK',
  'Status-Datum': '7/15/2025',
  'Waschkarte': '10064-1572',
  'Inkl. Wartung': 'Nein',
  'Profil Winter': '', // "Geben Sie hier einen Wert ein" - leer lassen
  'Profil Sommer': 'VL: 2.0mm / VR:2.0 mmHL: 4.5mm/ HR: 4.5 mm',
  'KM bis Insp.': '' // "—" - leer lassen
};

try {
  console.log('🚗 Importiere Fahrzeug KO-KI-10...\n');
  const id = importSharePointData(sharePointDaten);
  console.log(`\n✅ Import erfolgreich! Fahrzeug-ID: ${id}`);
} catch (error) {
  console.error('❌ Fehler beim Import:', error);
  process.exit(1);
}
