/**
 * Script zum Löschen des Fahrzeugs FZ-PLUS
 */

import { getDatabase } from '../db/database';

const db = getDatabase();

// Suche nach dem Fahrzeug mit Kennzeichen FZ-PLUS
const fahrzeug = db.prepare('SELECT id, kennzeichen, hersteller, modell FROM fahrzeuge WHERE kennzeichen = ?').get('FZ-PLUS') as { id: number; kennzeichen: string; hersteller: string; modell: string } | undefined;

if (!fahrzeug) {
  console.log('❌ Fahrzeug FZ-PLUS nicht gefunden');
  process.exit(1);
}

console.log(`🔍 Gefundenes Fahrzeug:`);
console.log(`   ID: ${fahrzeug.id}`);
console.log(`   Kennzeichen: ${fahrzeug.kennzeichen}`);
console.log(`   Hersteller: ${fahrzeug.hersteller}`);
console.log(`   Modell: ${fahrzeug.modell}`);
console.log('');

// Lösche das Fahrzeug (CASCADE löscht automatisch alle zugehörigen Daten)
const result = db.prepare('DELETE FROM fahrzeuge WHERE id = ?').run(fahrzeug.id);

if (result.changes > 0) {
  console.log(`✅ Fahrzeug FZ-PLUS (ID: ${fahrzeug.id}) erfolgreich gelöscht`);
  console.log(`   Alle zugehörigen Daten (Schäden, Wartungen, etc.) wurden ebenfalls gelöscht (CASCADE)`);
} else {
  console.log('❌ Fehler beim Löschen des Fahrzeugs');
  process.exit(1);
}
