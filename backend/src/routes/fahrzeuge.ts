import { Router, Request, Response } from 'express';
import { getDatabase } from '../db/database';
import type { Fahrzeug, CreateFahrzeugRequest, UpdateFahrzeugRequest } from '../../../shared/types';

const router = Router();

// Alle Fahrzeuge abrufen
router.get('/', (_req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const fahrzeuge = db.prepare('SELECT * FROM fahrzeuge ORDER BY kennzeichen').all() as Fahrzeug[];
    res.json(fahrzeuge);
  } catch (error) {
    console.error('Fehler beim Abrufen der Fahrzeuge:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Einzelnes Fahrzeug abrufen
router.get('/:id', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const fahrzeug = db.prepare('SELECT * FROM fahrzeuge WHERE id = ?').get(req.params.id) as Fahrzeug | undefined;
    
    if (!fahrzeug) {
      return res.status(404).json({ error: 'Fahrzeug nicht gefunden' });
    }
    
    res.json(fahrzeug);
  } catch (error) {
    console.error('Fehler beim Abrufen des Fahrzeugs:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Neues Fahrzeug erstellen
router.post('/', (req: Request, res: Response) => {
  try {
    const data: CreateFahrzeugRequest = req.body;
    
    if (!data.kennzeichen || !data.hersteller || !data.modell) {
      return res.status(400).json({ error: 'Kennzeichen, Hersteller und Modell sind Pflichtfelder' });
    }
    
    // Leere Strings und null-Werte filtern
    const cleanedData: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        cleanedData[key] = value;
      }
    });
    
    const db = getDatabase();
    const columns = Object.keys(cleanedData).join(', ');
    const placeholders = Object.keys(cleanedData).map(() => '?').join(', ');
    const values = Object.values(cleanedData);
    
    const result = db.prepare(`
      INSERT INTO fahrzeuge (${columns}, createdAt, updatedAt)
      VALUES (${placeholders}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(...values);
    
    const neuesFahrzeug = db.prepare('SELECT * FROM fahrzeuge WHERE id = ?').get(result.lastInsertRowid) as Fahrzeug;
    
    res.status(201).json(neuesFahrzeug);
  } catch (error) {
    console.error('Fehler beim Erstellen des Fahrzeugs:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Fahrzeug aktualisieren
router.put('/:id', (req: Request, res: Response) => {
  try {
    const data: UpdateFahrzeugRequest = req.body;
    const db = getDatabase();
    
    // Prüfen ob Fahrzeug existiert
    const exists = db.prepare('SELECT id FROM fahrzeuge WHERE id = ?').get(req.params.id);
    if (!exists) {
      return res.status(404).json({ error: 'Fahrzeug nicht gefunden' });
    }
    
    // Leere Strings und null-Werte filtern, aber null speichern wenn explizit angegeben
    const cleanedData: Record<string, unknown> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt') {
        if (value === '' || value === undefined) {
          cleanedData[key] = null; // Leere Felder als NULL speichern
        } else {
          cleanedData[key] = value;
        }
      }
    });
    
    const updateFields = Object.keys(cleanedData)
      .map(key => `${key} = ?`)
      .join(', ');
    
    const updateValues = Object.values(cleanedData);
    
    if (updateFields.length > 0) {
      db.prepare(`
        UPDATE fahrzeuge
        SET ${updateFields}, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(...updateValues, req.params.id);
    }
    
    const aktualisiertFahrzeug = db.prepare('SELECT * FROM fahrzeuge WHERE id = ?').get(req.params.id) as Fahrzeug;
    
    res.json(aktualisiertFahrzeug);
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Fahrzeugs:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Fahrzeug löschen
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const result = db.prepare('DELETE FROM fahrzeuge WHERE id = ?').run(req.params.id);
    
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Fahrzeug nicht gefunden' });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Fehler beim Löschen des Fahrzeugs:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

// Fahrzeugbild hochladen
router.post('/:id/upload-image', (req: Request, res: Response) => {
  try {
    const { imageData } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ error: 'Bilddaten fehlen' });
    }
    
    const db = getDatabase();
    
    // Prüfen ob Fahrzeug existiert
    const exists = db.prepare('SELECT id FROM fahrzeuge WHERE id = ?').get(req.params.id);
    if (!exists) {
      return res.status(404).json({ error: 'Fahrzeug nicht gefunden' });
    }
    
    // Bild als Base64-String in bildUrl speichern
    db.prepare('UPDATE fahrzeuge SET bildUrl = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?')
      .run(imageData, req.params.id);
    
    const aktualisiertFahrzeug = db.prepare('SELECT * FROM fahrzeuge WHERE id = ?').get(req.params.id) as Fahrzeug;
    
    res.json(aktualisiertFahrzeug);
  } catch (error) {
    console.error('Fehler beim Hochladen des Bildes:', error);
    res.status(500).json({ error: 'Interner Serverfehler' });
  }
});

export default router;

