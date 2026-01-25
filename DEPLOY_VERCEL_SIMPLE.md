# AutoLogic - Einfaches Vercel Deployment (ohne Migration)

## 📋 Übersicht

Diese Anleitung zeigt, wie AutoLogic **ohne Datenbank-Migration** auf Vercel deployed wird:
- **Frontends** (Admin + Driver) → Vercel
- **Backend** → Railway.app oder Render.com (mit SQLite)

## 🏗️ Architektur

```
Frontend-Admin (Vercel)  ──┐
                           ├──> Backend API (Railway/Render) ──> SQLite
Frontend-Driver (Vercel) ──┘
```

## 🚀 Schritt-für-Schritt Anleitung

### 1. Backend auf Railway.app deployen (Empfohlen)

#### Railway Account erstellen:
1. Gehe zu [Railway.app](https://railway.app/)
2. Melde dich mit GitHub an
3. Klicke auf "New Project"
4. Wähle "Deploy from GitHub repo"
5. Wähle dein Repository aus

#### Backend konfigurieren:
1. Railway erkennt automatisch das `backend/` Verzeichnis
2. Setze **Root Directory** auf `backend`
3. Railway erkennt automatisch Node.js und installiert Dependencies
4. Setze **Start Command**: `npm start`
5. Railway erstellt automatisch eine URL (z.B. `https://autologic-backend.railway.app`)

#### Environment Variables (optional):
- `PORT`: Wird automatisch von Railway gesetzt
- `DATABASE_PATH`: `/tmp/database.sqlite` (für Railway)

### 2. Backend auf Render.com deployen (Alternative)

#### Render Account erstellen:
1. Gehe zu [Render.com](https://render.com/)
2. Melde dich mit GitHub an
3. Klicke auf "New +" → "Web Service"
4. Verbinde dein GitHub Repository

#### Backend konfigurieren:
- **Name**: `autologic-backend`
- **Environment**: `Node`
- **Build Command**: `cd backend && npm install && npm run build`
- **Start Command**: `cd backend && npm start`
- **Root Directory**: `backend`

### 3. Frontend-Admin auf Vercel deployen

#### Vercel Account erstellen:
1. Gehe zu [Vercel](https://vercel.com/)
2. Melde dich mit GitHub an
3. Klicke auf "Add New..." → "Project"
4. Importiere dein GitHub Repository

#### Projekt konfigurieren:
- **Framework Preset**: Vite
- **Root Directory**: `frontend-admin`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### Environment Variables:
```
VITE_API_URL=https://[dein-backend-url].railway.app/api
```
(z.B. `https://autologic-backend.railway.app/api`)

### 4. Frontend-Driver auf Vercel deployen

Wiederhole Schritt 3, aber:
- **Root Directory**: `frontend-driver`
- **Project Name**: `autologic-driver` (oder ähnlich)

#### Environment Variables:
```
VITE_API_URL=https://[dein-backend-url].railway.app/api
```

### 5. CORS im Backend konfigurieren

Stelle sicher, dass CORS die Vercel-Domains erlaubt:

```typescript
// backend/src/index.ts
app.use(cors({
  origin: [
    'https://autologic-admin.vercel.app',
    'https://autologic-driver.vercel.app',
    'http://localhost:5173', // für lokale Entwicklung
    'http://localhost:5174'
  ],
  credentials: true
}));
```

## 📁 Projekt-Struktur

```
autologic/
├── backend/              # → Railway/Render
│   ├── src/
│   ├── database.sqlite   # Wird auf dem Server erstellt
│   └── package.json
├── frontend-admin/       # → Vercel
│   ├── src/
│   └── vercel.json
└── frontend-driver/      # → Vercel
    ├── src/
    └── vercel.json
```

## ✅ Vorteile dieser Lösung

- ✅ **Keine Datenbank-Migration nötig** - SQLite funktioniert weiterhin
- ✅ **Schnelles Deployment** - Frontends in Minuten live
- ✅ **Kostenlos** - Alle drei Services haben kostenlose Tiers
- ✅ **Einfach zu warten** - Keine komplexe Konfiguration

## 💰 Kosten

- **Vercel**: Kostenlos bis 100GB Bandbreite/Monat
- **Railway**: Kostenlos bis $5/Monat Credit (meist ausreichend)
- **Render**: Kostenlos mit Einschränkungen (schlafende Services nach 15 Min)

## 🔧 Troubleshooting

### Problem: CORS Fehler
**Lösung**: Stelle sicher, dass die Vercel-URLs in der CORS-Konfiguration sind

### Problem: Backend nicht erreichbar
**Lösung**: Prüfe die Railway/Render URL und Environment Variables

### Problem: Datenbank wird zurückgesetzt
**Lösung**: Railway/Render behalten Daten bei, aber bei Neustarts kann die DB verloren gehen. Für Produktion: PostgreSQL auf Railway verwenden.

## 📚 Nächste Schritte

1. ✅ Custom Domains in Vercel hinzufügen
2. ✅ Monitoring einrichten
3. ✅ Für Produktion: PostgreSQL statt SQLite (Railway bietet PostgreSQL)

## 🆘 Hilfe

- Railway Docs: https://docs.railway.app/
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
