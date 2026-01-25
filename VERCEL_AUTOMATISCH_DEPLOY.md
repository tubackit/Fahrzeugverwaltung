# 🚀 Automatisches Vercel Deployment - Root Directory: backend

## ✅ Was ich gemacht habe

Ich habe die API Functions nach `backend/api/` verschoben, damit sie mit dem Root Directory `backend` funktionieren.

**Neue Struktur:**
```
Fahrzeugverwaltung/
├── api/                    ← Original (bleibt für Referenz)
├── backend/
│   ├── api/                ← NEU: Vercel Functions hier!
│   │   ├── fahrzeuge/
│   │   ├── fahrer/
│   │   └── lib/
│   └── vercel.json         ← NEU: Vercel Config
├── frontend-admin/
└── frontend-driver/
```

---

## 🎯 Jetzt in Vercel Dashboard

### Für das API-Projekt (Root Directory = `backend`):

1. **Gehe zu deinem Vercel Projekt**
2. **Settings** → **General**
3. **Root Directory:** Sollte auf `backend` stehen ✅
4. **Redeploy** das Projekt

Vercel erkennt jetzt automatisch:
- `backend/api/**/*.ts` → Serverless Functions ✅

---

## 🔧 Environment Variables

Stelle sicher, dass diese gesetzt sind:

1. **FIREBASE_SERVICE_ACCOUNT**
   - Key: `FIREBASE_SERVICE_ACCOUNT`
   - Value: [deine JSON in einer Zeile]
   - Environments: Alle (Production, Preview, Development)

---

## 🧪 Testen

Nach dem Deployment:

1. **API testen:**
   - `https://[projekt].vercel.app/api/fahrzeuge`
   - Sollte JSON zurückgeben

2. **Prüfe Vercel Logs:**
   - Dashboard → Deployments → Klicke auf Deployment → "Functions" Tab
   - Sollte keine Fehler zeigen

---

## ⚠️ Wichtig

Die **Frontends** müssen weiterhin als **separate Projekte** erstellt werden:

### Frontend-Admin Projekt:
- Root Directory: `frontend-admin`
- Environment Variable: `VITE_API_URL` = `https://[api-url]/api`

### Frontend-Driver Projekt:
- Root Directory: `frontend-driver`
- Environment Variable: `VITE_API_URL` = `https://[api-url]/api`

---

## 🆘 Falls es nicht funktioniert

1. **Prüfe Vercel Build Logs:**
   - Dashboard → Deployments → Klicke auf Deployment
   - Schaue nach Fehlermeldungen

2. **Prüfe ob API Functions erkannt werden:**
   - Dashboard → Deployments → "Functions" Tab
   - Sollte alle API Routes zeigen

3. **Teile mir die Fehlermeldung mit**, dann kann ich gezielt helfen!

---

## ✅ Checkliste

- [x] API Functions nach `backend/api/` verschoben
- [x] `backend/vercel.json` erstellt
- [ ] Vercel Projekt mit Root Directory `backend` konfiguriert
- [ ] `FIREBASE_SERVICE_ACCOUNT` Environment Variable gesetzt
- [ ] Projekt redeployed
- [ ] API getestet
- [ ] Frontend-Projekte erstellt (separat)
