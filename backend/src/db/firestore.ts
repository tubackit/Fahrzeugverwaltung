/**
 * Firebase Firestore Integration Layer
 * 
 * Diese Datei dient als Wrapper zwischen SQLite und Firestore.
 * 
 * Migrations-Schritte:
 * 1. Installiere firebase-admin: npm install firebase-admin
 * 2. Erstelle Firebase-Projekt und Service Account
 * 3. Setze Environment Variables (siehe DEPLOY_FIREBASE_VERCEL.md)
 * 4. Ersetze getDatabase() Aufrufe durch getFirestore()
 */

import admin from 'firebase-admin';

let firestore: admin.firestore.Firestore | null = null;

/**
 * Initialisiert Firebase Admin SDK
 * 
 * Environment Variables benötigt:
 * - FIREBASE_PROJECT_ID
 * - FIREBASE_PRIVATE_KEY
 * - FIREBASE_CLIENT_EMAIL
 * 
 * ODER:
 * - FIREBASE_SERVICE_ACCOUNT (komplette JSON als String)
 */
export const initFirestore = (): admin.firestore.Firestore => {
  if (firestore) {
    return firestore;
  }

  try {
    // Option 1: Service Account JSON als Environment Variable
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    // Option 2: Einzelne Environment Variables
    else if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_PRIVATE_KEY &&
      process.env.FIREBASE_CLIENT_EMAIL
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
    }
    // Option 3: Service Account JSON-Datei (für lokale Entwicklung)
    else {
      // Fallback: Versuche Service Account Datei zu laden
      const serviceAccount = require('../../serviceAccountKey.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    firestore = admin.firestore();
    console.log('✅ Firebase Firestore verbunden');

    return firestore;
  } catch (error) {
    console.error('❌ Fehler bei Firebase Initialisierung:', error);
    throw error;
  }
};

/**
 * Gibt Firestore Instanz zurück
 */
export const getFirestore = (): admin.firestore.Firestore => {
  if (!firestore) {
    return initFirestore();
  }
  return firestore;
};

/**
 * Helper: Konvertiert Firestore Document zu Fahrzeug
 */
export const convertFirestoreDocToFahrzeug = (
  doc: admin.firestore.DocumentSnapshot
): any => {
  const data = doc.data();
  if (!data) return null;

  return {
    id: parseInt(doc.id),
    ...data,
  };
};

/**
 * Helper: Konvertiert Fahrzeug zu Firestore Document
 */
export const convertFahrzeugToFirestore = (fahrzeug: any): any => {
  const { id, ...data } = fahrzeug;
  return data;
};

/**
 * Beispiel: Alle Fahrzeuge aus Firestore abrufen
 * 
 * Ersetzt: db.prepare('SELECT * FROM fahrzeuge ORDER BY kennzeichen').all()
 */
export const getAllFahrzeuge = async (): Promise<any[]> => {
  const db = getFirestore();
  const snapshot = await db
    .collection('fahrzeuge')
    .orderBy('kennzeichen')
    .get();

  return snapshot.docs.map((doc) => convertFirestoreDocToFahrzeug(doc));
};

/**
 * Beispiel: Einzelnes Fahrzeug abrufen
 * 
 * Ersetzt: db.prepare('SELECT * FROM fahrzeuge WHERE id = ?').get(id)
 */
export const getFahrzeugById = async (id: string): Promise<any | null> => {
  const db = getFirestore();
  const doc = await db.collection('fahrzeuge').doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return convertFirestoreDocToFahrzeug(doc);
};

/**
 * Beispiel: Fahrzeug erstellen
 * 
 * Ersetzt: db.prepare('INSERT INTO fahrzeuge ...').run(...)
 */
export const createFahrzeug = async (data: any): Promise<string> => {
  const db = getFirestore();
  const docRef = await db.collection('fahrzeuge').add({
    ...data,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return docRef.id;
};

/**
 * Beispiel: Fahrzeug aktualisieren
 * 
 * Ersetzt: db.prepare('UPDATE fahrzeuge SET ... WHERE id = ?').run(...)
 */
export const updateFahrzeug = async (id: string, data: any): Promise<void> => {
  const db = getFirestore();
  await db.collection('fahrzeuge').doc(id).update({
    ...data,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
};

/**
 * Beispiel: Fahrzeug löschen
 * 
 * Ersetzt: db.prepare('DELETE FROM fahrzeuge WHERE id = ?').run(id)
 */
export const deleteFahrzeug = async (id: string): Promise<void> => {
  const db = getFirestore();
  await db.collection('fahrzeuge').doc(id).delete();
};


