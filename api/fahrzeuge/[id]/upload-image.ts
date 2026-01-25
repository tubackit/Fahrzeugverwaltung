import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getFahrzeugById,
  updateFahrzeug,
} from '../../lib/firestore';

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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData } = req.body;

    if (!imageData) {
      return res.status(400).json({ error: 'Bilddaten fehlen' });
    }

    const fahrzeug = await getFahrzeugById(id);

    if (!fahrzeug) {
      return res.status(404).json({ error: 'Fahrzeug nicht gefunden' });
    }

    await updateFahrzeug(id, { bildUrl: imageData });
    const aktualisiertFahrzeug = await getFahrzeugById(id);

    return res.status(200).json(aktualisiertFahrzeug);
  } catch (error) {
    console.error('Fehler beim Hochladen des Bildes:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
