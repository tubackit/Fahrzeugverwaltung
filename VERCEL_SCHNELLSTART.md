# ⚡ Vercel Schnellstart - 5 Minuten

## 🎯 Die einfachste Methode (ohne Terminal)

### Schritt 1: Vercel Dashboard öffnen
1. Gehe zu [vercel.com](https://vercel.com/)
2. Logge dich mit GitHub ein
3. Klicke auf **"Add New..."** → **"Project"**

### Schritt 2: Repository importieren
1. Wähle dein GitHub Repository
2. Klicke auf **"Import"**
3. Klicke auf **"Deploy"** (Vercel erkennt automatisch alles)

### Schritt 3: Environment Variables setzen

**Nach dem ersten Deployment:**

1. Gehe zu **Settings** → **Environment Variables**

2. **FIREBASE_SERVICE_ACCOUNT hinzufügen:**
   - Öffne deine JSON-Datei: `autologic-99357-firebase-adminsdk-fbsvc-9afcc7dad8.json`
   - Kopiere den kompletten Inhalt
   - Gehe zu [jsonformatter.org](https://jsonformatter.org/) → "Minify" → kopiere Ergebnis
   - In Vercel: Key = `FIREBASE_SERVICE_ACCOUNT`, Value = [minified JSON]
   - Environments: ✅ Production, ✅ Preview, ✅ Development
   - Scope: Lasse leer (für alle)

3. **VITE_API_URL hinzufügen:**
   - Hole die Deployment-URL (z.B. `https://autologic.vercel.app`)
   - **Für Frontend-Admin:**
     - Key = `VITE_API_URL`
     - Value = `https://[dein-projekt].vercel.app/api`
     - Scope = `frontend-admin`
   - **Für Frontend-Driver:**
     - Key = `VITE_API_URL`
     - Value = `https://[dein-projekt].vercel.app/api`
     - Scope = `frontend-driver`

4. **Redeploy:**
   - Gehe zu Deployments → Klicke auf "Redeploy"

### Fertig! 🎉

Öffne:
- Admin: `https://[projekt].vercel.app/admin`
- Driver: `https://[projekt].vercel.app/driver`

---

## 📚 Detaillierte Anleitung

Siehe `VERCEL_DASHBOARD_SETUP.md` für Schritt-für-Schritt Anleitung mit Screenshots-Beschreibungen.
