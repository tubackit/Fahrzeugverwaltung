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
    { name: 'versicherungsAnsprechpartner', type: 'TEXT' },
    { name: 'versicherungsEmail', type: 'TEXT' },
    { name: 'versicherungsTelefon', type: 'TEXT' },
    { name: 'deckungssumme', type: 'REAL' },
    { name: 'selbstbeteiligungTeilkasko', type: 'REAL' },
    { name: 'selbstbeteiligungVollkasko', type: 'REAL' },
    { name: 'jahrespraemie', type: 'REAL' },
    { name: 'vertragsbeginn', type: 'TEXT' },
    { name: 'vertragsende', type: 'TEXT' },
    { name: 'schadenfreiheitsklasse', type: 'TEXT' },
    // Reifen-Daten (Sommerreifen)
    { name: 'reifenMarkeSommer', type: 'TEXT' },
    { name: 'reifenModellSommer', type: 'TEXT' },
    { name: 'reifenGroesseSommer', type: 'TEXT' },
    { name: 'reifenMontagedatumSommer', type: 'TEXT' },
    { name: 'reifenKmBeiMontageSommer', type: 'REAL' },
    { name: 'reifenProfiltiefeVLSommer', type: 'REAL' }, // Vorne Links
    { name: 'reifenProfiltiefeVRSommer', type: 'REAL' }, // Vorne Rechts
    { name: 'reifenProfiltiefeHLSommer', type: 'REAL' }, // Hinten Links
    { name: 'reifenProfiltiefeHRSommer', type: 'REAL' }, // Hinten Rechts
    // Reifen-Daten (Winterreifen)
    { name: 'reifenMarkeWinter', type: 'TEXT' },
    { name: 'reifenModellWinter', type: 'TEXT' },
    { name: 'reifenGroesseWinter', type: 'TEXT' },
    { name: 'reifenMontagedatumWinter', type: 'TEXT' },
    { name: 'reifenKmBeiMontageWinter', type: 'REAL' },
    { name: 'reifenProfiltiefeVLWinter', type: 'REAL' }, // Vorne Links
    { name: 'reifenProfiltiefeVRWinter', type: 'REAL' }, // Vorne Rechts
    { name: 'reifenProfiltiefeHLWinter', type: 'REAL' }, // Hinten Links
    { name: 'reifenProfiltiefeHRWinter', type: 'REAL' }, // Hinten Rechts
    // Zusätzliche Felder für SharePoint-Import
    { name: 'kmStandBeiKauf', type: 'REAL' },
    { name: 'erinnerungNeuanschaffung', type: 'TEXT' },
    { name: 'letzterWerkstatttermin', type: 'TEXT' },
    { name: 'anzahlWerkstatttermine', type: 'INTEGER' },
    { name: 'dokumenteUrl', type: 'TEXT' },
    { name: 'inklWartung', type: 'TEXT' }, // "Ja" oder "Nein"
    { name: 'status', type: 'TEXT' },
    { name: 'statusDatum', type: 'TEXT' },
    { name: 'waschkarte', type: 'TEXT' },
    { name: 'kaufOderLeasing', type: 'TEXT' },
    { name: 'meldungKmStandDatum', type: 'TEXT' },
    { name: 'kmBisInsp', type: 'REAL' },
    // Alte Reifen-Felder (für Rückwärtskompatibilität - werden zu Sommerreifen migriert)
    { name: 'reifenMarke', type: 'TEXT' },
    { name: 'reifenModell', type: 'TEXT' },
    { name: 'reifenGroesse', type: 'TEXT' },
    { name: 'reifenMontagedatum', type: 'TEXT' },
    { name: 'reifenKmBeiMontage', type: 'REAL' },
    { name: 'reifenProfiltiefeVL', type: 'REAL' },
    { name: 'reifenProfiltiefeVR', type: 'REAL' },
    { name: 'reifenProfiltiefeHL', type: 'REAL' },
    { name: 'reifenProfiltiefeHR', type: 'REAL' },
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
  
  // Migration: Alte Reifen-Felder zu Sommerreifen migrieren (falls vorhanden)
  // Prüfe nach dem Hinzufügen der Spalten, ob neue Felder existieren
  const updatedTableInfo = db.prepare("PRAGMA table_info(fahrzeuge)").all() as Array<{ name: string }>;
  const updatedExistingColumns = updatedTableInfo.map(col => col.name);
  
  if (updatedExistingColumns.includes('reifenMarke') && updatedExistingColumns.includes('reifenMarkeSommer')) {
    try {
      // Prüfe ob bereits Daten in den neuen Feldern vorhanden sind
      const checkResult = db.prepare('SELECT COUNT(*) as count FROM fahrzeuge WHERE reifenMarkeSommer IS NOT NULL').get() as { count: number };
      
      if (checkResult.count === 0) {
        // Migriere Daten von alten Feldern zu Sommerreifen (nur wenn neue Felder leer sind)
        const updateResult = db.prepare(`
          UPDATE fahrzeuge 
          SET 
            reifenMarkeSommer = reifenMarke,
            reifenModellSommer = reifenModell,
            reifenGroesseSommer = reifenGroesse,
            reifenMontagedatumSommer = reifenMontagedatum,
            reifenKmBeiMontageSommer = reifenKmBeiMontage,
            reifenProfiltiefeVLSommer = reifenProfiltiefeVL,
            reifenProfiltiefeVRSommer = reifenProfiltiefeVR,
            reifenProfiltiefeHLSommer = reifenProfiltiefeHL,
            reifenProfiltiefeHRSommer = reifenProfiltiefeHR
          WHERE (reifenMarke IS NOT NULL OR reifenModell IS NOT NULL OR reifenGroesse IS NOT NULL)
        `).run();
        
        if (updateResult.changes > 0) {
          console.log(`  ✅ Alte Reifen-Daten zu Sommerreifen migriert (${updateResult.changes} Datensätze)`);
        } else {
          console.log('  ℹ️  Keine alten Reifen-Daten zum Migrieren gefunden');
        }
      } else {
        console.log('  ℹ️  Reifen-Daten bereits vorhanden - Migration übersprungen');
      }
    } catch (error) {
      console.error('  ⚠️  Fehler bei Migration alter Reifen-Daten:', error);
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

