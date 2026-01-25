# 🔧 Root Directory kann nicht gelöscht werden - Lösung

## ❌ Problem

Das Root Directory steht auf `backend`, kann aber nicht gelöscht werden.

## ✅ Lösung: Neues Projekt erstellen

Da Vercel das Root Directory möglicherweise nicht ändern lässt, erstelle ein **neues Projekt**:

---

## 🎯 Option 1: Neues Projekt für API (EMPFOHLEN)

### Schritt 1: Neues Projekt erstellen

1. **Im Vercel Dashboard:**
   - Klicke auf **"Add New..."** → **"Project"**
   - Oder: **"New Project"**

2. **Repository auswählen:**
   - Wähle das **gleiche GitHub Repository** aus

3. **Projekt konfigurieren:**
   - **Project Name:** `autologic-api` (oder `autologic-backend`)
   - **Framework Preset:** Lasse auf "Other" oder "No Framework"
   - **Root Directory:** Lasse **LEER** (oder setze auf `.`)
   - **Build Command:** Lasse leer
   - **Output Directory:** Lasse leer

4. **Klicke auf "Deploy"**

### Schritt 2: Environment Variables setzen

1. Gehe zu **Settings** → **Environment Variables**
2. Füge hinzu:
   - **Key:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** [deine JSON in einer Zeile]
   - **Environments:** Alle auswählen

3. **Redeploy** das Projekt

### Schritt 3: URL notieren

- Notiere die URL: `https://autologic-api.vercel.app`
- Diese URL brauchst du für die Frontend-Projekte

---

## 🎯 Option 2: Root Directory auf "." setzen

Falls Vercel es erlaubt:

1. **Im Vercel Dashboard:**
   - Gehe zu **Settings** → **General**
   - **Root Directory:** Ändere von `backend` zu `.` (Punkt)
   - Klicke auf **"Save"**

2. **Redeploy** das Projekt

**Hinweis:** `.` bedeutet "Root-Verzeichnis" und sollte funktionieren.

---

## 🎯 Option 3: Projekt löschen und neu erstellen

Falls nichts funktioniert:

1. **Altes Projekt löschen:**
   - Gehe zu **Settings** → **General**
   - Scrolle nach unten
   - Klicke auf **"Delete Project"**
   - Bestätige die Löschung

2. **Neues Projekt erstellen:**
   - Folge **Option 1** (siehe oben)
   - Stelle sicher, dass **Root Directory LEER** ist

---

## ✅ Nach erfolgreichem API-Deployment

Erstelle **zwei weitere Projekte** für die Frontends:

### Frontend-Admin Projekt:

1. **Neues Projekt erstellen**
2. **Repository:** Gleiches Repository
3. **Project Name:** `autologic-admin`
4. **Root Directory:** `frontend-admin`
5. **Environment Variable:**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://autologic-api.vercel.app/api`

### Frontend-Driver Projekt:

1. **Neues Projekt erstellen**
2. **Repository:** Gleiches Repository
3. **Project Name:** `autologic-driver`
4. **Root Directory:** `frontend-driver`
5. **Environment Variable:**
   - **Key:** `VITE_API_URL`
   - **Value:** `https://autologic-api.vercel.app/api`

---

## 🔍 Warum funktioniert `backend` nicht?

- Die API Functions sind im `/api` Verzeichnis (Root-Level)
- Wenn Root Directory auf `backend` steht, sucht Vercel nach `backend/api`
- Das existiert nicht! ✅
- Daher: Root Directory muss leer sein oder `.` (Root)

---

## 📝 Checkliste

- [ ] Neues Projekt erstellt (oder Root Directory auf `.` gesetzt)
- [ ] Root Directory ist leer oder `.`
- [ ] API-Projekt deployed
- [ ] `FIREBASE_SERVICE_ACCOUNT` Environment Variable gesetzt
- [ ] API-URL notiert
- [ ] Frontend-Admin Projekt erstellt
- [ ] Frontend-Driver Projekt erstellt
- [ ] Alle Environment Variables gesetzt
- [ ] Alles deployed und getestet

---

## 🆘 Falls es immer noch nicht funktioniert

Bitte teile mir mit:
1. **Welche Fehlermeldung** siehst du?
2. **Was steht im Root Directory Feld?** (kannst du es sehen?)
3. **Kannst du es auf `.` ändern?**

Dann kann ich dir gezielt helfen! 🚀
