# ✅ Fix: Vercel Route Conflict behoben

## ❌ Problem

Vercel konnte nicht zwischen diesen Routes unterscheiden:
- `api/fahrer/schaden/[fahrzeugId].ts` → `/api/fahrer/schaden/:fahrzeugId`
- `api/fahrer/schaden/[id]/index.ts` → `/api/fahrer/schaden/:id`

Beide wurden als `/api/fahrer/schaden/:param` interpretiert.

## ✅ Lösung

Ich habe die Routes umstrukturiert:

### Vorher:
```
api/fahrer/schaden/
├── [fahrzeugId].ts          → /api/fahrer/schaden/:fahrzeugId
└── [id]/
    └── index.ts              → /api/fahrer/schaden/:id
```

### Nachher:
```
api/fahrer/schaden/
├── fahrzeug/
│   └── [fahrzeugId].ts       → /api/fahrer/schaden/fahrzeug/:fahrzeugId
└── [id]/
    └── index.ts              → /api/fahrer/schaden/:id
```

**Gleiche Änderung für `wartung`:**
```
api/fahrer/wartung/
├── fahrzeug/
│   └── [fahrzeugId].ts       → /api/fahrer/wartung/fahrzeug/:fahrzeugId
└── [id]/
    └── index.ts              → /api/fahrer/wartung/:id
```

---

## 🔄 Neue API-Endpunkte

### Schadensmeldungen:
- `GET /api/fahrer/schaden` → Alle Schäden
- `POST /api/fahrer/schaden` → Schaden erstellen
- `GET /api/fahrer/schaden/fahrzeug/:fahrzeugId` → Schäden für Fahrzeug
- `GET /api/fahrer/schaden/:id` → Einzelner Schaden (falls vorhanden)
- `PUT /api/fahrer/schaden/:id` → Schaden aktualisieren

### Wartungsmeldungen:
- `GET /api/fahrer/wartung` → Alle Wartungen
- `POST /api/fahrer/wartung` → Wartung erstellen
- `GET /api/fahrer/wartung/fahrzeug/:fahrzeugId` → Wartungen für Fahrzeug
- `GET /api/fahrer/wartung/:id` → Einzelne Wartung (falls vorhanden)
- `PUT /api/fahrer/wartung/:id` → Wartung aktualisieren

---

## ⚠️ Wichtig: Frontend anpassen

Falls das Frontend diese Endpunkte verwendet, müssen die URLs angepasst werden:

### Vorher:
```typescript
GET /api/fahrer/schaden/${fahrzeugId}
GET /api/fahrer/wartung/${fahrzeugId}
```

### Nachher:
```typescript
GET /api/fahrer/schaden/fahrzeug/${fahrzeugId}
GET /api/fahrer/wartung/fahrzeug/${fahrzeugId}
```

---

## 🚀 Nächste Schritte

1. **Commit und Push** die Änderungen
2. **Vercel deployt automatisch**
3. **Teste die neuen Endpunkte**

---

## 📝 Geänderte Dateien

- ✅ `backend/api/fahrer/schaden/[fahrzeugId].ts` → `backend/api/fahrer/schaden/fahrzeug/[fahrzeugId].ts`
- ✅ `backend/api/fahrer/wartung/[fahrzeugId].ts` → `backend/api/fahrer/wartung/fahrzeug/[fahrzeugId].ts`
- ✅ Import-Pfade korrigiert (von `../../lib` zu `../../../lib`)
