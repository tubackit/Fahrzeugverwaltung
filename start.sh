#!/bin/bash

echo "🚗 AutoLogic - Starte alle Server..."
echo ""

# Farben für Output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Prüfe ob node_modules existiert
if [ ! -d "node_modules" ]; then
    echo "📦 Installiere Dependencies..."
    npm install
fi

# Prüfe Backend Dependencies
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installiere Backend Dependencies..."
    cd backend && npm install && cd ..
fi

# Prüfe Frontend-Admin Dependencies
if [ ! -d "frontend-admin/node_modules" ]; then
    echo "📦 Installiere Frontend-Admin Dependencies..."
    cd frontend-admin && npm install && cd ..
fi

# Prüfe Frontend-Driver Dependencies
if [ ! -d "frontend-driver/node_modules" ]; then
    echo "📦 Installiere Frontend-Driver Dependencies..."
    cd frontend-driver && npm install && cd ..
fi

echo ""
echo -e "${GREEN}✅ Alle Dependencies installiert${NC}"
echo ""
echo -e "${BLUE}🚀 Starte alle Server...${NC}"
echo ""
echo "   Backend:        http://localhost:3001"
echo "   Admin-Frontend: http://localhost:5173"
echo "   Fahrer-Frontend: http://localhost:5174"
echo ""
echo "Drücke Strg+C zum Beenden"
echo ""

# Starte alle Server parallel
npm run dev:all

