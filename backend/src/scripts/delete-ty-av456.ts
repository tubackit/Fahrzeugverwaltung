/**
 * Script zum Löschen des Fahrzeugs TY-AV456
 */

import { getDatabase } from '../db/database';

const db = getDatabase();

// Suche nach dem Fahrzeug mit Kennzeichen TY-AV456
const fahrzeug = db.prepare('SELECT id, kennzeichen, hersteller, modell FROM fahrzeuge WHERE kennzeichen = ?').get('TY-AV456') as { id: number; kennzeichen: string; hersteller: string; modell: string } | undefined;

if (!fahrzeug) {
  console.log('❌ Fahrzeug TY-AV456 nicht gefunden');
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
  console.log(`✅ Fahrzeug TY-AV456 (ID: ${fahrzeug.id}) erfolgreich gelöscht`);
  console.log(`   Alle zugehörigen Daten (Schäden, Wartungen, etc.) wurden ebenfalls gelöscht (CASCADE)`);
} else {
  console.log('❌ Fehler beim Löschen des Fahrzeugs');
  process.exit(1);
}
