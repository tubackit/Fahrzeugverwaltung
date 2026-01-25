import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  createWartungsmeldung,
  getWartungsmeldungById,
  getAllWartungsmeldungen,
} from '../lib/firestore';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // Wartungsmeldung erstellen
      const data = req.body;

      if (!data.fahrzeugId || !data.kmStand || !data.beschreibung || !data.dringlichkeit) {
        return res.status(400).json({ error: 'Pflichtfelder fehlen' });
      }

      const id = await createWartungsmeldung({
        ...data,
        datum: new Date().toISOString(),
      });

      const neueWartungsmeldung = await getWartungsmeldungById(id);
      return res.status(201).json(neueWartungsmeldung);
    }

    if (req.method === 'GET') {
      // Alle Wartungsmeldungen abrufen (für Admin)
      const wartungen = await getAllWartungsmeldungen();
      return res.status(200).json(wartungen);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Fehler in /api/fahrer/wartung:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
