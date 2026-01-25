import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  createSchadensmeldung,
  getSchadensmeldungById,
  updateSchadensmeldung,
  getSchadensmeldungenByFahrzeugId,
  getAllSchadensmeldungen,
} from '../lib/firestore';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      // Schadensmeldung erstellen
      const data = req.body;

      if (!data.fahrzeugId || !data.kmStand || !data.beschreibung || !data.schadensart || !data.schweregrad) {
        return res.status(400).json({ error: 'Pflichtfelder fehlen' });
      }

      const id = await createSchadensmeldung({
        ...data,
        datum: new Date().toISOString(),
      });

      const neueSchadensmeldung = await getSchadensmeldungById(id);
      return res.status(201).json(neueSchadensmeldung);
    }

    if (req.method === 'GET') {
      // Alle Schadensmeldungen abrufen (für Admin)
      const schäden = await getAllSchadensmeldungen();
      return res.status(200).json(schäden);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Fehler in /api/fahrer/schaden:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
