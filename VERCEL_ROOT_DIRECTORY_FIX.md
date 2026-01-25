# 🔧 Vercel Root Directory korrigieren

## ⚠️ WICHTIG: Root Directory Einstellung

Für die **Vercel + Firebase** Variante:

### ❌ FALSCH: Root Directory = `backend`
- Das `/backend` Verzeichnis ist für **lokale Entwicklung mit SQLite**
- Vercel kann damit nichts anfangen

### ✅ RICHTIG: Root Directory = **LEER** (für API-Projekt)

Die API Functions sind im `/api` Verzeichnis, nicht in `/backend`!

---

## 🎯 Korrektur im Vercel Dashboard

### Für das API-Projekt:

1. **Gehe zu Vercel Dashboard**
2. **Wähle dein Projekt aus**
3. **Klicke auf "Settings"**
4. **Klicke auf "General"** (linkes Menü)
5. **Scrolle zu "Root Directory"**
6. **Lösche `backend`** → Lasse das Feld **LEER**
7. **Klicke auf "Save"**

### Warum leer?

- Vercel erkennt automatisch `/api/**/*.ts` als Serverless Functions
- Die API Functions sind in `/api`, nicht in `/backend`
- Das `/backend` Verzeichnis wird für Vercel nicht benötigt

---

## 📁 Projekt-Struktur für Vercel

```
Fahrzeugverwaltung/
├── api/                    ← HIER sind die Vercel Functions!
│   ├── fahrzeuge/
│   ├── fahrer/
│   └── lib/
├── frontend-admin/         ← Für separates Admin-Projekt
├── frontend-driver/        ← Für separates Driver-Projekt
└── backend/                ← Wird von Vercel NICHT verwendet
```

---

## ✅ Nach der Korrektur

1. **Root Directory auf leer setzen** (oder entfernen)
2. **Redeploy** das Projekt
3. Vercel erkennt automatisch:
   - `/api/**/*.ts` → Serverless Functions ✅
   - Frontends müssen als **separate Projekte** erstellt werden

---

## 🎯 Empfohlene Setup: 3 Separate Projekte

### Projekt 1: API
- **Root Directory:** LEER (nicht `backend`!)
- **Environment Variable:** `FIREBASE_SERVICE_ACCOUNT`
- Vercel erkennt automatisch `/api` Functions

### Projekt 2: Frontend-Admin
- **Root Directory:** `frontend-admin`
- **Environment Variable:** `VITE_API_URL` = `https://[api-url]/api`

### Projekt 3: Frontend-Driver
- **Root Directory:** `frontend-driver`
- **Environment Variable:** `VITE_API_URL` = `https://[api-url]/api`

---

## 🚨 Häufiger Fehler

**Fehler:** "Cannot find module" oder "Build failed"
**Ursache:** Root Directory ist auf `backend` gesetzt
**Lösung:** Root Directory auf **LEER** setzen!
