import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getSchadensmeldungenByFahrzeugId } from '../../lib/firestore';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const { fahrzeugId } = req.query;

  if (!fahrzeugId || typeof fahrzeugId !== 'string') {
    return res.status(400).json({ error: 'Fahrzeug-ID erforderlich' });
  }

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const schäden = await getSchadensmeldungenByFahrzeugId(fahrzeugId);
    return res.status(200).json(schäden);
  } catch (error) {
    console.error('Fehler beim Abrufen der Schadensmeldungen:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
