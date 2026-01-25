# 🚀 AutoLogic - Vercel + Firebase Deployment Guide

## 📋 Übersicht

Dieser Guide zeigt, wie AutoLogic mit **Firebase Firestore** (Datenbank) und **Vercel** (Hosting + Serverless Functions) deployed wird.

## 🏗️ Architektur

```
Frontend-Admin (Vercel)  ──┐
                           ├──> Vercel Serverless Functions ──> Firebase Firestore
Frontend-Driver (Vercel) ──┘
```

## ✅ Voraussetzungen

- [ ] GitHub Repository mit dem Code
- [ ] Firebase Account ([firebase.google.com](https://firebase.google.com/))
- [ ] Vercel Account ([vercel.com](https://vercel.com/))

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
4. Öffne die JSON-Datei und kopiere den **kompletten Inhalt**

### 3. Daten von SQLite zu Firestore migrieren

**Lokal (vor dem Deployment):**

```bash
cd backend
npm install firebase-admin

# Setze Environment Variable (temporär für Migration)
export FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'  # Komplette JSON hier einfügen

# Oder erstelle .env Datei:
# FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

# Führe Migration aus
npx tsx src/scripts/migrate-to-firestore.ts
```

**Alternativ:** Manuell in Firebase Console importieren (siehe Schritt 4)

### 4. Firebase Firestore Sicherheitsregeln

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
    match /schadensmeldungen/{schadenId} {
      allow read: if true;
      allow write: if true; // Für Start, später mit Auth
    }
    
    match /wartungsmeldungen/{wartungId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

### 5. Vercel Projekt erstellen

1. Gehe zu [Vercel](https://vercel.com/)
2. Melde dich mit GitHub an
3. Klicke auf "Add New..." → "Project"
4. Importiere dein GitHub Repository

### 6. Vercel Konfiguration

Vercel erkennt automatisch die Struktur:
- **API Routes**: `/api/**/*.ts` → Serverless Functions
- **Frontend-Admin**: `frontend-admin/` → Static Site
- **Frontend-Driver**: `frontend-driver/` → Static Site

### 7. Environment Variables in Vercel setzen

In Vercel Dashboard → Project Settings → Environment Variables:

#### Für alle Environments (Production, Preview, Development):

**Firebase Credentials (Option 1 - Empfohlen):**
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

**ODER einzeln (Option 2):**
```
FIREBASE_PROJECT_ID=dein-projekt-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@xxxxx.iam.gserviceaccount.com
```

**Für Frontend-Admin:**
```
VITE_API_URL=https://[dein-vercel-url].vercel.app/api
```

**Für Frontend-Driver:**
```
VITE_API_URL=https://[dein-vercel-url].vercel.app/api
```

### 8. Deploy auf Vercel

1. Klicke auf "Deploy"
2. Warte auf erfolgreiches Deployment
3. Notiere dir die URLs:
   - **API**: `https://[projekt-name].vercel.app/api`
   - **Admin**: `https://[projekt-name].vercel.app/admin` oder Root
   - **Driver**: `https://[projekt-name].vercel.app/driver`

### 9. Firestore Indexes erstellen (optional, für Performance)

In Firebase Console → Firestore → Indexes:

Erstelle Composite Indexes für:
- `fahrzeuge`: `kennzeichen` (Ascending)
- `schadensmeldungen`: `fahrzeugId` (Ascending), `datum` (Descending)
- `wartungsmeldungen`: `fahrzeugId` (Ascending), `datum` (Descending)

## 📁 Projekt-Struktur

```
autologic/
├── api/                          # Vercel Serverless Functions
│   ├── lib/
│   │   └── firestore.ts         # Firebase Integration
│   ├── fahrzeuge/
│   │   ├── index.ts             # GET, POST /api/fahrzeuge
│   │   ├── [id].ts              # GET, PUT, DELETE /api/fahrzeuge/:id
│   │   └── [id]/upload-image.ts # POST /api/fahrzeuge/:id/upload-image
│   └── fahrer/
│       ├── login.ts
│       ├── km-stand.ts
│       ├── schaden.ts
│       ├── wartung.ts
│       └── reifen-profiltiefe.ts
├── frontend-admin/               # React Admin App (Vercel)
├── frontend-driver/              # React Driver App (Vercel)
├── backend/                     # Backend-Code (für lokale Entwicklung)
└── vercel.json                  # Vercel Konfiguration
```

## 🎯 Vorteile dieser Architektur

✅ **Vercel:**
- Automatisches HTTPS
- Global CDN
- Serverless Functions (kostenlos bis zu bestimmten Limits)
- Einfaches Deployment via Git
- Automatische Deployments bei Git Push

✅ **Firebase Firestore:**
- Echtzeit-Updates
- Skalierbar
- Automatische Backups
- Einfache Queries
- Keine Server-Verwaltung

✅ **Kosten:**
- Vercel: Kostenlos bis ~100GB Bandbreite/Monat
- Firebase: Kostenlos bis 50.000 Reads/Tag, 20.000 Writes/Tag

## 🚨 Wichtige Hinweise

1. **Environment Variables:** Niemals in Git committen!
2. **Firebase Rules:** Für Produktion Auth implementieren
3. **CORS:** Vercel Functions erlauben standardmäßig alle Origins (siehe Code)
4. **Cold Starts:** Serverless Functions haben einen kurzen Cold Start (~100-500ms)
5. **Firestore Indexes:** Erstelle Composite Indexes für bessere Performance

## 📚 Nächste Schritte

Nach erfolgreichem Deployment:

1. ✅ Custom Domain in Vercel hinzufügen
2. ✅ Firebase Authentication einrichten (optional)
3. ✅ Monitoring mit Vercel Analytics
4. ✅ Firestore Indexes für Performance optimieren
5. ✅ Backup-Strategie für Firestore einrichten

## 🆘 Troubleshooting

**Problem:** CORS Fehler
- Lösung: CORS ist bereits in den Functions konfiguriert

**Problem:** Firebase Connection Error
- Lösung: Environment Variables prüfen, Service Account korrekt?
- Prüfe Vercel Logs: `vercel logs` oder im Dashboard

**Problem:** Cold Start zu langsam
- Lösung: Keep-alive pings oder Pro-Version von Vercel

**Problem:** Firestore Permission Denied
- Lösung: Firestore Security Rules prüfen

**Problem:** Daten fehlen nach Migration
- Lösung: Prüfe Firestore Console, führe Migration erneut aus

## 🔄 Daten-Migration

Falls du bereits Daten in SQLite hast:

1. Führe das Migration-Script lokal aus (siehe Schritt 3)
2. Oder exportiere SQLite-Daten als JSON und importiere manuell in Firestore
3. Prüfe die Daten in Firebase Console

## 📝 API Endpoints

Nach dem Deployment sind folgende Endpoints verfügbar:

- `GET /api/fahrzeuge` - Alle Fahrzeuge
- `GET /api/fahrzeuge/:id` - Einzelnes Fahrzeug
- `POST /api/fahrzeuge` - Neues Fahrzeug
- `PUT /api/fahrzeuge/:id` - Fahrzeug aktualisieren
- `DELETE /api/fahrzeuge/:id` - Fahrzeug löschen
- `POST /api/fahrzeuge/:id/upload-image` - Bild hochladen
- `POST /api/fahrer/login` - Fahrer-Login
- `POST /api/fahrer/km-stand` - KM-Stand aktualisieren
- `POST /api/fahrer/schaden` - Schadensmeldung erstellen
- `POST /api/fahrer/wartung` - Wartungsmeldung erstellen
- `GET /api/fahrer/schaden/:fahrzeugId` - Schäden für Fahrzeug
- `GET /api/fahrer/wartung/:fahrzeugId` - Wartungen für Fahrzeug
- `PUT /api/fahrer/schaden/:id` - Schadensmeldung Status aktualisieren
- `PUT /api/fahrer/wartung/:id` - Wartungsmeldung Status aktualisieren
- `POST /api/fahrer/reifen-profiltiefe` - Reifen-Profiltiefe aktualisieren
