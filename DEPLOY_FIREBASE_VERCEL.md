# AutoLogic - Firebase + Vercel Deployment Guide

## 📋 Übersicht

Dieser Guide zeigt, wie AutoLogic mit **Firebase Firestore** (Datenbank) und **Vercel** (Hosting + Serverless Functions) online gebracht wird.

## 🏗️ Architektur

```
Frontend-Admin (Vercel)  ──┐
                           ├──> Vercel Serverless Functions ──> Firebase Firestore
Frontend-Driver (Vercel) ──┘
```

## 🚀 Schritt-für-Schritt Anleitung

### 1. Firebase Projekt einrichten

1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Klicke auf "Projekt hinzufügen"
3. Gib dem Projekt einen Namen (z.B. "autologic")
4. **Firestore aktivieren:**
   - Im Firebase Console → Firestore Database
   - Klicke auf "Erstellen"
   - Wähle "Produktionsmodus"
   - Wähle eine Region (z.B. `europe-west3` für Frankfurt)

### 2. Firebase Service Account erstellen

1. Firebase Console → Projekt-Einstellungen (⚙️) → Service Accounts
2. Klicke auf "Neuer privater Schlüssel generieren"
3. Lade die JSON-Datei herunter → **WICHTIG: Sicher aufbewahren!**
4. Inhalt der JSON-Datei wird später als Environment Variable benötigt

### 3. Firebase Admin SDK installieren

```bash
cd backend
npm install firebase-admin
```

### 4. Vercel Account einrichten

1. Gehe zu [Vercel](https://vercel.com/)
2. Melde dich mit GitHub an
3. Installiere die Vercel CLI (optional):
```bash
npm i -g vercel
```

### 5. Vercel Projekte erstellen

#### Frontend-Admin auf Vercel deployen:

```bash
cd frontend-admin

# Vercel CLI Login
vercel login

# Projekt deployen
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? [Your account]
# - Link to existing project? No
# - Project name? autologic-admin (or your choice)
# - Directory? ./
# - Override settings? No
```

#### Frontend-Driver auf Vercel deployen:

```bash
cd frontend-driver

# Projekt deployen
vercel

# Follow the prompts:
# - Project name? autologic-driver (or your choice)
```

### 6. Backend als Vercel Serverless Functions

Das Backend wird als Vercel Serverless Functions deployt. Erstelle die notwendigen Dateien:

```bash
# Im Root-Verzeichnis
mkdir -p api
```

### 7. Environment Variables setzen

In der Vercel Console für jedes Projekt:

**Frontend-Admin & Frontend-Driver:**
```
VITE_API_URL=https://[dein-vercel-backend-url].vercel.app/api
```

**Backend (Vercel Functions):**
```
FIREBASE_SERVICE_ACCOUNT=[Inhalt der Firebase Service Account JSON als String]
```

**Oder einzeln:**
```
FIREBASE_PROJECT_ID=dein-projekt-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...
```

### 8. Firebase Firestore Sicherheitsregeln

In Firebase Console → Firestore → Regeln:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Alle Fahrzeuge lesen
    match /fahrzeuge/{fahrzeugId} {
      allow read: if true;
      allow write: if request.auth != null; // Oder ohne Auth für Start
    }
    
    // Schäden und Wartungen
    match /schaden/{schadenId} {
      allow read: if true;
      allow write: if true; // Für Start, später mit Auth
    }
    
    match /wartung/{wartungId} {
      allow read: if true;
      allow write: if true;
    }
    
    // Fahrer
    match /fahrer/{fahrerId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 📁 Projekt-Struktur nach Migration

```
autologic/
├── api/                    # Vercel Serverless Functions
│   └── [route].ts         # API Routes als Functions
├── frontend-admin/         # React Admin App (Vercel)
├── frontend-driver/        # React Driver App (Vercel)
├── backend/               # Backend-Code (für Migration)
├── shared/                # Shared Types
└── vercel.json            # Vercel Konfiguration
```

## 🔄 Migration von SQLite zu Firestore

Die vorhandenen SQLite-Daten können exportiert und in Firestore importiert werden:

1. SQLite Daten exportieren (als JSON)
2. Import-Script ausführen (siehe `scripts/firestore-import.ts`)
3. Daten validieren in Firebase Console

## 🎯 Vorteile dieser Architektur

✅ **Vercel:**
- Automatisches HTTPS
- Global CDN
- Serverless Functions (kostenlos bis zu bestimmten Limits)
- Einfaches Deployment via Git

✅ **Firebase Firestore:**
- Echtzeit-Updates
- Skalierbar
- Automatische Backups
- Einfache Queries

✅ **Kosten:**
- Vercel: Kostenlos bis ~100GB Bandbreite/Monat
- Firebase: Kostenlos bis 50.000 Reads/Tag, 20.000 Writes/Tag

## 🚨 Wichtige Hinweise

1. **Environment Variables:** Niemals in Git committen!
2. **Firebase Rules:** Für Produktion Auth implementieren
3. **CORS:** Vercel Functions erlauben standardmäßig alle Origins
4. **Cold Starts:** Serverless Functions haben einen kurzen Cold Start

## 📚 Nächste Schritte

Nach erfolgreichem Deployment:

1. ✅ Custom Domain in Vercel hinzufügen
2. ✅ Firebase Authentication einrichten (optional)
3. ✅ Monitoring mit Vercel Analytics
4. ✅ Firestore Indexes für Performance optimieren

## 🆘 Troubleshooting

**Problem:** CORS Fehler
- Lösung: CORS in Vercel Functions konfigurieren

**Problem:** Firebase Connection Error
- Lösung: Environment Variables prüfen, Service Account korrekt?

**Problem:** Cold Start zu langsam
- Lösung: Keep-alive pings oder Pro-Version von Vercel


