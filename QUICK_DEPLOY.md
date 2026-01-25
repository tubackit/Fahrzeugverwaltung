# ⚡ Schnelles Vercel Deployment

## 🚀 Einfachste Methode

Führe dieses Script aus:

```bash
./setup-vercel.sh
```

Das war's! Das Script führt dich durch alles.

---

## 📋 Was das Script macht

1. ✅ Prüft ob Vercel CLI installiert ist (installiert es falls nötig)
2. ✅ Prüft ob du eingeloggt bist (führt dich durch Login falls nötig)
3. ✅ Fragt nach dem Pfad zur Firebase Service Account JSON
4. ✅ Deployt automatisch auf Vercel
5. ✅ Setzt alle Environment Variables automatisch
6. ✅ Deployt erneut (damit Env Variables aktiv werden)

---

## 🔧 Voraussetzungen

- [ ] Firebase Service Account JSON-Datei bereit
  - Datei: `autologic-99357-firebase-adminsdk-fbsvc-9afcc7dad8.json`
  - Oder ähnlicher Name

---

## 📝 Schritt-für-Schritt

### 1. Terminal öffnen

Öffne ein Terminal im Projekt-Verzeichnis:
```bash
cd "/Users/pmac1/Meine Projekte/Fahrzeugverwaltung"
```

### 2. Script ausführen

```bash
./setup-vercel.sh
```

### 3. Folgende Fragen beantworten

**Frage 1:** "Pfad zur JSON-Datei"
- Beispiel: `~/Downloads/autologic-99357-firebase-adminsdk-fbsvc-9afcc7dad8.json`
- Oder: `./autologic-99357-firebase-adminsdk-fbsvc-9afcc7dad8.json` (wenn im Projekt-Verzeichnis)

**Falls Login nötig:**
- Script öffnet Browser für Vercel Login
- Folge den Anweisungen im Browser

### 4. Fertig! 🎉

Das Script zeigt dir am Ende:
- Deployment URL
- API URL
- Admin Frontend URL
- Driver Frontend URL

---

## 🆘 Falls das Script nicht funktioniert

### Problem: "Permission denied"
```bash
chmod +x setup-vercel.sh
./setup-vercel.sh
```

### Problem: "vercel: command not found"
Das Script installiert Vercel CLI automatisch. Falls es nicht funktioniert:
```bash
npm install -g vercel
```

### Problem: Script fragt nach Login
- Folge den Anweisungen
- Browser öffnet sich automatisch
- Logge dich bei Vercel ein

---

## 📚 Alternative: Manuell

Falls du das Script nicht verwenden möchtest, siehe:
- `VERCEL_DEPLOYMENT.md` - Detaillierte manuelle Anleitung
- `DEPLOY_VERCEL_FIREBASE.md` - Vollständige Deployment-Anleitung
