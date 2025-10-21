import type { Fahrzeug, Schadensmeldung, WartungsMeldung } from '../types';
import clsx from 'clsx';
import Kennzeichen from './Kennzeichen';
import DataCard, { DataField } from './DataCard';
import StatWidget from './StatWidget';

interface FahrzeugReportProps {
  fahrzeug: Fahrzeug;
  schadensmeldungen: Schadensmeldung[];
  wartungsmeldungen: WartungsMeldung[];
}

export default function FahrzeugReport({
  fahrzeug,
  schadensmeldungen,
  wartungsmeldungen,
}: FahrzeugReportProps) {
  // Alter des Fahrzeugs berechnen
  const fahrzeugAlter = fahrzeug.baujahr
    ? new Date().getFullYear() - fahrzeug.baujahr
    : null;

  // Letzte Schadensmeldung
  const letzterSchaden = schadensmeldungen.length > 0
    ? schadensmeldungen[0]
    : null;

  // Letzte Wartungsmeldung
  const letzteWartung = wartungsmeldungen.length > 0
    ? wartungsmeldungen[0]
    : null;

  // Offene Meldungen
  const offeneSchäden = schadensmeldungen.filter(
    (s) => s.status !== 'Abgeschlossen' && s.status !== 'Repariert'
  ).length;

  const offeneWartungen = wartungsmeldungen.filter(
    (w) => w.status !== 'Erledigt'
  ).length;

  return (
            <div className="h-full bg-gray-50 overflow-y-auto shadow-lg">
              <div className="p-4 space-y-3">
                {/* Header */}
                <div className="pb-3 text-center">
                  <h2 className="text-sm uppercase tracking-wide" style={{ color: 'black', fontWeight: '900' }}>
                    Kennzahlen
                  </h2>
                </div>

            {/* Widget-Grid */}
            {fahrzeugAlter && (
              <StatWidget 
                icon="📅" 
                label="Fahrzeugalter" 
                value={fahrzeugAlter} 
                unit="Jahre"
                color="blue"
              />
            )}

            <StatWidget 
              icon="🚗" 
              label="Fahrten" 
              value={41} 
              unit="gesamt"
              color="green"
            />

            <StatWidget 
              icon="⛽" 
              label="Getankt" 
              value="1.322" 
              unit="Liter"
              color="orange"
            />

            {/* Status-Übersicht */}
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-xs mb-3 uppercase tracking-wide" style={{ color: 'black', fontWeight: '900' }}>Status</div>
              <div className="space-y-3">
                <div className="flex flex-col items-center">
                  <span className="text-xs mb-1" style={{ color: 'black', fontWeight: '900' }}>Offene Schäden</span>
                  <span className={`text-sm font-bold ${offeneSchäden > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {offeneSchäden}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs mb-1" style={{ color: 'black', fontWeight: '900' }}>Offene Wartungen</span>
                  <span className={`text-sm font-bold ${offeneWartungen > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {offeneWartungen}
                  </span>
                </div>
              </div>
            </div>

            {/* Termine - Kompakte Liste */}
            <div className="bg-white rounded-lg shadow-sm p-4 text-center">
              <div className="text-xs mb-3 uppercase tracking-wide" style={{ color: 'black', fontWeight: '900' }}>Nächste Termine</div>
              <div className="space-y-3">
                {fahrzeug.huTermin && (
                  <div className="flex flex-col items-center">
                    <span className="text-xs mb-1" style={{ color: 'black', fontWeight: '900' }}>HU</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {new Date(fahrzeug.huTermin).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                )}
                {fahrzeug.auTermin && (
                  <div className="flex flex-col items-center">
                    <span className="text-xs mb-1" style={{ color: 'black', fontWeight: '900' }}>AU</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {new Date(fahrzeug.auTermin).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                )}
                {fahrzeug.spTermin && (
                  <div className="flex flex-col items-center">
                    <span className="text-xs mb-1" style={{ color: 'black', fontWeight: '900' }}>SP</span>
                    <span className="text-xs font-semibold text-gray-900">
                      {new Date(fahrzeug.spTermin).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
  );
}


