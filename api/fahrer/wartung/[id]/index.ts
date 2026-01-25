import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getWartungsmeldungById,
  updateWartungsmeldung,
} from '../../../lib/firestore';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Wartungsmeldung-ID erforderlich' });
  }

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { status } = req.body;

    if (!status || !['Gemeldet', 'Bestätigt', 'Geplant', 'Erledigt'].includes(status)) {
      return res.status(400).json({ error: 'Ungültiger Status' });
    }

    const wartungsmeldung = await getWartungsmeldungById(id);

    if (!wartungsmeldung) {
      return res.status(404).json({ error: 'Wartungsmeldung nicht gefunden' });
    }

    await updateWartungsmeldung(id, { status });
    const aktualisierteWartungsmeldung = await getWartungsmeldungById(id);

    return res.status(200).json(aktualisierteWartungsmeldung);
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Wartungsmeldung:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
