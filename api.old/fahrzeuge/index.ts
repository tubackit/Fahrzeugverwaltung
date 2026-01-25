import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getAllFahrzeuge,
  createFahrzeug,
  getFahrzeugById,
  updateFahrzeug,
  deleteFahrzeug,
} from '../lib/firestore';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Alle Fahrzeuge abrufen
      const fahrzeuge = await getAllFahrzeuge();
      return res.status(200).json(fahrzeuge);
    }

    if (req.method === 'POST') {
      // Neues Fahrzeug erstellen
      const data = req.body;

      if (!data.kennzeichen || !data.hersteller || !data.modell) {
        return res.status(400).json({ error: 'Kennzeichen, Hersteller und Modell sind Pflichtfelder' });
      }

      const id = await createFahrzeug(data);
      const neuesFahrzeug = await getFahrzeugById(id);

      return res.status(201).json(neuesFahrzeug);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Fehler in /api/fahrzeuge:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
