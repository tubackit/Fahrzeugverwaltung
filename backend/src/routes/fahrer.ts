import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database';
import type {
  FahrerLoginRequest,
  FahrerLoginResponse,
  CreateSchadensmeldungRequest,
  CreateWartungsMeldungRequest,
  UpdateKmStandRequest,
  Fahrzeug,
  Schadensmeldung,
  WartungsMeldung
} from '../../../shared/types';

const router = Router();

// Fahrer Login
router.post('/login', (req: Request, res: Response) => {
  try {
    const { kennzeichen, pin }: FahrerLoginRequest = req.body;
    
    if (!kennzeichen || !pin) {
      return res.status(400).json({
        success: false,
        message: 'Kennzeichen und PIN sind erforderlich'
      } as FahrerLoginResponse);
    }
    
    const db = getDatabase();
    const fahrzeug = db.prepare(
      'SELECT * FROM fahrzeuge WHERE kennzeichen = ? AND pin = ?'
    ).get(kennzeichen, pin) as Fahrzeug | undefined;
    
    if (!fahrzeug) {
      return res.status(401).json({
        success: false,
        message: 'Ungültiges Kennzeichen oder PIN'
      } as FahrerLoginResponse);
    }
    
    // PIN aus Response entfernen
    const { pin: _, ...fahrzeugOhnePin } = fahrzeug;
    
    res.json({
      success: true,
      fahrzeug: fahrzeugOhnePin
    } as FahrerLoginResponse);
  } catch (error) {
    console.error('Fehler beim Fahrer-Login:', error);
    res.status(500).json({
      success: false,
      message: 'Interner Serverfehler'
    } as FahrerLoginResponse);
  }
});

// Kilometerstand aktualisieren
router.post('/km-stand', (req: Request, res: Response) => {
  try {
    const { fahrzeugId, kmStand }: UpdateKmStandRequest = req.body;
    
    if (!fahrzeugId || kmStand === undefined) {
      return res.status(400).json({ error: 'Fahrzeug-ID und KM-Stand sind erforderlich' });
    }
    
    const db = getDatabase();
    const result = db.prepare(`
      UPDATE fahrzeuge
      SET aktuellerKmStand = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(kmStand, fahrzeugId);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Fahrzeug nicht gefunden' });
    }
    
    res.json({ success: true, message: 'Kilometerstand aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des KM-Stands:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Schadensmeldung erstellen
router.post('/schaden', (req: Request, res: Response) => {
  try {
    const data: CreateSchadensmeldungRequest = req.body;
    
    if (!data.fahrzeugId || !data.kmStand || !data.beschreibung || !data.schadensart || !data.schweregrad) {
      return res.status(400).json({ error: 'Pflichtfelder fehlen' });
    }
    
    const db = getDatabase();
    const result = db.prepare(`
      INSERT INTO schadensmeldungen (
        fahrzeugId, datum, kmStand, beschreibung, schadensart, schweregrad, 
        melder, bemerkungen, status, createdAt, updatedAt
      ) VALUES (?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, ?, 'Gemeldet', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(
      data.fahrzeugId,
      data.kmStand,
      data.beschreibung,
      data.schadensart,
      data.schweregrad,
      data.melder || null,
      data.bemerkungen || null
    );
    
    const neueSchadensmeldung = db.prepare(
      'SELECT * FROM schadensmeldungen WHERE id = ?'
    ).get(result.lastInsertRowid) as Schadensmeldung;
    
    res.status(201).json(neueSchadensmeldung);
  } catch (error) {
    console.error('Fehler beim Erstellen der Schadensmeldung:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Wartungsmeldung erstellen
router.post('/wartung', (req: Request, res: Response) => {
  try {
    const data: CreateWartungsMeldungRequest = req.body;
    
    if (!data.fahrzeugId || !data.kmStand || !data.beschreibung || !data.dringlichkeit) {
      return res.status(400).json({ error: 'Pflichtfelder fehlen' });
    }
    
    const db = getDatabase();
    const result = db.prepare(`
      INSERT INTO wartungsmeldungen (
        fahrzeugId, datum, kmStand, beschreibung, dringlichkeit, 
        melder, bemerkungen, status, createdAt, updatedAt
      ) VALUES (?, CURRENT_TIMESTAMP, ?, ?, ?, ?, ?, 'Gemeldet', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(
      data.fahrzeugId,
      data.kmStand,
      data.beschreibung,
      data.dringlichkeit,
      data.melder || null,
      data.bemerkungen || null
    );
    
    const neueWartungsmeldung = db.prepare(
      'SELECT * FROM wartungsmeldungen WHERE id = ?'
    ).get(result.lastInsertRowid) as WartungsMeldung;
    
    res.status(201).json(neueWartungsmeldung);
  } catch (error) {
    console.error('Fehler beim Erstellen der Wartungsmeldung:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Schadensmeldungen für ein Fahrzeug abrufen
router.get('/schaden/:fahrzeugId', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const schäden = db.prepare(
      'SELECT * FROM schadensmeldungen WHERE fahrzeugId = ? ORDER BY datum DESC'
    ).all(req.params.fahrzeugId) as Schadensmeldung[];
    
    res.json(schäden);
  } catch (error) {
    console.error('Fehler beim Abrufen der Schadensmeldungen:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Wartungsmeldungen für ein Fahrzeug abrufen
router.get('/wartung/:fahrzeugId', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const wartungen = db.prepare(
      'SELECT * FROM wartungsmeldungen WHERE fahrzeugId = ? ORDER BY datum DESC'
    ).all(req.params.fahrzeugId) as WartungsMeldung[];
    
    res.json(wartungen);
  } catch (error) {
    console.error('Fehler beim Abrufen der Wartungsmeldungen:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

export default router;


