/**
 * Script zum Hinzufügen eines Bildes zum Fahrzeug KO-KI-10
 */

import { getDatabase } from '../db/database';
import * as fs from 'fs';
import * as path from 'path';

const db = getDatabase();

// Suche nach dem Fahrzeug KO-KI-10
const fahrzeug = db.prepare('SELECT id, kennzeichen, hersteller, modell FROM fahrzeuge WHERE kennzeichen = ?').get('KO-KI-10') as { id: number; kennzeichen: string; hersteller: string; modell: string } | undefined;

if (!fahrzeug) {
  console.log('❌ Fahrzeug KO-KI-10 nicht gefunden');
  process.exit(1);
}

console.log(`🔍 Gefundenes Fahrzeug:`);
console.log(`   ID: ${fahrzeug.id}`);
console.log(`   Kennzeichen: ${fahrzeug.kennzeichen}`);
console.log(`   Hersteller: ${fahrzeug.hersteller}`);
console.log(`   Modell: ${fahrzeug.modell}`);
console.log('');

// Pfad zum Bild
const imagePath = path.join('/Users/pmac1/.cursor/projects/Users-pmac1-Meine-Projekte-Fahrzeugverwaltung/assets/Leon-4e64f544-830e-4dce-9151-d2c0a4d56b0d.png');

// Prüfe ob das Bild existiert
if (!fs.existsSync(imagePath)) {
  console.log(`❌ Bild nicht gefunden: ${imagePath}`);
  process.exit(1);
}

console.log(`📷 Lese Bild von: ${imagePath}`);

// Lese das Bild und konvertiere es zu Base64
const imageBuffer = fs.readFileSync(imagePath);
const base64Image = imageBuffer.toString('base64');

// Bestimme den MIME-Type basierend auf der Dateiendung
const mimeType = 'image/png';
const dataUrl = `data:${mimeType};base64,${base64Image}`;

console.log(`✅ Bild erfolgreich gelesen (${(imageBuffer.length / 1024).toFixed(2)} KB)`);
console.log('');

// Aktualisiere das Fahrzeug mit dem Bild
const result = db.prepare('UPDATE fahrzeuge SET bildUrl = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?').run(dataUrl, fahrzeug.id);

if (result.changes > 0) {
  console.log(`✅ Bild erfolgreich zum Fahrzeug KO-KI-10 (ID: ${fahrzeug.id}) hinzugefügt`);
} else {
  console.log('❌ Fehler beim Aktualisieren des Fahrzeugs');
  process.exit(1);
}
