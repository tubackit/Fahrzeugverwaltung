import { useState, useEffect } from 'react';
import type { Fahrzeug, Schadensmeldung, WartungsMeldung } from '../types';
import FahrzeugSidebar from './FahrzeugSidebar';
import FahrzeugDetails from './FahrzeugDetails';
import VersicherungDetails from './VersicherungDetails';
import FahrzeugUnterlagen from './FahrzeugUnterlagen';
import FahrzeugReport from './FahrzeugReport';

type ActiveView = 'stammdaten' | 'versicherung' | 'unterlagen';

interface EnterpriseDashboardProps {
  activeView: ActiveView;
}

export default function EnterpriseDashboard({ activeView }: EnterpriseDashboardProps) {
  const [fahrzeuge, setFahrzeuge] = useState<Fahrzeug[]>([]);
  const [selectedFahrzeug, setSelectedFahrzeug] = useState<Fahrzeug | null>(null);
  const [schadensmeldungen, setSchadensmeldungen] = useState<Schadensmeldung[]>([]);
  const [wartungsmeldungen, setWartungsmeldungen] = useState<WartungsMeldung[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedFahrzeug) {
      loadMeldungen(selectedFahrzeug.id);
    }
  }, [selectedFahrzeug]);

  const loadData = async () => {
    try {
      const response = await fetch('/api/fahrzeuge');
      const data = await response.json();
      setFahrzeuge(data);
      
      // Erstes Fahrzeug automatisch auswählen
      if (data.length > 0 && !selectedFahrzeug) {
        setSelectedFahrzeug(data[0]);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Fahrzeuge:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMeldungen = async (fahrzeugId: number) => {
    try {
      const [schadenRes, wartungRes] = await Promise.all([
        fetch(`/api/fahrer/schaden/${fahrzeugId}`),
        fetch(`/api/fahrer/wartung/${fahrzeugId}`),
      ]);

      const schadenData = await schadenRes.json();
      const wartungData = await wartungRes.json();

      setSchadensmeldungen(schadenData);
      setWartungsmeldungen(wartungData);
    } catch (error) {
      console.error('Fehler beim Laden der Meldungen:', error);
    }
  };

  const handleFahrzeugSelect = (fahrzeug: Fahrzeug) => {
    setSelectedFahrzeug(fahrzeug);
  };

  const handleDataChange = () => {
    loadData();
    if (selectedFahrzeug) {
      loadMeldungen(selectedFahrzeug.id);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-gray-500 text-lg">Lädt Daten...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex overflow-hidden bg-gray-50">
      {/* Linke Spalte: Fahrzeugliste - Schmal (280px) */}
      <div className="h-full w-[280px] flex-shrink-0">
        <FahrzeugSidebar
          fahrzeuge={fahrzeuge}
          selectedFahrzeug={selectedFahrzeug}
          onSelect={handleFahrzeugSelect}
          onDataChange={handleDataChange}
        />
      </div>

      {/* Mittlere Spalte: Fahrzeugdetails, Versicherung oder Unterlagen - Breit */}
      {selectedFahrzeug ? (
        <div className="flex-1 h-full min-w-0">
          {activeView === 'stammdaten' ? (
            <FahrzeugDetails
              fahrzeug={selectedFahrzeug}
              onUpdate={handleDataChange}
            />
          ) : activeView === 'versicherung' ? (
            <VersicherungDetails
              fahrzeug={selectedFahrzeug}
              onUpdate={handleDataChange}
            />
          ) : (
            <FahrzeugUnterlagen
              fahrzeug={selectedFahrzeug}
            />
          )}
        </div>
      ) : (
        <div className="flex-1 h-full flex items-center justify-center bg-white">
          <div className="text-center">
            <div className="text-6xl mb-4">🚗</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Kein Fahrzeug ausgewählt
            </h2>
            <p className="text-gray-500">
              Wählen Sie ein Fahrzeug aus der Liste links
            </p>
          </div>
        </div>
      )}

      {/* Rechte Spalte: Report/Statistiken - Kompakt (320px) */}
      {selectedFahrzeug && (
        <div className="h-full w-[320px] flex-shrink-0">
          <FahrzeugReport
            fahrzeug={selectedFahrzeug}
            schadensmeldungen={schadensmeldungen}
            wartungsmeldungen={wartungsmeldungen}
          />
        </div>
      )}
    </div>
  );
}

