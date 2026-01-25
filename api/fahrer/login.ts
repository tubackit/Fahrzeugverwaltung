import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getFahrzeugByKennzeichen } from '../lib/firestore';

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
    const { kennzeichen, pin } = req.body;

    if (!kennzeichen || !pin) {
      return res.status(400).json({
        success: false,
        message: 'Kennzeichen und PIN sind erforderlich',
      });
    }

    const fahrzeug = await getFahrzeugByKennzeichen(kennzeichen);

    if (!fahrzeug || fahrzeug.pin !== pin) {
      return res.status(401).json({
        success: false,
        message: 'Ungültiges Kennzeichen oder PIN',
      });
    }

    // PIN aus Response entfernen
    const { pin: _, ...fahrzeugOhnePin } = fahrzeug;

    return res.status(200).json({
      success: true,
      fahrzeug: fahrzeugOhnePin,
    });
  } catch (error) {
    console.error('Fehler beim Fahrer-Login:', error);
    return res.status(500).json({
      success: false,
      message: 'Interner Serverfehler',
    });
  }
}
