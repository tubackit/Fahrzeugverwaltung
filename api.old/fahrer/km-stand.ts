import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getFahrzeugById, updateFahrzeug } from '../lib/firestore';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fahrzeugId, kmStand } = req.body;

    if (!fahrzeugId || kmStand === undefined) {
      return res.status(400).json({ error: 'Fahrzeug-ID und KM-Stand sind erforderlich' });
    }

    const fahrzeug = await getFahrzeugById(String(fahrzeugId));

    if (!fahrzeug) {
      return res.status(404).json({ error: 'Fahrzeug nicht gefunden' });
    }

    await updateFahrzeug(String(fahrzeugId), { aktuellerKmStand: kmStand });

    return res.status(200).json({ success: true, message: 'Kilometerstand aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des KM-Stands:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
