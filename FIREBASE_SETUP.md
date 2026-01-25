# 🔥 Firebase Setup - Schritt für Schritt Anleitung

## 📋 Übersicht

Diese Anleitung führt dich durch die komplette Einrichtung von Firebase Firestore für AutoLogic.

---

## 🚀 Schritt 1: Firebase Account erstellen

1. Gehe zu [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Falls du noch keinen Google Account hast, erstelle einen
3. Klicke auf **"Los geht's"** oder **"Get Started"**

---

## 🆕 Schritt 2: Neues Firebase Projekt erstellen

1. Klicke auf **"Projekt hinzufügen"** oder **"Add project"**
2. **Projektname eingeben:**
   - Gib einen Namen ein (z.B. `autologic` oder `fahrzeugverwaltung`)
   - Klicke auf **"Weiter"**
3. **Google Analytics (optional):**
   - Du kannst Google Analytics aktivieren oder deaktivieren
   - Für AutoLogic ist Analytics nicht zwingend erforderlich
   - Klicke auf **"Projekt erstellen"** oder **"Create project"**
4. **Warten:**
   - Firebase richtet das Projekt ein (ca. 30 Sekunden)
   - Klicke auf **"Fortfahren"** oder **"Continue"**

---

## 🗄️ Schritt 3: Firestore Database aktivieren

1. **Im Firebase Console Dashboard:**
   - Klicke im linken Menü auf **"Firestore Database"** (oder **"Build"** → **"Firestore Database"**)
   - Falls du es nicht siehst, klicke auf **"Erstellen"** oder **"Create database"**

2. **Datenbank erstellen:**
   - **Sicherheitsregeln:** Wähle **"Produktionsmodus"** (Production mode)
     - ⚠️ **Hinweis:** Wir passen die Regeln später an
   - Klicke auf **"Weiter"**

3. **Standort auswählen:**
   - Wähle eine Region nahe zu deinem Standort
   - **Empfehlung:** `europe-west3` (Frankfurt) für Deutschland
   - Klicke auf **"Aktivieren"** oder **"Enable"**

4. **Warten:**
   - Firebase richtet die Datenbank ein (ca. 1-2 Minuten)

---

## 🔐 Schritt 4: Service Account erstellen (für Backend-Zugriff)

1. **Projekt-Einstellungen öffnen:**
   - Klicke auf das **Zahnrad-Symbol (⚙️)** oben links
   - Wähle **"Projekteinstellungen"** oder **"Project settings"**

2. **Service Accounts Tab:**
   - Klicke auf den Tab **"Service Accounts"** (zweiter Tab oben)

3. **Neuen privaten Schlüssel generieren:**
   - Stelle sicher, dass **"Node.js"** ausgewählt ist
   - Klicke auf **"Neuer privater Schlüssel generieren"** oder **"Generate new private key"**
   - ⚠️ **WICHTIG:** Ein Dialog erscheint mit einer Warnung
   - Klicke auf **"Schlüssel generieren"** oder **"Generate key"**
   - Eine JSON-Datei wird automatisch heruntergeladen

4. **Service Account JSON speichern:**
   - Die Datei hat einen Namen wie: `autologic-xxxxx-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`
   - **WICHTIG:** Bewahre diese Datei sicher auf! Sie enthält Zugangsdaten zu deiner Datenbank
   - Öffne die Datei mit einem Texteditor (z.B. VS Code, Notepad++)
   - **Kopiere den KOMPLETTEN Inhalt** der JSON-Datei (alles zwischen `{` und `}`)

---

## 📝 Schritt 5: Service Account JSON Format prüfen

Die JSON-Datei sollte so aussehen:

```json
{
  "type": "service_account",
  "project_id": "autologic-xxxxx",
  "private_key_id": "xxxxxxxxxxxxxxxxxxxx",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@autologic-xxxxx.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40autologic-xxxxx.iam.gserviceaccount.com"
}
```

**Wichtig:**
- Der `private_key` enthält `\n` Zeichen - diese müssen erhalten bleiben!
- Kopiere die **komplette JSON** inklusive aller Anführungszeichen

---

## 🔒 Schritt 6: Firestore Sicherheitsregeln konfigurieren

1. **Firestore Console öffnen:**
   - Gehe zu **"Firestore Database"** im linken Menü
   - Klicke auf den Tab **"Regeln"** oder **"Rules"** (oben)

2. **Regeln einfügen:**
   - Ersetze den vorhandenen Code mit folgendem:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Fahrzeuge
    match /fahrzeuge/{fahrzeugId} {
      allow read: if true;  // Alle können lesen
      allow write: if true; // Für Start: alle können schreiben (später mit Auth einschränken)
    }
    
    // Schadensmeldungen
    match /schadensmeldungen/{schadenId} {
      allow read: if true;
      allow write: if true; // Für Start: alle können schreiben
    }
    
    // Wartungsmeldungen
    match /wartungsmeldungen/{wartungId} {
      allow read: if true;
      allow write: if true; // Für Start: alle können schreiben
    }
  }
}
```

3. **Regeln veröffentlichen:**
   - Klicke auf **"Veröffentlichen"** oder **"Publish"**
   - ⚠️ **Hinweis:** Diese Regeln erlauben Lese- und Schreibzugriff für alle. Für Produktion solltest du später Firebase Authentication hinzufügen.

---

## 📊 Schritt 7: Firestore Collections prüfen (optional)

Nach der Migration oder ersten Nutzung solltest du folgende Collections sehen:

- `fahrzeuge` - Alle Fahrzeuge
- `schadensmeldungen` - Alle Schadensmeldungen
- `wartungsmeldungen` - Alle Wartungsmeldungen

**So prüfst du:**
1. Gehe zu **"Firestore Database"** → **"Daten"** Tab
2. Nach dem ersten API-Aufruf oder Migration sollten die Collections erscheinen

---

## 🔑 Schritt 8: Environment Variable für Vercel vorbereiten

Die Service Account JSON wird später als Environment Variable in Vercel gesetzt:

**Format:**
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```

