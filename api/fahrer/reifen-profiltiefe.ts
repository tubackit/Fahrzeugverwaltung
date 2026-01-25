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
    const { fahrzeugId, reifenArt, profiltiefen, kmStand } = req.body;

    if (!fahrzeugId || !reifenArt || !profiltiefen) {
      return res.status(400).json({ error: 'Fahrzeug-ID, Reifenart und Profiltiefen sind erforderlich' });
    }

    if (!['sommer', 'winter'].includes(reifenArt)) {
      return res.status(400).json({ error: 'Reifenart muss "sommer" oder "winter" sein' });
    }

    const fahrzeug = await getFahrzeugById(String(fahrzeugId));

    if (!fahrzeug) {
      return res.status(404).json({ error: 'Fahrzeug nicht gefunden' });
    }

    const { vl, vr, hl, hr } = profiltiefen;
    const suffix = reifenArt === 'sommer' ? 'Sommer' : 'Winter';

    const updateData: any = {};

    if (vl !== null && vl !== undefined) {
      updateData[`reifenProfiltiefeVL${suffix}`] = vl;
    }
    if (vr !== null && vr !== undefined) {
      updateData[`reifenProfiltiefeVR${suffix}`] = vr;
    }
    if (hl !== null && hl !== undefined) {
      updateData[`reifenProfiltiefeHL${suffix}`] = hl;
    }
    if (hr !== null && hr !== undefined) {
      updateData[`reifenProfiltiefeHR${suffix}`] = hr;
    }

    // Wenn kmStand vorhanden ist, auch reifenKmBeiMontage aktualisieren (falls nicht vorhanden)
    if (kmStand !== null && kmStand !== undefined) {
      const kmField = `reifenKmBeiMontage${suffix}`;
      if (!fahrzeug[kmField]) {
        updateData[kmField] = kmStand;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Keine Profiltiefen zum Aktualisieren' });
    }

    await updateFahrzeug(String(fahrzeugId), updateData);

    return res.status(200).json({ success: true, message: 'Profiltiefen erfolgreich aktualisiert' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Profiltiefen:', error);
    return res.status(500).json({ error: 'Interner Serverfehler' });
  }
}
