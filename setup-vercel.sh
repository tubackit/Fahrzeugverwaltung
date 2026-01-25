#!/bin/bash

# AutoLogic - Einfaches Vercel Setup Script
# Dieses Script führt dich durch das komplette Setup

set -e

echo "🚀 AutoLogic - Vercel Setup"
echo "============================"
echo ""

# Farben
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Schritt 1: Vercel CLI prüfen
echo -e "${BLUE}📦 Schritt 1: Vercel CLI prüfen...${NC}"
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI nicht gefunden${NC}"
    echo "Installiere Vercel CLI..."
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installiert${NC}"
else
    echo -e "${GREEN}✅ Vercel CLI gefunden${NC}"
fi
echo ""

# Schritt 2: Login prüfen
echo -e "${BLUE}🔐 Schritt 2: Vercel Login prüfen...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Nicht bei Vercel eingeloggt${NC}"
    echo "Bitte logge dich jetzt ein:"
    vercel login
else
    USER=$(vercel whoami)
    echo -e "${GREEN}✅ Eingeloggt als: ${USER}${NC}"
fi
echo ""

# Schritt 3: Service Account JSON
echo -e "${BLUE}🔑 Schritt 3: Firebase Service Account${NC}"
echo "Bitte gib den Pfad zur Firebase Service Account JSON-Datei ein:"
echo "(z.B. ~/Downloads/autologic-99357-firebase-adminsdk-fbsvc-9afcc7dad8.json)"
read -p "Pfad zur JSON-Datei: " SERVICE_ACCOUNT_PATH

# Erweitere ~ zu Home-Verzeichnis
SERVICE_ACCOUNT_PATH="${SERVICE_ACCOUNT_PATH/#\~/$HOME}"

if [ ! -f "$SERVICE_ACCOUNT_PATH" ]; then
    echo -e "${RED}❌ Datei nicht gefunden: $SERVICE_ACCOUNT_PATH${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Datei gefunden${NC}"

# Lese und konvertiere JSON zu einer Zeile
if command -v jq &> /dev/null; then
    SERVICE_ACCOUNT_JSON=$(cat "$SERVICE_ACCOUNT_PATH" | jq -c .)
else
    # Fallback: Entferne Zeilenumbrüche manuell (aber behalte \n im private_key)
    SERVICE_ACCOUNT_JSON=$(cat "$SERVICE_ACCOUNT_PATH" | tr -d '\n' | sed 's/  */ /g')
fi

echo -e "${GREEN}✅ Service Account JSON vorbereitet${NC}"
echo ""

# Schritt 4: Deployment
echo -e "${BLUE}🚀 Schritt 4: Deployment auf Vercel${NC}"
echo "Starte Deployment..."
echo ""

# Deploye
vercel --yes --prod 2>&1 | tee /tmp/vercel-deploy.log

# Versuche Deployment URL zu extrahieren
DEPLOYMENT_URL=$(grep -o 'https://[^ ]*\.vercel\.app' /tmp/vercel-deploy.log | head -1 || echo "")

if [ -z "$DEPLOYMENT_URL" ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Konnte Deployment URL nicht automatisch ermitteln${NC}"
    echo "Bitte gib die Vercel Deployment URL manuell ein:"
    echo "(z.B. https://autologic.vercel.app)"
    read -p "Vercel URL: " DEPLOYMENT_URL
fi

API_URL="${DEPLOYMENT_URL}/api"

echo ""
echo -e "${GREEN}✅ Deployment erfolgreich!${NC}"
echo -e "   URL: ${DEPLOYMENT_URL}"
echo -e "   API: ${API_URL}"
echo ""

# Schritt 5: Environment Variables
echo -e "${BLUE}🔧 Schritt 5: Environment Variables setzen...${NC}"
echo ""

# FIREBASE_SERVICE_ACCOUNT für alle Environments
echo "Setze FIREBASE_SERVICE_ACCOUNT..."
echo "$SERVICE_ACCOUNT_JSON" | vercel env add FIREBASE_SERVICE_ACCOUNT production 2>/dev/null || echo "  (existiert bereits oder Fehler - bitte manuell prüfen)"
echo "$SERVICE_ACCOUNT_JSON" | vercel env add FIREBASE_SERVICE_ACCOUNT preview 2>/dev/null || echo "  (existiert bereits oder Fehler - bitte manuell prüfen)"
echo "$SERVICE_ACCOUNT_JSON" | vercel env add FIREBASE_SERVICE_ACCOUNT development 2>/dev/null || echo "  (existiert bereits oder Fehler - bitte manuell prüfen)"

# VITE_API_URL für Frontend-Admin
echo ""
echo "Setze VITE_API_URL für frontend-admin..."
echo "$API_URL" | vercel env add VITE_API_URL production frontend-admin 2>/dev/null || echo "  (existiert bereits oder Fehler - bitte manuell prüfen)"
echo "$API_URL" | vercel env add VITE_API_URL preview frontend-admin 2>/dev/null || echo "  (existiert bereits oder Fehler - bitte manuell prüfen)"
echo "$API_URL" | vercel env add VITE_API_URL development frontend-admin 2>/dev/null || echo "  (existiert bereits oder Fehler - bitte manuell prüfen)"

# VITE_API_URL für Frontend-Driver
echo ""
echo "Setze VITE_API_URL für frontend-driver..."
echo "$API_URL" | vercel env add VITE_API_URL production frontend-driver 2>/dev/null || echo "  (existiert bereits oder Fehler - bitte manuell prüfen)"
echo "$API_URL" | vercel env add VITE_API_URL preview frontend-driver 2>/dev/null || echo "  (existiert bereits oder Fehler - bitte manuell prüfen)"
echo "$API_URL" | vercel env add VITE_API_URL development frontend-driver 2>/dev/null || echo "  (existiert bereits oder Fehler - bitte manuell prüfen)"

echo ""
echo -e "${GREEN}✅ Environment Variables gesetzt${NC}"
echo ""

# Schritt 6: Erneut deployen (damit Env Variables aktiv werden)
echo -e "${BLUE}🔄 Schritt 6: Erneutes Deployment (für Environment Variables)...${NC}"
vercel --prod

echo ""
echo -e "${GREEN}🎉 Setup abgeschlossen!${NC}"
echo ""
echo "📝 Zusammenfassung:"
echo "   - Deployment URL: ${DEPLOYMENT_URL}"
echo "   - API URL: ${API_URL}"
echo "   - Admin Frontend: ${DEPLOYMENT_URL}/admin"
echo "   - Driver Frontend: ${DEPLOYMENT_URL}/driver"
echo ""
echo "🔗 Nächste Schritte:"
echo "   1. Prüfe die URLs im Browser"
echo "   2. Teste die API: ${API_URL}/fahrzeuge"
echo "   3. Migriere Daten von SQLite zu Firestore (falls nötig)"
echo ""
echo "💡 Tipp: Falls Environment Variables nicht funktionieren,"
echo "   setze sie manuell im Vercel Dashboard:"
echo "   https://vercel.com/[dein-projekt]/settings/environment-variables"
echo ""
