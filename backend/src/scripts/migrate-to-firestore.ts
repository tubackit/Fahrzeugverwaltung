/**
 * Migration-Script: SQLite → Firebase Firestore
 * 
 * Dieses Script exportiert alle Daten aus SQLite und importiert sie in Firestore.
 * 
 * Verwendung:
 * 1. Firebase-Projekt einrichten und Service Account erstellen
 * 2. Environment Variables setzen (FIREBASE_SERVICE_ACCOUNT oder einzelne Variablen)
 * 3. Script ausführen: npx tsx backend/src/scripts/migrate-to-firestore.ts
 */

import { getDatabase } from '../db/database';
import { initFirestore } from '../db/firestore';
import admin from 'firebase-admin';

const db = getDatabase();
const firestore = initFirestore();

interface Fahrzeug {
  id: number;
  [key: string]: unknown;
}

interface Schadensmeldung {
  id: number;
  [key: string]: unknown;
}

interface WartungsMeldung {
  id: number;
  [key: string]: unknown;
}

/**
 * Konvertiert SQLite Timestamp zu Firestore Timestamp
 */
const convertTimestamp = (value: string | null | undefined): admin.firestore.Timestamp | null => {
  if (!value) return null;
  try {
    return admin.firestore.Timestamp.fromDate(new Date(value));
  } catch {
    return null;
  }
};

/**
 * Bereinigt Daten für Firestore
 */
const cleanForFirestore = (data: any): any => {
  const cleaned: any = {};
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'id') return; // id wird als Document-ID verwendet
    
    if (value === null || value === undefined) {
      cleaned[key] = null;
    } else if (key === 'createdAt' || key === 'updatedAt' || key === 'datum') {
      cleaned[key] = convertTimestamp(value as string) || admin.firestore.FieldValue.serverTimestamp();
    } else {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

async function migrateFahrzeuge() {
  console.log('🚗 Migriere Fahrzeuge...');
  
  const fahrzeuge = db.prepare('SELECT * FROM fahrzeuge').all() as Fahrzeug[];
  console.log(`   Gefunden: ${fahrzeuge.length} Fahrzeuge`);

  let migrated = 0;
  for (const fahrzeug of fahrzeuge) {
    try {
      const cleaned = cleanForFirestore(fahrzeug);
      // Verwende die SQLite-ID als Document-ID für Konsistenz
      await firestore.collection('fahrzeuge').doc(String(fahrzeug.id)).set({
        ...cleaned,
        createdAt: cleaned.createdAt || admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: cleaned.updatedAt || admin.firestore.FieldValue.serverTimestamp(),
      });
      migrated++;
      if (migrated % 10 === 0) {
        console.log(`   Fortschritt: ${migrated}/${fahrzeuge.length}`);
      }
    } catch (error) {
      console.error(`   ❌ Fehler bei Fahrzeug ID ${fahrzeug.id}:`, error);
    }
  }

  console.log(`✅ ${migrated}/${fahrzeuge.length} Fahrzeuge migriert`);
}

async function migrateSchadensmeldungen() {
  console.log('🔧 Migriere Schadensmeldungen...');
  
  const schäden = db.prepare('SELECT * FROM schadensmeldungen').all() as Schadensmeldung[];
  console.log(`   Gefunden: ${schäden.length} Schadensmeldungen`);

  let migrated = 0;
  for (const schaden of schäden) {
    try {
      const cleaned = cleanForFirestore(schaden);
      await firestore.collection('schadensmeldungen').doc(String(schaden.id)).set({
        ...cleaned,
        createdAt: cleaned.createdAt || admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: cleaned.updatedAt || admin.firestore.FieldValue.serverTimestamp(),
      });
      migrated++;
    } catch (error) {
      console.error(`   ❌ Fehler bei Schadensmeldung ID ${schaden.id}:`, error);
    }
  }

  console.log(`✅ ${migrated}/${schäden.length} Schadensmeldungen migriert`);
}

async function migrateWartungsmeldungen() {
  console.log('🔧 Migriere Wartungsmeldungen...');
  
  const wartungen = db.prepare('SELECT * FROM wartungsmeldungen').all() as WartungsMeldung[];
  console.log(`   Gefunden: ${wartungen.length} Wartungsmeldungen`);

  let migrated = 0;
  for (const wartung of wartungen) {
    try {
      const cleaned = cleanForFirestore(wartung);
      await firestore.collection('wartungsmeldungen').doc(String(wartung.id)).set({
        ...cleaned,
        createdAt: cleaned.createdAt || admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: cleaned.updatedAt || admin.firestore.FieldValue.serverTimestamp(),
      });
      migrated++;
    } catch (error) {
      console.error(`   ❌ Fehler bei Wartungsmeldung ID ${wartung.id}:`, error);
    }
  }

  console.log(`✅ ${migrated}/${wartungen.length} Wartungsmeldungen migriert`);
}

async function main() {
  console.log('🔄 Starte Migration von SQLite zu Firebase Firestore...\n');

  try {
    await migrateFahrzeuge();
    console.log('');
    await migrateSchadensmeldungen();
    console.log('');
    await migrateWartungsmeldungen();
    console.log('\n✅ Migration abgeschlossen!');
  } catch (error) {
    console.error('\n❌ Fehler bei der Migration:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
