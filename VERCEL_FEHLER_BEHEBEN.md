# 🔧 Vercel Deployment Fehler beheben

## ❓ Welcher Fehler tritt auf?

Bitte teile mir die **genaue Fehlermeldung** aus dem Vercel Dashboard mit, dann kann ich dir gezielt helfen.

---

## 🔍 Häufige Fehler und Lösungen

### Fehler 1: "Build failed" oder "No build output"

**Ursache:** Vercel weiß nicht, was gebaut werden soll.

**Lösung - Option A: Separate Projekte (EMPFOHLEN)**

Erstelle **3 separate Vercel-Projekte**:

1. **API-Projekt:**
   - Root Directory: Lasse leer
   - Vercel erkennt automatisch `/api/**/*.ts` als Functions
   - Environment Variable: `FIREBASE_SERVICE_ACCOUNT`

2. **Admin-Projekt:**
   - Root Directory: `frontend-admin`
   - Framework: Vite (automatisch erkannt)
   - Environment Variable: `VITE_API_URL` = `https://[api-url]/api`

3. **Driver-Projekt:**
   - Root Directory: `frontend-driver`
   - Framework: Vite (automatisch erkannt)
   - Environment Variable: `VITE_API_URL` = `https://[api-url]/api`

**Lösung - Option B: Ein Projekt mit Build-Konfiguration**

Im Vercel Dashboard beim Import:
- **Ignore Build Step:** Lasse leer
- **Build Command:** Lasse leer (Vercel erkennt automatisch)
- **Output Directory:** Lasse leer

---

### Fehler 2: "Cannot find module '@vercel/node'" oder "firebase-admin"

**Ursache:** Dependencies fehlen in `api/package.json`

**Lösung:**
1. Prüfe ob `api/package.json` existiert ✅ (sollte vorhanden sein)
2. Stelle sicher, dass `firebase-admin` in dependencies ist ✅ (ist vorhanden)

Falls es immer noch nicht funktioniert:
- Vercel installiert automatisch Dependencies aus `api/package.json`
- Falls nicht, füge `installCommand` in Vercel Settings hinzu

---

### Fehler 3: "TypeScript compilation error"

**Ursache:** TypeScript-Fehler in den API Functions

**Lösung:**
1. Prüfe Vercel Build Logs
2. Suche nach TypeScript-Fehlern
3. Korrigiere die Fehler

**Schnelltest lokal:**
```bash
cd api
npx tsc --noEmit
```

---

### Fehler 4: "Environment variable FIREBASE_SERVICE_ACCOUNT not found"

**Ursache:** Environment Variable nicht gesetzt oder falsch formatiert

**Lösung:**
1. Gehe zu Vercel Dashboard → Settings → Environment Variables
2. Prüfe ob `FIREBASE_SERVICE_ACCOUNT` existiert
3. Prüfe ob für alle Environments gesetzt (Production, Preview, Development)
4. Prüfe ob JSON korrekt ist (eine Zeile, `\n` im private_key erhalten)

---

### Fehler 5: "404 Not Found" bei API-Aufrufen

**Ursache:** API Routes werden nicht erkannt

**Lösung:**
1. Prüfe ob Dateien in `/api/` existieren ✅
2. Prüfe ob `api/package.json` existiert ✅
3. Stelle sicher, dass Dateien `.ts` Endung haben ✅

**Test:**
- Nach Deployment: `https://[projekt].vercel.app/api/fahrzeuge`
- Sollte JSON zurückgeben (auch wenn leer `[]`)

---

### Fehler 6: Frontend baut nicht

**Ursache:** Vercel weiß nicht, welches Frontend gebaut werden soll

**Lösung - Separate Projekte:**
- Erstelle separate Projekte für `frontend-admin` und `frontend-driver`
- Setze Root Directory auf jeweiliges Verzeichnis

**Lösung - Ein Projekt:**
- Vercel kann nicht mehrere Frontends in einem Projekt bauen
- **Daher:** Separate Projekte sind notwendig!

---

## 🎯 Empfohlene Lösung: 3 Separate Projekte

### Warum separate Projekte?

✅ Einfacher zu konfigurieren
✅ Weniger Fehleranfällig
✅ Bessere Isolation
✅ Einfacher zu debuggen
✅ Jedes Projekt hat eigene URL

### Setup:

1. **API-Projekt:**
   - Name: `autologic-api`
   - Root: leer
   - Env: `FIREBASE_SERVICE_ACCOUNT`
   - URL: `https://autologic-api.vercel.app`

2. **Admin-Projekt:**
   - Name: `autologic-admin`
   - Root: `frontend-admin`
   - Env: `VITE_API_URL=https://autologic-api.vercel.app/api`
   - URL: `https://autologic-admin.vercel.app`

3. **Driver-Projekt:**
   - Name: `autologic-driver`
   - Root: `frontend-driver`
   - Env: `VITE_API_URL=https://autologic-api.vercel.app/api`
   - URL: `https://autologic-driver.vercel.app`

---

## 📝 Bitte teile mir mit:

1. **Welche Fehlermeldung** siehst du genau?
2. **In welchem Schritt** tritt der Fehler auf? (Build, Deploy, Runtime?)
3. **Welche Konfiguration** hast du in Vercel gewählt?

Dann kann ich dir gezielt helfen! 🚀
