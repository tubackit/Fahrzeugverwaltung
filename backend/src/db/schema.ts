import Database from 'better-sqlite3';

export const createTables = (db: Database.Database) => {
  // Fahrzeuge Tabelle
  db.exec(`
    CREATE TABLE IF NOT EXISTS fahrzeuge (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kennzeichen TEXT UNIQUE NOT NULL,
      hersteller TEXT NOT NULL,
      modell TEXT NOT NULL,
      fahrzeugklasse TEXT,
      typ TEXT,
      sitze INTEGER,
      fin TEXT,
      hsn TEXT,
      tsn TEXT,
      farbe TEXT,
      aufbau TEXT,
      tueren INTEGER,
      motorart TEXT,
      kraftstoffart TEXT,
      leergewicht INTEGER,
      zulaessigesGesamtgewicht INTEGER,
      hubraum INTEGER,
      leistungKW INTEGER,
      leistungPS INTEGER,
      laenge REAL,
      breite REAL,
      baujahr INTEGER,
      anschaffungsjahr INTEGER,
      erstzulassung TEXT,
      zulassungAm TEXT,
      zulassungsart TEXT,
      aktuellerKmStand REAL DEFAULT 0,
      bemerkungen TEXT,
      bildUrl TEXT,
      pin TEXT,
      nutzer TEXT,
      einsatzort TEXT,
      leasingEnde TEXT,
      autohaus TEXT,
      kostentraeger TEXT,
      datumAnschaffung TEXT,
      vereinbarteKm REAL,
      huTermin TEXT,
      auTermin TEXT,
      spTermin TEXT,
      versicherungsgesellschaft TEXT,
      versicherungsnummer TEXT,
      versicherungsart TEXT,
      deckungssumme REAL,
      selbstbeteiligungTeilkasko REAL,
      selbstbeteiligungVollkasko REAL,
      jahrespraemie REAL,
      vertragsbeginn TEXT,
      vertragsende TEXT,
      schadenfreiheitsklasse TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Tankbuchungen Tabelle
  db.exec(`
    CREATE TABLE IF NOT EXISTS tankbuchungen (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fahrzeugId INTEGER NOT NULL,
      datum TEXT NOT NULL,
      kmStand REAL NOT NULL,
      liter REAL NOT NULL,
      kosten REAL NOT NULL,
      tankstelle TEXT,
      vollTankung INTEGER DEFAULT 1,
      bemerkungen TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (fahrzeugId) REFERENCES fahrzeuge(id) ON DELETE CASCADE
    );
  `);

  // Fahrtenbuch Tabelle
  db.exec(`
    CREATE TABLE IF NOT EXISTS fahrtenbuch (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fahrzeugId INTEGER NOT NULL,
      datum TEXT NOT NULL,
      kmStart REAL NOT NULL,
      kmEnde REAL NOT NULL,
      kmGesamt REAL NOT NULL,
      nutzer TEXT,
      zweck TEXT,
      route TEXT,
      bemerkungen TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (fahrzeugId) REFERENCES fahrzeuge(id) ON DELETE CASCADE
    );
  `);

  // Schadensmeldungen Tabelle
  db.exec(`
    CREATE TABLE IF NOT EXISTS schadensmeldungen (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fahrzeugId INTEGER NOT NULL,
      datum TEXT NOT NULL,
      kmStand REAL NOT NULL,
      beschreibung TEXT NOT NULL,
      schadensart TEXT NOT NULL CHECK(schadensart IN ('Unfall', 'Kratzer', 'Delle', 'Technisch', 'Sonstiges')),
      schweregrad TEXT NOT NULL CHECK(schweregrad IN ('Leicht', 'Mittel', 'Schwer')),
      status TEXT DEFAULT 'Gemeldet' CHECK(status IN ('Gemeldet', 'In Bearbeitung', 'Repariert', 'Abgeschlossen')),
      melder TEXT,
      bildUrls TEXT,
      bemerkungen TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (fahrzeugId) REFERENCES fahrzeuge(id) ON DELETE CASCADE
    );
  `);

  // Wartungen Tabelle
  db.exec(`
    CREATE TABLE IF NOT EXISTS wartungen (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fahrzeugId INTEGER NOT NULL,
      datum TEXT NOT NULL,
      kmStand REAL NOT NULL,
      wartungsart TEXT NOT NULL CHECK(wartungsart IN ('Inspektion', 'Ölwechsel', 'Reifen', 'TÜV/HU', 'AU', 'Sonstiges')),
      beschreibung TEXT NOT NULL,
      kosten REAL,
      werkstatt TEXT,
      naechsteWartungKm REAL,
      naechsteWartungDatum TEXT,
      status TEXT DEFAULT 'Geplant' CHECK(status IN ('Geplant', 'Durchgeführt', 'Überfällig')),
      bemerkungen TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (fahrzeugId) REFERENCES fahrzeuge(id) ON DELETE CASCADE
    );
  `);

  // Wartungsmeldungen Tabelle (von Nutzern)
  db.exec(`
    CREATE TABLE IF NOT EXISTS wartungsmeldungen (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fahrzeugId INTEGER NOT NULL,
      datum TEXT NOT NULL,
      kmStand REAL NOT NULL,
      beschreibung TEXT NOT NULL,
      dringlichkeit TEXT NOT NULL CHECK(dringlichkeit IN ('Niedrig', 'Mittel', 'Hoch', 'Sofort')),
      status TEXT DEFAULT 'Gemeldet' CHECK(status IN ('Gemeldet', 'Bestätigt', 'Geplant', 'Erledigt')),
      melder TEXT,
      bemerkungen TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (fahrzeugId) REFERENCES fahrzeuge(id) ON DELETE CASCADE
    );
  `);

  console.log('✅ Datenbank-Tabellen erfolgreich erstellt');
};

export const seedDatabase = (db: Database.Database) => {
  // Prüfen ob bereits Daten vorhanden sind
  const count = db.prepare('SELECT COUNT(*) as count FROM fahrzeuge').get() as { count: number };
  
  if (count.count > 0) {
    console.log('ℹ️  Datenbank enthält bereits Daten, überspringe Seed');
    return;
  }

  // Beispiel-Fahrzeuge einfügen
  const insertFahrzeug = db.prepare(`
    INSERT INTO fahrzeuge (
      kennzeichen, hersteller, modell, fahrzeugklasse, typ, sitze,
      fin, hsn, tsn, farbe, aufbau, tueren, motorart, kraftstoffart,
      leergewicht, zulaessigesGesamtgewicht, hubraum, leistungKW, leistungPS,
      laenge, breite, baujahr, anschaffungsjahr, erstzulassung, zulassungAm,
      zulassungsart, aktuellerKmStand, bemerkungen, pin
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertFahrzeug.run(
    'FZ-PLUS',
    'Ford',
    'Mondeo',
    'Obere Mittelklasse',
    'Stufenheck',
    5,
    '00000000000000000X',
    '0001',
    '123',
    'Silber-Metallic',
    'Stufenheck',
    5,
    'Otto',
    'Euro 4',
    1500,
    2500,
    1796,
    85,
    115,
    4.75,
    1.85,
    1997,
    2001,
    '2001-04-12',
    '2001-04-12',
    'Zulassung eines Gebrauchtfahrzeugs',
    25436.2,
    'Beispielfahrzeug aus der Dokumentation',
    '1234' // PIN für Nutzer-Login
  );

  insertFahrzeug.run(
    'TY-AV456',
    'Toyota',
    'Avensis Verso',
    'Mittelklasse',
    'Van',
    7,
    '12345678901234567',
    '1234',
    '567',
    'Blau-Metallic',
    'Van',
    5,
    'Diesel',
    'Euro 5',
    1650,
    2400,
    1995,
    93,
    126,
    4.56,
    1.75,
    2005,
    2006,
    '2006-03-15',
    '2006-03-15',
    'Erstzulassung',
    87500,
    'Firmenwagen für größere Fahrten',
    '5678'
  );

  console.log('✅ Beispiel-Daten erfolgreich eingefügt');
};

