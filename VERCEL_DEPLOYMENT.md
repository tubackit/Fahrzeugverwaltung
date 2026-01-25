# 🚀 Vercel Deployment - Automatisiertes Setup

## 📋 Übersicht

Dieses Guide zeigt dir, wie du AutoLogic automatisch auf Vercel deployst und alle Environment Variables setzt.

---

## 🔧 Voraussetzungen

1. **Vercel CLI installieren:**
```bash
npm install -g vercel
```

2. **Bei Vercel einloggen:**
```bash
vercel login
```

3. **Firebase Service Account JSON bereit:**
   - Die Datei `autologic-99357-firebase-adminsdk-fbsvc-9afcc7dad8.json` sollte verfügbar sein

---

## 🚀 Automatisiertes Deployment

### Option 1: Mit dem Deployment-Script (Einfach)

1. **Script ausführbar machen:**
```bash
chmod +x deploy-vercel.sh
```

2. **Script ausführen:**
```bash
./deploy-vercel.sh
```

3. **Folge den Anweisungen:**
   - Script fragt nach dem Pfad zur Service Account JSON
   - Script deployt automatisch auf Vercel
   - Script setzt alle Environment Variables

---

## 📝 Manuelles Deployment (Schritt für Schritt)

### Schritt 1: Vercel CLI Login

```bash
vercel login
```

Folge den Anweisungen im Browser.

### Schritt 2: Projekt initialisieren

```bash
# Im Root-Verzeichnis des Projekts
vercel
```

**Antworte auf die Fragen:**
- Set up and deploy? → **Yes**
- Which scope? → Wähle deinen Account
- Link to existing project? → **No** (für erstes Deployment)
- Project name? → `autologic` (oder dein Wunschname)
- Directory? → **./** (Root-Verzeichnis)
- Override settings? → **No**

### Schritt 3: Service Account JSON vorbereiten

1. **Öffne die JSON-Datei:**
```bash
# Beispiel (passe den Pfad an)
cat ~/Downloads/autologic-99357-firebase-adminsdk-fbsvc-9afcc7dad8.json
```

2. **Kopiere den kompletten Inhalt**

3. **Konvertiere zu einer Zeile** (falls nötig):
```bash
# Mit jq (falls installiert)
cat autologic-99357-firebase-adminsdk-fbsvc-9afcc7dad8.json | jq -c .

# Oder manuell: Entferne Zeilenumbrüche, aber behalte \n im private_key
```

### Schritt 4: Environment Variables setzen

#### A) Firebase Service Account (für API Functions)

```bash
# Für Production
vercel env add FIREBASE_SERVICE_ACCOUNT production
# Füge dann die JSON ein (komplette JSON in einer Zeile)
# Drücke Enter, dann Strg+D (Mac) oder Strg+Z Enter (Windows)

# Für Preview
vercel env add FIREBASE_SERVICE_ACCOUNT preview
# Gleiche JSON einfügen

# Für Development
vercel env add FIREBASE_SERVICE_ACCOUNT development
# Gleiche JSON einfügen
```

#### B) API URL für Frontends

**Wichtig:** Du musst zuerst deployen, um die URL zu kennen!

```bash
# Hole die Deployment URL
DEPLOYMENT_URL=$(vercel ls --json | jq -r '.[0].url')
API_URL="${DEPLOYMENT_URL}/api"

# Für Frontend-Admin (Production)
vercel env add VITE_API_URL production frontend-admin
# Füge ein: https://[dein-projekt].vercel.app/api

# Für Frontend-Driver (Production)
vercel env add VITE_API_URL production frontend-driver
# Füge ein: https://[dein-projekt].vercel.app/api
```

**Oder manuell im Vercel Dashboard:**
1. Gehe zu [vercel.com](https://vercel.com/)
2. Wähle dein Projekt
3. Settings → Environment Variables
4. Füge hinzu:
   - `FIREBASE_SERVICE_ACCOUNT` = [komplette JSON]
   - `VITE_API_URL` = `https://[dein-projekt].vercel.app/api` (für beide Frontends)

### Schritt 5: Erneut deployen (damit Env Variables aktiv werden)

```bash
vercel --prod
```

---

## 🔍 Environment Variables Checkliste

Nach dem Setup sollten folgende Environment Variables gesetzt sein:

### Für API Functions (Root-Level):
- [ ] `FIREBASE_SERVICE_ACCOUNT` (Production)
- [ ] `FIREBASE_SERVICE_ACCOUNT` (Preview)
- [ ] `FIREBASE_SERVICE_ACCOUNT` (Development)

### Für Frontend-Admin:
- [ ] `VITE_API_URL` = `https://[projekt].vercel.app/api` (Production)
- [ ] `VITE_API_URL` = `https://[projekt].vercel.app/api` (Preview)
- [ ] `VITE_API_URL` = `https://[projekt].vercel.app/api` (Development)

### Für Frontend-Driver:
- [ ] `VITE_API_URL` = `https://[projekt].vercel.app/api` (Production)
- [ ] `VITE_API_URL` = `https://[projekt].vercel.app/api` (Preview)
- [ ] `VITE_API_URL` = `https://[projekt].vercel.app/api` (Development)

---

## 🧪 Testing

Nach dem Deployment:

1. **Prüfe die URLs:**
   - API: `https://[projekt].vercel.app/api/fahrzeuge`
   - Admin: `https://[projekt].vercel.app/admin`
   - Driver: `https://[projekt].vercel.app/driver`

2. **Teste die API:**
```bash
curl https://[projekt].vercel.app/api/fahrzeuge
```

3. **Prüfe Vercel Logs:**
```bash
vercel logs
```

---

## 🆘 Troubleshooting

### Problem: "vercel: command not found"
**Lösung:** Installiere Vercel CLI: `npm install -g vercel`

### Problem: "Not logged in"
**Lösung:** Führe `vercel login` aus

### Problem: Environment Variables werden nicht übernommen
**Lösung:** 
- Stelle sicher, dass du für alle Environments (Production, Preview, Development) gesetzt hast
- Deploye erneut: `vercel --prod`

### Problem: "Invalid JSON" bei FIREBASE_SERVICE_ACCOUNT
**Lösung:**
- Stelle sicher, dass die JSON in einer Zeile ist
- Die `\n` im `private_key` müssen erhalten bleiben
- Verwende `jq -c .` um JSON zu komprimieren

---

## 📚 Alternative: Vercel Dashboard

Falls die CLI nicht funktioniert, kannst du alles auch im Vercel Dashboard machen:

1. Gehe zu [vercel.com](https://vercel.com/)
2. Klicke auf "Add New..." → "Project"
3. Importiere dein GitHub Repository
4. Vercel erkennt automatisch die Struktur
5. Gehe zu Settings → Environment Variables
6. Füge die Variablen manuell hinzu

---

## ✅ Nach dem Deployment

1. ✅ Prüfe, ob alle URLs funktionieren
2. ✅ Teste die API-Endpoints
3. ✅ Migriere Daten von SQLite zu Firestore (falls nötig)
4. ✅ Prüfe Vercel Logs auf Fehler

---

## 🔗 Nützliche Befehle

```bash
# Projekt-Status prüfen
vercel ls

# Logs anzeigen
vercel logs

# Environment Variables anzeigen
vercel env ls

# Environment Variable löschen
vercel env rm VARIABLE_NAME

# Erneut deployen
vercel --prod
```
