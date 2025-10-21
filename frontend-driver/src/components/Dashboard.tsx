import { useState } from 'react';
import type { Fahrzeug } from '../types';
import KmStandForm from './KmStandForm';
import SchadensForm from './SchadensForm';
import WartungsForm from './WartungsForm';

interface DashboardProps {
  fahrzeug: Fahrzeug;
  onLogout: () => void;
}

type ActiveTab = 'km' | 'schaden' | 'wartung';

export default function Dashboard({ fahrzeug, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('km');
  const [currentKmStand, setCurrentKmStand] = useState(fahrzeug.aktuellerKmStand || 0);

  const handleKmUpdate = (newKmStand: number) => {
    setCurrentKmStand(newKmStand);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🚗 {fahrzeug.kennzeichen}
              </h1>
              <p className="text-sm text-gray-600">
                {fahrzeug.hersteller} {fahrzeug.modell}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
              data-test-id="button-logout"
              aria-label="Abmelden"
            >
              Abmelden
            </button>
          </div>
        </div>
      </header>

      {/* Info Card */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">📊</div>
            <div>
              <p className="text-sm text-blue-800 font-medium">Aktueller Kilometerstand</p>
              <p className="text-2xl font-bold text-blue-900">
                {currentKmStand.toLocaleString('de-DE')} km
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('km')}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition ${
                  activeTab === 'km'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                data-test-id="tab-km"
                aria-label="KM-Stand Tab"
              >
                📏 KM-Stand
              </button>
              <button
                onClick={() => setActiveTab('schaden')}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition ${
                  activeTab === 'schaden'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                data-test-id="tab-schaden"
                aria-label="Schaden melden Tab"
              >
                ⚠️ Schaden
              </button>
              <button
                onClick={() => setActiveTab('wartung')}
                className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm transition ${
                  activeTab === 'wartung'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                data-test-id="tab-wartung"
                aria-label="Wartung melden Tab"
              >
                🔧 Wartung
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'km' && (
              <KmStandForm
                fahrzeugId={fahrzeug.id}
                currentKmStand={currentKmStand}
                onSuccess={handleKmUpdate}
              />
            )}
            {activeTab === 'schaden' && (
              <SchadensForm
                fahrzeugId={fahrzeug.id}
                currentKmStand={currentKmStand}
              />
            )}
            {activeTab === 'wartung' && (
              <WartungsForm
                fahrzeugId={fahrzeug.id}
                currentKmStand={currentKmStand}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


