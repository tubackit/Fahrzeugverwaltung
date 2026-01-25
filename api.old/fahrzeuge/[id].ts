import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getFahrzeugById,
  updateFahrzeug,
  deleteFahrzeug,
} from '../lib/firestore';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Fahrzeug-ID erforderlich' });
  }

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Einzelnes Fahrzeug abrufen
      const fahrzeug = await getFahrzeugById(id);

      if (!fahrzeug) {
        return res.status(404).json({ error: 'Fahrzeug nicht gefunden' });
      }

      return res.status(200).json(fahrzeug);
    }

    if (req.method === 'PUT') {
      // Fahrzeug aktualisieren
      const fahrzeug = await getFahrzeugById(id);

      if (!fahrzeug) {
        return res.status(404).json({ error: 'Fahrzeug nicht gefunden' });
      }

      const data = req.body;
      await updateFahrzeug(id, data);
      const aktualisiertFahrzeug = await getFahrzeugById(id);

      return res.status(200).json(aktualisiertFahrzeug);
    }

    if (req.method === 'DELETE') {
      // Fahrzeug löschen
      const fahrzeug = await getFahrzeugById(id);

      if (!fahrzeug) {
        return res.status(404).json({ error: 'Fahrzeug nicht gefunden' });
      }

      await deleteFahrzeug(id);
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Fehler in /api/fahrzeuge/[id]:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
