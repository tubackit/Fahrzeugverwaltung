# 🚗 AutoLogic

Moderne Fahrzeugverwaltungssoftware mit separatem Fahrer-Portal.

## 🏗️ Projekt-Struktur

```
autologic/
├── backend/           # Node.js + Express Backend API
├── frontend-admin/    # Admin Dashboard (React + TypeScript)
├── frontend-driver/   # Fahrer Portal (React + TypeScript)
├── shared/            # Gemeinsame Types und Utilities
└── docs/              # Dokumentation
```

## 🚀 Schnellstart

### Einfachster Weg (alle Server starten)

```bash
# Alles auf einmal installieren und starten
./start.sh
```

### Manuell

```bash
# 1. Dependencies installieren
npm run install:all

# 2. Alle Server starten
npm run dev:all
```

### Einzeln starten

```bash
npm run dev:backend   # Backend API (Port 3001)
npm run dev:admin     # Admin Dashboard (Port 5173)
npm run dev:driver    # Fahrer Portal (Port 5174)
```

## 🌐 Zugriff

Nach dem Start sind die Anwendungen unter folgenden URLs erreichbar:

- **Admin-Dashboard:** http://localhost:5173
- **Fahrer-Portal:** http://localhost:5174
- **Backend-API:** http://localhost:3001

### Test-Login (Fahrer-Portal)

- **Kennzeichen:** FZ-PLUS
- **PIN:** 1234

## 📦 Tech Stack

- **Frontend:** React 19, TypeScript, TailwindCSS, Vite
- **Backend:** Node.js, Express, TypeScript
- **Datenbank:** SQLite (mit automatischer Migration)
- **API:** RESTful API

## ✨ Features

### Admin Dashboard
- ✅ Vollständige Fahrzeugverwaltung mit Stammdaten
- ✅ Versicherungsdaten & Untersuchungstermine (TÜV, AU, SP)
- ✅ Einsatzort, Leasing-Ende, Autohaus, Kostenträger
- ✅ Datum Anschaffung, Vereinbarte Kilometer
- ✅ Schadensmeldungen & Wartungsmeldungen
- ✅ Kilometerstand-Tracking
- ✅ Excel-Export
- ✅ Responsive Design

### Fahrer Portal
- ✅ Login via Kennzeichen + PIN
- ✅ Kilometerstand eintragen
- ✅ Schäden melden (mit Fotos)
- ✅ Wartungsbedarf melden
- ✅ Mobile-optimiert

### Neu hinzugefügte Felder
- **Einsatzort** - Wo das Fahrzeug eingesetzt wird
- **Leasing Ende** - Enddatum des Leasingvertrags
- **Autohaus** - Name des zuständigen Autohauses
- **Kostenträger** - Abteilung oder Kostenstelle
- **Datum Anschaffung** - Anschaffungsdatum des Fahrzeugs
- **Vereinbarte KM** - Vereinbarte Jahreskilometer

## 🚢 Deployment

Siehe [DEPLOY.md](DEPLOY.md) für detaillierte Deployment-Anleitungen:

- **Lokal:** Einfach mit `./start.sh`
- **Railway.app:** Full-Stack Hosting (empfohlen)
- **Render.com:** Kostenlose Option
- **Docker:** Container-basiert

## 📝 Entwicklung

### Datenbank-Migration

Die Datenbank migriert automatisch beim Start. Neue Spalten werden automatisch hinzugefügt.

### Projekt-Struktur

```
backend/
├── src/
│   ├── db/          # Datenbank-Schema & Migration
│   ├── routes/      # API-Routen
│   └── index.ts     # Server-Entry-Point
└── database.sqlite  # SQLite-Datenbank (wird automatisch erstellt)

frontend-admin/
├── src/
│   ├── components/  # React-Komponenten
│   ├── types.ts     # TypeScript-Definitionen
│   └── App.tsx      # Haupt-App
└── vite.config.ts   # Vite-Konfiguration mit API-Proxy

frontend-driver/
├── src/
│   ├── components/  # React-Komponenten
│   └── App.tsx      # Haupt-App
└── vite.config.ts   # Vite-Konfiguration

shared/
└── types.ts         # Gemeinsame TypeScript-Typen
```

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Commit deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

## 📄 Lizenz

Dieses Projekt ist privat.