**Wichtig:**
- Die gesamte JSON muss in **EINE Zeile** (ohne Zeilenumbrüche)
- Alle Anführungszeichen müssen erhalten bleiben
- Die `\n` im `private_key` müssen erhalten bleiben

**Tipp:** Verwende einen JSON-Minifier oder kopiere die JSON direkt aus der Datei und entferne nur die Zeilenumbrüche zwischen den Properties (nicht die `\n` im private_key).

---

## ✅ Checkliste

Nach Abschluss aller Schritte solltest du haben:

- [ ] Firebase Projekt erstellt
- [ ] Firestore Database aktiviert
- [ ] Service Account JSON heruntergeladen
- [ ] Service Account JSON Inhalt kopiert (für Vercel)
- [ ] Firestore Sicherheitsregeln konfiguriert
- [ ] Projekt-ID notiert (wird später benötigt)

---

## 🆘 Häufige Probleme

### Problem: "Service Account" Tab nicht sichtbar
**Lösung:** Stelle sicher, dass du als Projekt-Owner eingeloggt bist

### Problem: JSON-Datei kann nicht geöffnet werden
**Lösung:** Öffne mit einem Texteditor (VS Code, Notepad++, TextEdit)

### Problem: "Permission denied" Fehler
**Lösung:** Prüfe die Firestore Security Rules (Schritt 6)

### Problem: Datenbank-Region nicht verfügbar
**Lösung:** Wähle eine andere Region (z.B. `us-central1` oder `europe-west1`)

---

## 📚 Nächste Schritte

Nach der Firebase-Einrichtung:

1. ✅ **Daten migrieren** (siehe `DEPLOY_VERCEL_FIREBASE.md`)
2. ✅ **Vercel Projekt erstellen** (siehe `DEPLOY_VERCEL_FIREBASE.md`)
3. ✅ **Environment Variables in Vercel setzen** (siehe `DEPLOY_VERCEL_FIREBASE.md`)

---

## 🔗 Nützliche Links

- Firebase Console: https://console.firebase.google.com/
- Firebase Dokumentation: https://firebase.google.com/docs
- Firestore Dokumentation: https://firebase.google.com/docs/firestore

---

## 💡 Tipps

- **Backup:** Speichere die Service Account JSON an einem sicheren Ort
- **Sicherheit:** Für Produktion solltest du Firebase Authentication aktivieren
- **Kosten:** Firebase hat ein kostenloses Kontingent (siehe Firebase Pricing)
- **Monitoring:** Nutze Firebase Console um Daten und Nutzung zu überwachen
