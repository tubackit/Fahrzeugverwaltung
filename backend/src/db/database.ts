import Database from 'better-sqlite3';
import path from 'path';
import { createTables, seedDatabase } from './schema';
import { migrateDatabase } from './migrate';

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../../database.sqlite');

let db: Database.Database;

export const getDatabase = (): Database.Database => {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    
    createTables(db);
    migrateDatabase(db);
    seedDatabase(db);
    
    console.log(`✅ Datenbank verbunden: ${dbPath}`);
  }
  return db;
};

export const closeDatabase = () => {
  if (db) {
    db.close();
    console.log('✅ Datenbank-Verbindung geschlossen');
  }
};


