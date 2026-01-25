# 🔧 Fix: better-sqlite3 Build Error

## ❌ Problem

Vercel versucht, `better-sqlite3` aus `backend/package.json` zu installieren, was auf Vercel nicht funktioniert (native Dependencies).

## ✅ Lösung

Ich habe `backend/package.json` temporär durch `backend/api/package.json` ersetzt, damit Vercel nur die Firebase-Dependencies installiert.

**Was ich gemacht habe:**
1. `backend/package.json` → `backend/package.json.backup` (gesichert)
2. `backend/api/package.json` → `backend/package.json` (kopiert)

**Jetzt installiert Vercel nur:**
- `@vercel/node`
- `firebase-admin`
- TypeScript (dev)

**Nicht mehr:**
- `better-sqlite3` ❌
- `express` ❌
- Andere Backend-Dependencies ❌

---

## ⚠️ Wichtig für lokale Entwicklung

Für lokale Entwicklung mit SQLite:
- Die originale `package.json` ist als `package.json.backup` gesichert
- Du kannst sie jederzeit wiederherstellen: `mv package.json.backup package.json`

---

## 🚀 Nächste Schritte

1. **Commit und Push** die Änderungen
2. **Vercel deployt automatisch**
3. **Teste die API:** `https://[projekt].vercel.app/api/fahrzeuge`

---

## 🔄 Zurück zur lokalen Entwicklung

Falls du lokal mit SQLite arbeiten willst:

```bash
cd backend
mv package.json package.json.vercel
mv package.json.backup package.json
npm install
```

Für Vercel Deployment wieder umkehren:
```bash
mv package.json package.json.backup
mv package.json.vercel package.json
```
