# 🔐 Service Account JSON - Was damit machen?

## 📋 Übersicht

Die Datei `autologic-99357-firebase-adminsdk-fbsvc-9afcc7dad8.json` enthält die Zugangsdaten für dein Firebase-Projekt. Du brauchst den **Inhalt** dieser Datei für Vercel.

---

## 🔍 Schritt 1: Datei öffnen

1. **Öffne die JSON-Datei** mit einem Texteditor:
   - **Mac:** Doppelklick → öffnet in TextEdit oder VS Code
   - **Windows:** Rechtsklick → "Öffnen mit" → Notepad oder VS Code
   - **VS Code:** Ziehe die Datei in VS Code

2. **Der Inhalt sieht so aus:**
```json
{
  "type": "service_account",
  "project_id": "autologic-99357",
  "private_key_id": "9afcc7dad8...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@autologic-99357.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40autologic-99357.iam.gserviceaccount.com"
}
```

---

## 📋 Schritt 2: Kompletten Inhalt kopieren

1. **Markiere ALLES** in der Datei (Strg+A / Cmd+A)
2. **Kopiere es** (Strg+C / Cmd+C)
3. Du hast jetzt die komplette JSON im Clipboard

**WICHTIG:**
- Kopiere **ALLES** von `{` bis `}`
- Inklusive aller Anführungszeichen
- Die `\n` Zeichen im `private_key` müssen erhalten bleiben!

---

## 🚀 Schritt 3: In Vercel einfügen

### Option A: Als Environment Variable in Vercel (Empfohlen)

1. **Gehe zu Vercel:**
   - Öffne [vercel.com](https://vercel.com/)
   - Logge dich ein
   - Wähle dein Projekt (oder erstelle eines)

2. **Environment Variables öffnen:**
   - Gehe zu **Project Settings** → **Environment Variables**
   - Oder: Klicke auf dein Projekt → **Settings** → **Environment Variables**

3. **Neue Variable hinzufügen:**
   - **Key:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** Füge hier den **kompletten JSON-Inhalt** ein (den du gerade kopiert hast)
   - **Environments:** Wähle alle aus (Production, Preview, Development)
   - Klicke auf **"Save"**

**Format im Vercel:**
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"autologic-99357","private_key_id":"9afcc7dad8...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-fbsvc@autologic-99357.iam.gserviceaccount.com",...}
```

**Wichtig:** 
- Die JSON muss in **EINE Zeile** (ohne Zeilenumbrüche zwischen den Properties)
- Aber die `\n` im `private_key` müssen erhalten bleiben!

---

## 🔧 Schritt 4: JSON zu einer Zeile konvertieren (falls nötig)

Falls Vercel Probleme mit mehrzeiliger JSON hat:

**Option 1: Online Tool**
- Gehe zu [jsonformatter.org](https://jsonformatter.org/) oder ähnlich
- Füge deine JSON ein
- Klicke auf "Minify" oder "Compact"
- Kopiere das Ergebnis

**Option 2: Manuell**
- Entferne alle Zeilenumbrüche zwischen den Properties
- **ABER:** Lasse die `\n` im `private_key` Feld erhalten!

**Beispiel:**
```json
// VORHER (mehrzeilig):
{
  "type": "service_account",
  "project_id": "autologic-99357"
}

// NACHHER (eine Zeile):
{"type":"service_account","project_id":"autologic-99357","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",...}
```

---

## 🧪 Schritt 5: Testen (optional, lokal)

Falls du die Migration lokal testen möchtest:

1. **Erstelle `.env` Datei im `backend/` Verzeichnis:**
```bash
cd backend
touch .env
```

2. **Füge in `.env` ein:**
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"autologic-99357",...}
```

3. **Oder als einzelne Variablen:**
```
FIREBASE_PROJECT_ID=autologic-99357
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-fbsvc@autologic-99357.iam.gserviceaccount.com
```

4. **Teste die Migration:**
```bash
npm install firebase-admin
npx tsx src/scripts/migrate-to-firestore.ts
```

---

## 🔒 Sicherheitshinweise

⚠️ **WICHTIG:**

1. **Niemals in Git committen!**
   - Die JSON-Datei sollte in `.gitignore` sein
   - Environment Variables sind sicher in Vercel gespeichert

2. **Datei sicher aufbewahren:**
   - Speichere die JSON-Datei an einem sicheren Ort
   - Falls du sie verlierst, kannst du einen neuen Service Account erstellen

3. **Nicht teilen:**
   - Diese Datei gibt vollen Zugriff auf deine Firebase-Datenbank
   - Teile sie niemals öffentlich oder mit Unbefugten

---

## ✅ Checkliste

- [ ] JSON-Datei geöffnet
- [ ] Kompletten Inhalt kopiert
- [ ] In Vercel als `FIREBASE_SERVICE_ACCOUNT` Environment Variable gesetzt
- [ ] Für alle Environments aktiviert (Production, Preview, Development)
- [ ] Datei sicher aufbewahrt (nicht in Git!)

---

## 🆘 Probleme?

### Problem: "Invalid JSON" Fehler in Vercel
**Lösung:** 
- Stelle sicher, dass die JSON in einer Zeile ist
- Prüfe, ob alle Anführungszeichen korrekt sind
- Die `\n` im `private_key` müssen erhalten bleiben

### Problem: "Permission denied" Fehler
**Lösung:**
- Prüfe, ob die Firestore Security Rules korrekt sind
- Stelle sicher, dass Firestore aktiviert ist

### Problem: Datei kann nicht geöffnet werden
**Lösung:**
- Öffne mit einem Texteditor (VS Code, Notepad++, TextEdit)
- Nicht mit Excel oder Word öffnen!

---

## 📝 Zusammenfassung

**Was du mit der JSON-Datei machst:**

1. ✅ Öffne die Datei
2. ✅ Kopiere den kompletten Inhalt
3. ✅ Füge ihn in Vercel als `FIREBASE_SERVICE_ACCOUNT` Environment Variable ein
4. ✅ Speichere die Datei sicher (nicht in Git!)

**Das war's!** 🎉

Die Vercel Serverless Functions können jetzt mit Firebase Firestore kommunizieren.
