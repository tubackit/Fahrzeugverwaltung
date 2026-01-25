# 🚀 Quick Start: Firebase + Vercel Deployment

## ⚡ Schnellstart (5 Minuten)

### 1. Firebase einrichten (2 Min)

```bash
# 1. Gehe zu https://console.firebase.google.com/
# 2. Neues Projekt erstellen: "autologic"
# 3. Firestore aktivieren → Produktionsmodus → Region: europe-west3
# 4. Service Account erstellen:
#    - Einstellungen (⚙️) → Service Accounts
#    - "Neuer privater Schlüssel generieren"
#    - JSON-Datei herunterladen (serviceAccountKey.json)
```

### 2. Vercel CLI installieren (1 Min)

```bash
npm i -g vercel
vercel login
```

### 3. Projekte deployen (2 Min)

```bash
# Im Root-Verzeichnis
cd frontend-admin
vercel --prod

# In neuem Terminal
cd frontend-driver  
vercel --prod
```

### 4. Environment Variables setzen

**In Vercel Dashboard für jedes Projekt:**

1. Gehe zu Projekt → Settings → Environment Variables

2. **Frontend-Admin & Frontend-Driver:**
   ```
   VITE_API_URL = https://[dein-backend-url].vercel.app
   ```

3. **Backend (wenn als Functions deployt):**
   ```
   FIREBASE_PROJECT_ID = dein-projekt-id
   FIREBASE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\n..."
   FIREBASE_CLIENT_EMAIL = firebase-adminsdk-...@...
   ```

## 📝 Wichtige Dateien

- ✅ `DEPLOY_FIREBASE_VERCEL.md` - Vollständige Anleitung
- ✅ `vercel.json` - Vercel Konfiguration
- ✅ `backend/src/db/firestore.ts` - Firebase Helper Functions
- ✅ `api/hello.ts` - Beispiel Vercel Function

## 🔄 Nächste Schritte

1. **Backend migrieren:** SQLite → Firestore (siehe `backend/src/db/firestore.ts`)
2. **API Routes:** Als Vercel Functions in `/api/` erstellen
3. **Daten migrieren:** SQLite Export → Firestore Import

## 💡 Tipps

- ✅ Vercel bietet kostenloses Hosting bis ~100GB/Monat
- ✅ Firebase Firestore kostenlos bis 50K Reads/Tag
- ✅ Automatische HTTPS & CDN
- ✅ Deployment bei jedem Git Push

## 🆘 Hilfe

Siehe `DEPLOY_FIREBASE_VERCEL.md` für detaillierte Anleitung!


