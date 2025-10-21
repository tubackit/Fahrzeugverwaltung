import Database from 'better-sqlite3';
import { getDatabase } from './database';

export const migrateDatabase = (db: Database.Database) => {
  console.log('🔄 Starte Datenbank-Migration...');
  
  // Prüfen welche Spalten bereits existieren
  const tableInfo = db.prepare("PRAGMA table_info(fahrzeuge)").all() as Array<{ name: string }>;
  const existingColumns = tableInfo.map(col => col.name);
  
  // Liste der neuen Spalten, die hinzugefügt werden müssen
  const newColumns = [
    { name: 'nutzer', type: 'TEXT' },
    { name: 'einsatzort', type: 'TEXT' },
    { name: 'leasingEnde', type: 'TEXT' },
    { name: 'autohaus', type: 'TEXT' },
    { name: 'kostentraeger', type: 'TEXT' },
    { name: 'datumAnschaffung', type: 'TEXT' },
    { name: 'vereinbarteKm', type: 'REAL' },
    { name: 'huTermin', type: 'TEXT' },
    { name: 'auTermin', type: 'TEXT' },
    { name: 'spTermin', type: 'TEXT' },
    { name: 'versicherungsgesellschaft', type: 'TEXT' },
    { name: 'versicherungsnummer', type: 'TEXT' },
    { name: 'versicherungsart', type: 'TEXT' },
    { name: 'deckungssumme', type: 'REAL' },
    { name: 'selbstbeteiligungTeilkasko', type: 'REAL' },
    { name: 'selbstbeteiligungVollkasko', type: 'REAL' },
    { name: 'jahrespraemie', type: 'REAL' },
    { name: 'vertragsbeginn', type: 'TEXT' },
    { name: 'vertragsende', type: 'TEXT' },
    { name: 'schadenfreiheitsklasse', type: 'TEXT' },
  ];
  
  // Spalten hinzufügen, die noch nicht existieren
  let addedColumns = 0;
  for (const column of newColumns) {
    if (!existingColumns.includes(column.name)) {
      try {
        db.exec(`ALTER TABLE fahrzeuge ADD COLUMN ${column.name} ${column.type}`);
        console.log(`  ✅ Spalte hinzugefügt: ${column.name} (${column.type})`);
        addedColumns++;
      } catch (error) {
        console.error(`  ❌ Fehler beim Hinzufügen von ${column.name}:`, error);
      }
    }
  }
  
  if (addedColumns === 0) {
    console.log('✅ Alle Spalten sind bereits vorhanden - keine Migration nötig');
  } else {
    console.log(`✅ Migration abgeschlossen: ${addedColumns} Spalte(n) hinzugefügt`);
  }
};

// Direkter Aufruf, wenn das Script direkt ausgeführt wird
if (require.main === module) {
  const db = getDatabase();
  migrateDatabase(db);
  console.log('✅ Migration erfolgreich abgeschlossen');
  process.exit(0);
}

