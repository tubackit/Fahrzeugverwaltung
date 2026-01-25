# 🔧 Fix: Vercel erkennt API Functions nicht

## ❌ Problem

Vercel ignoriert möglicherweise die API Functions in `backend/api/`, obwohl sie vorhanden sind.

## ✅ Lösung

Vercel sollte automatisch alle `.ts` Dateien in `api/` Verzeichnissen erkennen. Wenn das Root Directory auf `backend` gesetzt ist, sucht Vercel nach `api/` (relativ zum Root).

**Struktur sollte sein:**
```
backend/          ← Root Directory
├── api/          ← Vercel erkennt automatisch
│   ├── fahrzeuge/
│   ├── fahrer/
│   └── lib/
└── vercel.json
```

## 🔍 Prüfen

1. **Sind die API Functions vorhanden?**
   - ✅ `backend/api/fahrzeuge/index.ts`
   - ✅ `backend/api/fahrer/login.ts`
   - ✅ etc.

2. **Ist `backend/api/package.json` vorhanden?**
   - ✅ Sollte vorhanden sein

3. **Ist `backend/package.json` korrekt?**
   - ✅ Sollte nur Firebase-Dependencies haben (kein better-sqlite3)

## 🚀 Nächste Schritte

1. **Warte auf vollständigen Build-Log**
   - Schaue, ob Vercel die Functions erkennt
   - Prüfe ob es Fehler gibt

2. **Falls Functions nicht erkannt werden:**
   - Prüfe ob `backend/api/` im Build enthalten ist
   - Prüfe ob `.vercelignore` zu aggressiv ist

3. **Falls Build erfolgreich:**
   - Teste API: `https://[projekt].vercel.app/api/fahrzeuge`
