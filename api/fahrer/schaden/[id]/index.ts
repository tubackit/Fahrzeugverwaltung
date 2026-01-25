import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getSchadensmeldungById,
  updateSchadensmeldung,
} from '../../../lib/firestore';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Schadensmeldung-ID erforderlich' });
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

    if (!status || !['Gemeldet', 'In Bearbeitung', 'Repariert', 'Abgeschlossen'].includes(status)) {
      return res.status(400).json({ error: 'Ungültiger Status' });
    }

    const schadensmeldung = await getSchadensmeldungById(id);

    if (!schadensmeldung) {
      return res.status(404).json({ error: 'Schadensmeldung nicht gefunden' });
    }

    await updateSchadensmeldung(id, { status });
    const aktualisierteSchadensmeldung = await getSchadensmeldungById(id);

    return res.status(200).json(aktualisierteSchadensmeldung);
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Schadensmeldung:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
