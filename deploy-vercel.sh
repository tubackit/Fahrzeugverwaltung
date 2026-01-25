#!/bin/bash

# AutoLogic - Vercel Deployment Script
# Dieses Script hilft beim Deployment auf Vercel

set -e

echo "🚀 AutoLogic - Vercel Deployment Script"
echo ""

# Farben
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Prüfe ob Vercel CLI installiert ist
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI nicht gefunden${NC}"
    echo "Installiere Vercel CLI..."
    npm install -g vercel
    echo -e "${GREEN}✅ Vercel CLI installiert${NC}"
    echo ""
fi

# Prüfe ob eingeloggt
echo -e "${BLUE}📋 Prüfe Vercel Login-Status...${NC}"
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Nicht bei Vercel eingeloggt${NC}"
    echo "Bitte logge dich ein:"
    vercel login
fi

echo -e "${GREEN}✅ Bei Vercel eingeloggt${NC}"
echo ""

# Frage nach Firebase Service Account
echo -e "${BLUE}🔐 Firebase Service Account${NC}"
echo "Bitte gib den Pfad zur Firebase Service Account JSON-Datei ein:"
echo "(z.B. ./autologic-99357-firebase-adminsdk-fbsvc-9afcc7dad8.json)"
read -p "Pfad: " SERVICE_ACCOUNT_PATH

if [ ! -f "$SERVICE_ACCOUNT_PATH" ]; then
    echo -e "${RED}❌ Datei nicht gefunden: $SERVICE_ACCOUNT_PATH${NC}"
    exit 1
fi

# Lese Service Account JSON
echo -e "${BLUE}📖 Lese Service Account JSON...${NC}"
SERVICE_ACCOUNT_JSON=$(cat "$SERVICE_ACCOUNT_PATH" | jq -c . 2>/dev/null || cat "$SERVICE_ACCOUNT_PATH" | tr -d '\n' | sed 's/ //g')

if [ -z "$SERVICE_ACCOUNT_JSON" ]; then
    echo -e "${RED}❌ Konnte Service Account JSON nicht lesen${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Service Account JSON gelesen${NC}"
echo ""

# Frage nach API URL (wird nach Deployment bekannt)
echo -e "${BLUE}🌐 Vercel Deployment${NC}"
echo "Starte Deployment auf Vercel..."
echo ""

# Deploye auf Vercel
vercel --yes

# Hole die Deployment URL
DEPLOYMENT_URL=$(vercel ls --json | jq -r '.[0].url' 2>/dev/null || echo "")

if [ -z "$DEPLOYMENT_URL" ]; then
    echo -e "${YELLOW}⚠️  Konnte Deployment URL nicht automatisch ermitteln${NC}"
    echo "Bitte gib die Vercel Deployment URL manuell ein:"
    echo "(z.B. https://autologic.vercel.app)"
    read -p "URL: " DEPLOYMENT_URL
fi

API_URL="${DEPLOYMENT_URL}/api"

echo ""
echo -e "${GREEN}✅ Deployment erfolgreich!${NC}"
echo -e "   URL: ${DEPLOYMENT_URL}"
echo ""

# Setze Environment Variables
echo -e "${BLUE}🔧 Setze Environment Variables...${NC}"

# Firebase Service Account für alle Environments
echo "Setze FIREBASE_SERVICE_ACCOUNT..."
vercel env add FIREBASE_SERVICE_ACCOUNT production <<< "$SERVICE_ACCOUNT_JSON" || echo "Variable existiert bereits"
vercel env add FIREBASE_SERVICE_ACCOUNT preview <<< "$SERVICE_ACCOUNT_JSON" || echo "Variable existiert bereits"
vercel env add FIREBASE_SERVICE_ACCOUNT development <<< "$SERVICE_ACCOUNT_JSON" || echo "Variable existiert bereits"

# API URL für Frontend-Admin
echo "Setze VITE_API_URL für frontend-admin..."
vercel env add VITE_API_URL production frontend-admin <<< "$API_URL" || echo "Variable existiert bereits"
vercel env add VITE_API_URL preview frontend-admin <<< "$API_URL" || echo "Variable existiert bereits"
vercel env add VITE_API_URL development frontend-admin <<< "$API_URL" || echo "Variable existiert bereits"

# API URL für Frontend-Driver
echo "Setze VITE_API_URL für frontend-driver..."
vercel env add VITE_API_URL production frontend-driver <<< "$API_URL" || echo "Variable existiert bereits"
vercel env add VITE_API_URL preview frontend-driver <<< "$API_URL" || echo "Variable existiert bereits"
vercel env add VITE_API_URL development frontend-driver <<< "$API_URL" || echo "Variable existiert bereits"

echo ""
echo -e "${GREEN}✅ Environment Variables gesetzt${NC}"
echo ""

# Finale Informationen
echo -e "${GREEN}🎉 Deployment abgeschlossen!${NC}"
echo ""
echo "📝 Zusammenfassung:"
echo "   - Deployment URL: ${DEPLOYMENT_URL}"
echo "   - API URL: ${API_URL}"
echo "   - Admin Frontend: ${DEPLOYMENT_URL}/admin"
echo "   - Driver Frontend: ${DEPLOYMENT_URL}/driver"
echo ""
echo "🔗 Nächste Schritte:"
echo "   1. Prüfe die Deployment-URLs im Browser"
echo "   2. Teste die API-Endpoints"
echo "   3. Migriere Daten von SQLite zu Firestore (falls nötig)"
echo ""
