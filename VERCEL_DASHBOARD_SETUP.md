# 🚀 Vercel Deployment - Dashboard Methode (Einfachste)

## 📋 Übersicht

Diese Anleitung zeigt dir, wie du AutoLogic **ohne Terminal/CLI** direkt im Vercel Dashboard deployst.

---

## ✅ Schritt 1: Vercel Account erstellen

1. Gehe zu [https://vercel.com/](https://vercel.com/)
2. Klicke auf **"Sign Up"** oder **"Anmelden"**
3. Melde dich mit **GitHub** an (empfohlen)

---

## 📦 Schritt 2: Projekt importieren

1. **Im Vercel Dashboard:**
   - Klicke auf **"Add New..."** → **"Project"**
   - Oder: **"New Project"**

2. **Repository auswählen:**
   - Wähle dein GitHub Repository aus
   - Falls nicht sichtbar: Klicke auf **"Adjust GitHub App Permissions"** und erlaube Zugriff

3. **Projekt konfigurieren:**
   - **Project Name:** `autologic` (oder dein Wunschname)
   - **Framework Preset:** Vercel erkennt automatisch die Struktur
   - **Root Directory:** Lasse leer (Root-Verzeichnis)
   - **Build Command:** Wird automatisch erkannt
   - **Output Directory:** Wird automatisch erkannt

4. **Klicke auf "Deploy"**
   - Warte ca. 2-5 Minuten
   - Vercel deployt automatisch alle Teile (API, Frontend-Admin, Frontend-Driver)

---

## 🔐 Schritt 3: Firebase Service Account JSON vorbereiten

1. **Öffne die JSON-Datei:**
   - Datei: `autologic-99357-firebase-adminsdk-fbsvc-9afcc7dad8.json`
   - Öffne mit TextEditor (VS Code, TextEdit, Notepad++)

2. **Kopiere den kompletten Inhalt:**
   - Markiere ALLES (Strg+A / Cmd+A)
   - Kopiere es (Strg+C / Cmd+C)
   - Der Inhalt beginnt mit `{` und endet mit `}`

3. **Konvertiere zu einer Zeile** (wichtig für Vercel):
   - Gehe zu [https://jsonformatter.org/](https://jsonformatter.org/)
   - Füge deine JSON ein
   - Klicke auf **"Minify"** oder **"Compact"**
   - Kopiere das Ergebnis (eine Zeile)

---

## 🔧 Schritt 4: Environment Variables setzen

1. **Im Vercel Dashboard:**
   - Gehe zu deinem Projekt
   - Klicke auf **"Settings"** (oben rechts)
   - Klicke auf **"Environment Variables"** (linkes Menü)

2. **FIREBASE_SERVICE_ACCOUNT hinzufügen:**

   - Klicke auf **"Add New"**
   - **Key:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** Füge die **komplette JSON (in einer Zeile)** ein
   - **Environments:** Wähle alle aus:
     - ✅ Production
     - ✅ Preview  
     - ✅ Development
   - Klicke auf **"Save"**

3. **VITE_API_URL für Frontend-Admin hinzufügen:**

   **WICHTIG:** Du musst zuerst die Deployment-URL kennen!
   
   - Nach dem ersten Deployment siehst du die URL (z.B. `https://autologic.vercel.app`)
   - Klicke auf **"Add New"**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://[dein-projekt-name].vercel.app/api`
     - Beispiel: `https://autologic.vercel.app/api`
   - **Environments:** Wähle alle aus
   - **Scope:** Wähle **"frontend-admin"** aus (wichtig!)
   - Klicke auf **"Save"**

4. **VITE_API_URL für Frontend-Driver hinzufügen:**

   - Klicke auf **"Add New"**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://[dein-projekt-name].vercel.app/api`
     - **Gleiche URL wie bei Frontend-Admin!**
   - **Environments:** Wähle alle aus
   - **Scope:** Wähle **"frontend-driver"** aus (wichtig!)
   - Klicke auf **"Save"**

---

## 🔄 Schritt 5: Erneut deployen

Nach dem Setzen der Environment Variables:

1. **Im Vercel Dashboard:**
   - Gehe zu **"Deployments"** (oben)
   - Klicke auf die drei Punkte (⋯) beim neuesten Deployment
   - Klicke auf **"Redeploy"**
   - Oder: Klicke auf **"Redeploy"** Button

2. **Warte auf erfolgreiches Deployment**
   - Dauert ca. 2-3 Minuten

---

## ✅ Schritt 6: URLs notieren

Nach erfolgreichem Deployment siehst du:

- **Deployment URL:** `https://[projekt-name].vercel.app`
- **Admin Frontend:** `https://[projekt-name].vercel.app/admin`
- **Driver Frontend:** `https://[projekt-name].vercel.app/driver`
- **API:** `https://[projekt-name].vercel.app/api`

---

## 🧪 Schritt 7: Testen

1. **API testen:**
   - Öffne: `https://[projekt-name].vercel.app/api/fahrzeuge`
   - Sollte eine leere Liste `[]` oder Fahrzeuge zurückgeben

2. **Admin Frontend testen:**
   - Öffne: `https://[projekt-name].vercel.app/admin`
   - Sollte das Admin-Dashboard laden

3. **Driver Frontend testen:**
   - Öffne: `https://[projekt-name].vercel.app/driver`
   - Sollte das Login-Formular zeigen

---

## 🆘 Troubleshooting

### Problem: "Environment Variable not found"
**Lösung:** 
- Stelle sicher, dass du für alle Environments (Production, Preview, Development) gesetzt hast
- Stelle sicher, dass der Scope korrekt ist (frontend-admin oder frontend-driver)

### Problem: "Invalid JSON" bei FIREBASE_SERVICE_ACCOUNT
**Lösung:**
- JSON muss in einer Zeile sein
- Verwende [jsonformatter.org](https://jsonformatter.org/) → "Minify"
- Die `\n` im `private_key` müssen erhalten bleiben

### Problem: API gibt Fehler zurück
**Lösung:**
- Prüfe Vercel Logs: Dashboard → Deployments → Klicke auf Deployment → "Functions" Tab
- Prüfe ob FIREBASE_SERVICE_ACCOUNT korrekt gesetzt ist

### Problem: Frontend kann API nicht erreichen
**Lösung:**
- Prüfe ob VITE_API_URL korrekt gesetzt ist
- Stelle sicher, dass der Scope (frontend-admin oder frontend-driver) korrekt ist
- URL sollte mit `/api` enden

---

## 📝 Checkliste

- [ ] Vercel Account erstellt
- [ ] GitHub Repository importiert
- [ ] Erstes Deployment erfolgreich
- [ ] FIREBASE_SERVICE_ACCOUNT Environment Variable gesetzt (alle Environments)
- [ ] VITE_API_URL für frontend-admin gesetzt (alle Environments)
- [ ] VITE_API_URL für frontend-driver gesetzt (alle Environments)
- [ ] Erneut deployt (damit Env Variables aktiv werden)
- [ ] URLs getestet

---

## 🎉 Fertig!

Deine Anwendung sollte jetzt live sein!

**Nächste Schritte:**
1. Migriere Daten von SQLite zu Firestore (falls nötig)
2. Teste alle Funktionen
3. Füge Custom Domain hinzu (optional)
