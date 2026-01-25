/**
 * Firebase Firestore Integration für Vercel Serverless Functions
 */

import admin from 'firebase-admin';

let firestore: admin.firestore.Firestore | null = null;

/**
 * Initialisiert Firebase Admin SDK
 */
export const initFirestore = (): admin.firestore.Firestore => {
  if (firestore) {
    return firestore;
  }

  // Prüfe ob bereits initialisiert
  if (admin.apps.length > 0) {
    firestore = admin.firestore();
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
    } else {
      throw new Error('Firebase credentials nicht gefunden. Setze FIREBASE_SERVICE_ACCOUNT oder einzelne Variablen.');
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
 * Helper: Konvertiert Firestore Timestamp zu String
 */
const convertTimestamp = (value: any): any => {
  if (value && typeof value.toDate === 'function') {
    return value.toDate().toISOString();
  }
  return value;
};

/**
 * Helper: Konvertiert Firestore Document zu Objekt
 */
export const convertFirestoreDoc = (doc: admin.firestore.DocumentSnapshot): any => {
  const data = doc.data();
  if (!data) return null;

  const result: any = { id: doc.id };
  Object.entries(data).forEach(([key, value]) => {
    result[key] = convertTimestamp(value);
  });
  return result;
};

/**
 * Helper: Bereinigt Daten für Firestore (entfernt undefined, konvertiert leere Strings zu null)
 */
export const cleanDataForFirestore = (data: any): any => {
  const cleaned: any = {};
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'id' || key === 'createdAt') return; // id wird als Document-ID verwendet
    if (value === undefined) return;
    if (value === '') {
      cleaned[key] = null;
    } else {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

// ========== FAHRZEUGE ==========

export const getAllFahrzeuge = async (): Promise<any[]> => {
  const db = getFirestore();
  try {
    const snapshot = await db
      .collection('fahrzeuge')
      .orderBy('kennzeichen')
      .get();

    return snapshot.docs.map((doc) => convertFirestoreDoc(doc));
  } catch (error: any) {
    // Falls Index fehlt, hole alle und sortiere manuell
    if (error.code === 9) { // FAILED_PRECONDITION = Index fehlt
      console.warn('Firestore Index fehlt für fahrzeuge. Verwende Query ohne orderBy.');
      const snapshot = await db.collection('fahrzeuge').get();
      const docs = snapshot.docs.map((doc) => convertFirestoreDoc(doc));
      return docs.sort((a, b) => {
        const kennzeichenA = a.kennzeichen || '';
        const kennzeichenB = b.kennzeichen || '';
        return kennzeichenA.localeCompare(kennzeichenB);
      });
    }
    throw error;
  }
};

export const getFahrzeugById = async (id: string): Promise<any | null> => {
  const db = getFirestore();
  const doc = await db.collection('fahrzeuge').doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return convertFirestoreDoc(doc);
};

export const getFahrzeugByKennzeichen = async (kennzeichen: string): Promise<any | null> => {
  const db = getFirestore();
  const snapshot = await db
    .collection('fahrzeuge')
    .where('kennzeichen', '==', kennzeichen)
    .limit(1)
    .get();

  if (snapshot.empty) {
    return null;
  }

  return convertFirestoreDoc(snapshot.docs[0]);
};

export const createFahrzeug = async (data: any): Promise<string> => {
  const db = getFirestore();
  const cleaned = cleanDataForFirestore(data);
  
  const docRef = await db.collection('fahrzeuge').add({
    ...cleaned,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return docRef.id;
};

export const updateFahrzeug = async (id: string, data: any): Promise<void> => {
  const db = getFirestore();
  const cleaned = cleanDataForFirestore(data);
  
  await db.collection('fahrzeuge').doc(id).update({
    ...cleaned,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
};

export const deleteFahrzeug = async (id: string): Promise<void> => {
  const db = getFirestore();
  await db.collection('fahrzeuge').doc(id).delete();
};

// ========== SCHADENSMELDUNGEN ==========

export const getSchadensmeldungenByFahrzeugId = async (fahrzeugId: string): Promise<any[]> => {
  const db = getFirestore();
  // Konvertiere fahrzeugId zu String für Vergleich (kann Number oder String sein)
  const fahrzeugIdStr = String(fahrzeugId);
  
  try {
    const snapshot = await db
      .collection('schadensmeldungen')
      .where('fahrzeugId', '==', fahrzeugIdStr)
      .orderBy('datum', 'desc')
      .get();

    return snapshot.docs.map((doc) => convertFirestoreDoc(doc));
  } catch (error: any) {
    // Falls Index fehlt, versuche ohne orderBy
    if (error.code === 9) { // FAILED_PRECONDITION = Index fehlt
      console.warn('Firestore Index fehlt für schadensmeldungen. Verwende Query ohne orderBy.');
      const snapshot = await db
        .collection('schadensmeldungen')
        .where('fahrzeugId', '==', fahrzeugIdStr)
        .get();
      
      // Sortiere manuell
      const docs = snapshot.docs.map((doc) => convertFirestoreDoc(doc));
      return docs.sort((a, b) => {
        const dateA = a.datum ? new Date(a.datum).getTime() : 0;
        const dateB = b.datum ? new Date(b.datum).getTime() : 0;
        return dateB - dateA; // Descending
      });
    }
    throw error;
  }
};

export const getAllSchadensmeldungen = async (): Promise<any[]> => {
  const db = getFirestore();
  const snapshot = await db
    .collection('schadensmeldungen')
    .orderBy('datum', 'desc')
    .get();

  return snapshot.docs.map((doc) => convertFirestoreDoc(doc));
};

export const createSchadensmeldung = async (data: any): Promise<string> => {
  const db = getFirestore();
  const cleaned = cleanDataForFirestore(data);
  
  // Stelle sicher, dass fahrzeugId als String gespeichert wird
  if (cleaned.fahrzeugId !== undefined) {
    cleaned.fahrzeugId = String(cleaned.fahrzeugId);
  }
  
  const docRef = await db.collection('schadensmeldungen').add({
    ...cleaned,
    status: cleaned.status || 'Gemeldet',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return docRef.id;
};

export const updateSchadensmeldung = async (id: string, data: any): Promise<void> => {
  const db = getFirestore();
  const cleaned = cleanDataForFirestore(data);
  
  await db.collection('schadensmeldungen').doc(id).update({
    ...cleaned,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
};

export const getSchadensmeldungById = async (id: string): Promise<any | null> => {
  const db = getFirestore();
  const doc = await db.collection('schadensmeldungen').doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return convertFirestoreDoc(doc);
};

// ========== WARTUNGSMELDUNGEN ==========

export const getWartungsmeldungenByFahrzeugId = async (fahrzeugId: string): Promise<any[]> => {
  const db = getFirestore();
  // Konvertiere fahrzeugId zu String für Vergleich (kann Number oder String sein)
  const fahrzeugIdStr = String(fahrzeugId);
  
  try {
    const snapshot = await db
      .collection('wartungsmeldungen')
      .where('fahrzeugId', '==', fahrzeugIdStr)
      .orderBy('datum', 'desc')
      .get();

    return snapshot.docs.map((doc) => convertFirestoreDoc(doc));
  } catch (error: any) {
    // Falls Index fehlt, versuche ohne orderBy
    if (error.code === 9) { // FAILED_PRECONDITION = Index fehlt
      console.warn('Firestore Index fehlt für wartungsmeldungen. Verwende Query ohne orderBy.');
      const snapshot = await db
        .collection('wartungsmeldungen')
        .where('fahrzeugId', '==', fahrzeugIdStr)
        .get();
      
      // Sortiere manuell
      const docs = snapshot.docs.map((doc) => convertFirestoreDoc(doc));
      return docs.sort((a, b) => {
        const dateA = a.datum ? new Date(a.datum).getTime() : 0;
        const dateB = b.datum ? new Date(b.datum).getTime() : 0;
        return dateB - dateA; // Descending
      });
    }
    throw error;
  }
};

export const getAllWartungsmeldungen = async (): Promise<any[]> => {
  const db = getFirestore();
  const snapshot = await db
    .collection('wartungsmeldungen')
    .orderBy('datum', 'desc')
    .get();

  return snapshot.docs.map((doc) => convertFirestoreDoc(doc));
};

export const createWartungsmeldung = async (data: any): Promise<string> => {
  const db = getFirestore();
  const cleaned = cleanDataForFirestore(data);
  
  // Stelle sicher, dass fahrzeugId als String gespeichert wird
  if (cleaned.fahrzeugId !== undefined) {
    cleaned.fahrzeugId = String(cleaned.fahrzeugId);
  }
  
  const docRef = await db.collection('wartungsmeldungen').add({
    ...cleaned,
    status: cleaned.status || 'Gemeldet',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return docRef.id;
};

export const updateWartungsmeldung = async (id: string, data: any): Promise<void> => {
  const db = getFirestore();
  const cleaned = cleanDataForFirestore(data);
  
  await db.collection('wartungsmeldungen').doc(id).update({
    ...cleaned,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
};

export const getWartungsmeldungById = async (id: string): Promise<any | null> => {
  const db = getFirestore();
  const doc = await db.collection('wartungsmeldungen').doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return convertFirestoreDoc(doc);
};
