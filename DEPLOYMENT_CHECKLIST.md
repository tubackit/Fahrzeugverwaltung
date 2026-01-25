# 🚀 AutoLogic - Deployment Checkliste

## ✅ Vorbereitung

### 1. GitHub Repository
- [ ] Code ist auf GitHub gepusht
- [ ] Repository ist öffentlich oder Vercel/Railway haben Zugriff

### 2. Backend auf Railway.app deployen

#### Railway Setup:
1. [ ] Gehe zu [railway.app](https://railway.app/) und melde dich mit GitHub an
2. [ ] Klicke auf "New Project" → "Deploy from GitHub repo"
3. [ ] Wähle dein Repository aus
4. [ ] Setze **Root Directory** auf `backend`
5. [ ] Railway erkennt automatisch Node.js
6. [ ] Setze **Start Command**: `npm start`
7. [ ] Warte auf erfolgreiches Deployment
8. [ ] Kopiere die **Public URL** (z.B. `https://autologic-backend.railway.app`)

#### Environment Variables (optional):
- `DATABASE_PATH`: `/tmp/database.sqlite` (für Railway)
- `NODE_ENV`: `production`

### 3. Frontend-Admin auf Vercel deployen

#### Vercel Setup:
1. [ ] Gehe zu [vercel.com](https://vercel.com/) und melde dich mit GitHub an
2. [ ] Klicke auf "Add New..." → "Project"
3. [ ] Importiere dein GitHub Repository
4. [ ] Konfiguriere das Projekt:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend-admin`
   - **Build Command**: `npm run build` (automatisch erkannt)
   - **Output Directory**: `dist` (automatisch erkannt)
5. [ ] Setze **Environment Variables**:
   - `VITE_API_URL`: `https://[dein-railway-url].railway.app/api`
     (z.B. `https://autologic-backend.railway.app/api`)
6. [ ] Klicke auf "Deploy"
7. [ ] Warte auf erfolgreiches Deployment
8. [ ] Kopiere die **Deployment URL** (z.B. `https://autologic-admin.vercel.app`)

### 4. Frontend-Driver auf Vercel deployen

#### Vercel Setup:
1. [ ] Gehe zu [vercel.com](https://vercel.com/)
2. [ ] Klicke auf "Add New..." → "Project"
3. [ ] Importiere das gleiche GitHub Repository
4. [ ] Konfiguriere das Projekt:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend-driver`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. [ ] Setze **Environment Variables**:
   - `VITE_API_URL`: `https://[dein-railway-url].railway.app/api`
     (muss identisch mit Frontend-Admin sein)
6. [ ] Klicke auf "Deploy"
7. [ ] Warte auf erfolgreiches Deployment
8. [ ] Kopiere die **Deployment URL** (z.B. `https://autologic-driver.vercel.app`)

### 5. CORS im Backend aktualisieren (optional)

Falls CORS-Fehler auftreten, aktualisiere die CORS-Konfiguration im Backend:

```typescript
// backend/src/index.ts
// Die CORS-Konfiguration erlaubt bereits alle *.vercel.app Domains
// Falls nötig, füge spezifische URLs hinzu:
const allowedOrigins = [
  'https://autologic-admin.vercel.app',
  'https://autologic-driver.vercel.app',
  // ... weitere URLs
];
```

## 🧪 Testing

### Nach dem Deployment:
- [ ] Frontend-Admin öffnen und testen
- [ ] Frontend-Driver öffnen und testen
- [ ] Login im Driver-Portal testen
- [ ] Fahrzeugdaten anzeigen und bearbeiten testen
- [ ] Schadensmeldung erstellen testen
- [ ] Wartungsmeldung erstellen testen

## 🔧 Troubleshooting

### Problem: CORS Fehler
**Lösung**: 
- Prüfe, ob die Vercel-URLs in der CORS-Konfiguration erlaubt sind
- Die aktuelle Konfiguration erlaubt alle `*.vercel.app` Domains automatisch

### Problem: API nicht erreichbar
**Lösung**:
- Prüfe die `VITE_API_URL` Environment Variable in Vercel
- Stelle sicher, dass die Railway-URL korrekt ist (mit `/api` am Ende)
- Prüfe Railway-Logs auf Fehler

### Problem: Datenbank wird zurückgesetzt
**Lösung**:
- Railway behält Daten bei, aber bei Neustarts kann die DB verloren gehen
- Für Produktion: Verwende PostgreSQL auf Railway (kostenlos verfügbar)

## 📝 URLs notieren

Nach erfolgreichem Deployment, notiere dir:

- **Backend URL**: `https://________________.railway.app`
- **Admin Frontend**: `https://________________.vercel.app`
- **Driver Frontend**: `https://________________.vercel.app`

## 🎉 Fertig!

Deine Anwendung sollte jetzt live sein! 🚀
