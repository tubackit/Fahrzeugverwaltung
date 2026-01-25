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

// Schadensmeldung Status aktualisieren
router.put('/schaden/:id', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    if (!status || !['Gemeldet', 'In Bearbeitung', 'Repariert', 'Abgeschlossen'].includes(status)) {
      return res.status(400).json({ error: 'Ungültiger Status' });
    }
    
    const db = getDatabase();
    
    // Prüfen ob Schadensmeldung existiert
    const exists = db.prepare('SELECT id FROM schadensmeldungen WHERE id = ?').get(req.params.id);
    if (!exists) {
      return res.status(404).json({ error: 'Schadensmeldung nicht gefunden' });
    }
    
    // Status aktualisieren
    db.prepare(`
      UPDATE schadensmeldungen
      SET status = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, req.params.id);
    
    const aktualisierteSchadensmeldung = db.prepare(
      'SELECT * FROM schadensmeldungen WHERE id = ?'
    ).get(req.params.id) as Schadensmeldung;
    
    res.json(aktualisierteSchadensmeldung);
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Schadensmeldung:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Wartungsmeldung Status aktualisieren
router.put('/wartung/:id', (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    
    if (!status || !['Gemeldet', 'Bestätigt', 'Geplant', 'Erledigt'].includes(status)) {
      return res.status(400).json({ error: 'Ungültiger Status' });
    }
    
    const db = getDatabase();
    
    // Prüfen ob Wartungsmeldung existiert
    const exists = db.prepare('SELECT id FROM wartungsmeldungen WHERE id = ?').get(req.params.id);
    if (!exists) {
      return res.status(404).json({ error: 'Wartungsmeldung nicht gefunden' });
    }
    
    // Status aktualisieren
    db.prepare(`
      UPDATE wartungsmeldungen
      SET status = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, req.params.id);
    
    const aktualisierteWartungsmeldung = db.prepare(
      'SELECT * FROM wartungsmeldungen WHERE id = ?'
    ).get(req.params.id) as WartungsMeldung;
    
    res.json(aktualisierteWartungsmeldung);
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Wartungsmeldung:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Reifen-Profiltiefe aktualisieren
router.post('/reifen-profiltiefe', (req: Request, res: Response) => {
  try {
    const { fahrzeugId, reifenArt, profiltiefen, kmStand } = req.body;
    
    if (!fahrzeugId || !reifenArt || !profiltiefen) {
      return res.status(400).json({ error: 'Fahrzeug-ID, Reifenart und Profiltiefen sind erforderlich' });
    }
    
    if (!['sommer', 'winter'].includes(reifenArt)) {
      return res.status(400).json({ error: 'Reifenart muss "sommer" oder "winter" sein' });
    }
    
    const db = getDatabase();
    
    // Prüfen ob Fahrzeug existiert
    const exists = db.prepare('SELECT id FROM fahrzeuge WHERE id = ?').get(fahrzeugId);
    if (!exists) {
      return res.status(404).json({ error: 'Fahrzeug nicht gefunden' });
    }
    
    // Profiltiefen basierend auf Reifenart aktualisieren
    const { vl, vr, hl, hr } = profiltiefen;
    const suffix = reifenArt === 'sommer' ? 'Sommer' : 'Winter';
    
    // Bereite Update-Statement vor
    const updateFields: string[] = [];
    const updateValues: (number | null)[] = [];
    
    if (vl !== null && vl !== undefined) {
      updateFields.push(`reifenProfiltiefeVL${suffix} = ?`);
      updateValues.push(vl);
    }
    if (vr !== null && vr !== undefined) {
      updateFields.push(`reifenProfiltiefeVR${suffix} = ?`);
      updateValues.push(vr);
    }
    if (hl !== null && hl !== undefined) {
      updateFields.push(`reifenProfiltiefeHL${suffix} = ?`);
      updateValues.push(hl);
    }
    if (hr !== null && hr !== undefined) {
      updateFields.push(`reifenProfiltiefeHR${suffix} = ?`);
      updateValues.push(hr);
    }
    
    // Wenn kmStand vorhanden ist, auch reifenKmBeiMontage aktualisieren (falls nicht vorhanden)
    if (kmStand !== null && kmStand !== undefined) {
      const kmField = `reifenKmBeiMontage${suffix}`;
      const currentKm = db.prepare(`SELECT ${kmField} FROM fahrzeuge WHERE id = ?`).get(fahrzeugId) as Record<string, unknown>;
      if (!currentKm || currentKm[kmField] === null || currentKm[kmField] === undefined) {
        updateFields.push(`${kmField} = ?`);
        updateValues.push(kmStand);
      }
    }
    
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'Keine Profiltiefen zum Aktualisieren' });
    }
    
    updateFields.push('updatedAt = CURRENT_TIMESTAMP');
    updateValues.push(fahrzeugId);
    
    const updateQuery = `
      UPDATE fahrzeuge
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;
    
    db.prepare(updateQuery).run(...updateValues);
    
    res.json({ success: true, message: 'Profiltiefen erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Profiltiefen:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

export default router;



