# Fahrzeug Plus 6 Enterprise - Deployment Guide

## Lokale Installation

### Voraussetzungen
- Node.js 18+ installiert
- npm installiert

### Installation & Start

```bash
# 1. Repository klonen
git clone <IHR-REPOSITORY-URL>
cd Fahrzeugverwaltung

# 2. Dependencies installieren
npm install

# 3. Backend starten (Terminal 1)
cd backend
npm install
npm run dev
# Backend läuft auf http://localhost:3001

# 4. Admin-Frontend starten (Terminal 2)
cd frontend-admin
npm install
npm run dev
# Admin-Frontend läuft auf http://localhost:5173

# 5. Fahrer-Frontend starten (Terminal 3)
cd frontend-driver
npm install
npm run dev
# Fahrer-Frontend läuft auf http://localhost:5174
```

### Zugriff

- **Admin-Dashboard:** http://localhost:5173
- **Fahrer-Dashboard:** http://localhost:5174
- **Backend-API:** http://localhost:3001

### Beispiel-Login (Fahrer-Dashboard)

- **Kennzeichen:** FZ-PLUS
- **PIN:** 1234

## Cloud-Deployment

### Option 1: Railway.app (Empfohlen)

1. Account erstellen auf [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Repository auswählen
4. 3 Services erstellen:
   - Backend
   - Frontend-Admin
   - Frontend-Driver

**Backend Konfiguration:**
```
Root Directory: /backend
Start Command: npm run dev
Port: 3001
```

**Frontend-Admin Konfiguration:**
```
Root Directory: /frontend-admin
Start Command: npm run dev
Port: 5173
Environment Variables:
  VITE_API_URL=<BACKEND_URL>
```

**Frontend-Driver Konfiguration:**
```
Root Directory: /frontend-driver
Start Command: npm run dev
Port: 5174
Environment Variables:
  VITE_API_URL=<BACKEND_URL>
```

### Option 2: Render.com (Kostenlos)

1. Account erstellen auf [render.com](https://render.com)
2. "New +" → "Web Service" für Backend
3. "New +" → "Static Site" für beide Frontends

### Option 3: Docker

```bash
docker-compose up
```

## Features

✅ Fahrzeugverwaltung mit vollständigen Stammdaten
✅ Versicherungsdaten & Untersuchungstermine
✅ Schadensmeldungen & Wartungsmeldungen
✅ Kilometerstand-Tracking
✅ Fahrer-Login mit PIN
✅ Excel-Export
✅ Responsive Design

## Neue Felder

Die folgenden Felder wurden hinzugefügt:

- **Einsatzort** - Standort des Fahrzeugs
- **Leasing Ende** - Enddatum des Leasingvertrags
- **Autohaus** - Name des Autohauses
- **Kostenträger** - Abteilung oder Kostenstelle
- **Datum Anschaffung** - Anschaffungsdatum
- **Vereinbarte KM** - Vereinbarte Jahreskilometer

## Technologie-Stack

- **Backend:** Node.js, Express, SQLite, TypeScript
- **Frontend:** React 19, TypeScript, TailwindCSS, Vite
- **Datenbank:** SQLite mit automatischer Migration

