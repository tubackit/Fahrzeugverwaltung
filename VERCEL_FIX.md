# 🔧 Vercel Deployment Fehler beheben

## ⚠️ Wichtig: Vercel Monorepo Setup

Für ein Projekt mit mehreren Frontends und API Functions gibt es **zwei Möglichkeiten**:

---

## 🎯 Option 1: Separate Vercel-Projekte (EMPFOHLEN - Einfacher)

Erstelle **drei separate Projekte** in Vercel:

### Projekt 1: API (Serverless Functions)
1. **Neues Projekt erstellen**
2. **Root Directory:** Lasse leer (Root)
3. **Build Command:** Lasse leer (nicht nötig für Functions)
4. **Output Directory:** Lasse leer
5. **Environment Variables:**
   - `FIREBASE_SERVICE_ACCOUNT` = [deine JSON]

### Projekt 2: Frontend-Admin
1. **Neues Projekt erstellen**
2. **Root Directory:** `frontend-admin`
3. **Framework Preset:** Vite (automatisch erkannt)
4. **Environment Variables:**
   - `VITE_API_URL` = `https://[api-projekt-url].vercel.app/api`

### Projekt 3: Frontend-Driver
1. **Neues Projekt erstellen**
2. **Root Directory:** `frontend-driver`
3. **Framework Preset:** Vite (automatisch erkannt)
4. **Environment Variables:**
   - `VITE_API_URL` = `https://[api-projekt-url].vercel.app/api`

**Vorteil:** Einfacher, weniger Konfiguration, weniger Fehleranfällig

---

## 🎯 Option 2: Ein Vercel-Projekt (Komplexer)

Falls du alles in einem Projekt haben möchtest:

### Problem: Die aktuelle `vercel.json` funktioniert möglicherweise nicht

**Lösung:** Entferne die Root `vercel.json` und verwende stattdessen:

1. **Lösche `vercel.json` im Root** (oder benenne um zu `vercel.json.backup`)

2. **Vercel erkennt automatisch:**
   - `/api/**/*.ts` → Serverless Functions
   - `frontend-admin/` → Wird NICHT automatisch gebaut (Problem!)

3. **Problem:** Vercel kann nicht mehrere Frontends in einem Projekt bauen

**Daher:** Option 1 (separate Projekte) ist die bessere Lösung!

---

## 🔍 Häufige Fehler und Lösungen

### Fehler: "Build failed" oder "No build output"
**Lösung:** 
- Verwende separate Projekte (Option 1)
- Oder setze Root Directory auf `frontend-admin` für Admin-Projekt

### Fehler: "Cannot find module" in API Functions
**Lösung:**
- Stelle sicher, dass `api/package.json` existiert
- Prüfe ob `firebase-admin` in `api/package.json` ist

### Fehler: "Environment variable not found"
**Lösung:**
- Setze Environment Variables im Vercel Dashboard
- Stelle sicher, dass Scope korrekt ist (frontend-admin, frontend-driver, oder leer für API)

### Fehler: "Firebase initialization error"
**Lösung:**
- Prüfe ob `FIREBASE_SERVICE_ACCOUNT` korrekt gesetzt ist
- JSON muss in einer Zeile sein
- Die `\n` im `private_key` müssen erhalten bleiben

---

## ✅ Empfohlene Lösung

**Erstelle 3 separate Vercel-Projekte:**

1. **autologic-api** (Root, nur API Functions)
2. **autologic-admin** (Root Directory: `frontend-admin`)
3. **autologic-driver** (Root Directory: `frontend-driver`)

Das ist die einfachste und zuverlässigste Methode!

---

## 📝 Schnellstart mit separaten Projekten

### 1. API-Projekt erstellen
- Repository importieren
- Root Directory: Lasse leer
- Environment Variable: `FIREBASE_SERVICE_ACCOUNT`
- Deployen
- URL notieren: `https://autologic-api.vercel.app`

### 2. Admin-Projekt erstellen
- Repository importieren
- Root Directory: `frontend-admin`
- Environment Variable: `VITE_API_URL` = `https://autologic-api.vercel.app/api`
- Deployen

### 3. Driver-Projekt erstellen
- Repository importieren
- Root Directory: `frontend-driver`
- Environment Variable: `VITE_API_URL` = `https://autologic-api.vercel.app/api`
- Deployen

**Fertig!** 🎉
