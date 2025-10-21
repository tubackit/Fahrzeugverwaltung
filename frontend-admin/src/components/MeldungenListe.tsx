import { useState, useEffect } from 'react';
import clsx from 'clsx';
import type { Schadensmeldung, WartungsMeldung, Fahrzeug } from '../types';

export default function MeldungenListe() {
  const [schadensmeldungen, setSchadensmeldungen] = useState<Schadensmeldung[]>([]);
  const [wartungsmeldungen, setWartungsmeldungen] = useState<WartungsMeldung[]>([]);
  const [fahrzeuge, setFahrzeuge] = useState<Fahrzeug[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'schaden' | 'wartung'>('schaden');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [fahrzeugeRes, schadenRes, wartungRes] = await Promise.all([
        fetch('/api/fahrzeuge'),
        fetch('/api/fahrer/schaden/0'), // Backend müsste alle Schäden zurückgeben
        fetch('/api/fahrer/wartung/0'),  // Backend müsste alle Wartungen zurückgeben
      ]);

      const fahrzeugeData = await fahrzeugeRes.json();
      setFahrzeuge(fahrzeugeData);

      // Für jedes Fahrzeug die Meldungen laden
      const allSchaden: Schadensmeldung[] = [];
      const allWartung: WartungsMeldung[] = [];

      for (const fahrzeug of fahrzeugeData) {
        const schadenRes = await fetch(`/api/fahrer/schaden/${fahrzeug.id}`);
        const wartungRes = await fetch(`/api/fahrer/wartung/${fahrzeug.id}`);
        
        const schadenData = await schadenRes.json();
        const wartungData = await wartungRes.json();
        
        allSchaden.push(...schadenData);
        allWartung.push(...wartungData);
      }

      setSchadensmeldungen(allSchaden.sort((a, b) => 
        new Date(b.datum).getTime() - new Date(a.datum).getTime()
      ));
      setWartungsmeldungen(allWartung.sort((a, b) => 
        new Date(b.datum).getTime() - new Date(a.datum).getTime()
      ));
    } catch (error) {
      console.error('Fehler beim Laden der Meldungen:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFahrzeugInfo = (fahrzeugId: number) => {
    const fahrzeug = fahrzeuge.find((f) => f.id === fahrzeugId);
    return fahrzeug ? `${fahrzeug.kennzeichen} (${fahrzeug.hersteller} ${fahrzeug.modell})` : 'Unbekannt';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Lädt Meldungen...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Meldungen von Fahrern</h2>
        
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('schaden')}
            className={clsx(
              'px-6 py-2 rounded-md font-medium text-sm transition',
              activeTab === 'schaden'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            )}
            data-test-id="tab-schadensmeldungen"
            aria-label="Schadensmeldungen Tab"
          >
            ⚠️ Schadensmeldungen ({schadensmeldungen.length})
          </button>
          <button
            onClick={() => setActiveTab('wartung')}
            className={clsx(
              'px-6 py-2 rounded-md font-medium text-sm transition',
              activeTab === 'wartung'
                ? 'bg-white text-gray-900 shadow'
                : 'text-gray-600 hover:text-gray-900'
            )}
            data-test-id="tab-wartungsmeldungen"
            aria-label="Wartungsmeldungen Tab"
          >
            🔧 Wartungsmeldungen ({wartungsmeldungen.length})
          </button>
        </div>
      </div>

      {activeTab === 'schaden' && (
        <div className="space-y-4">
          {schadensmeldungen.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Keine Schadensmeldungen
              </h3>
              <p className="text-gray-600">
                Aktuell sind keine Schäden gemeldet.
              </p>
            </div>
          ) : (
            schadensmeldungen.map((meldung) => (
              <div
                key={meldung.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={clsx(
                          'px-3 py-1 rounded-full text-xs font-semibold',
                          meldung.schweregrad === 'Schwer'
                            ? 'bg-red-100 text-red-800'
                            : meldung.schweregrad === 'Mittel'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        )}
                      >
                        {meldung.schweregrad}
                      </span>
                      <span className="text-sm text-gray-500">{meldung.schadensart}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {getFahrzeugInfo(meldung.fahrzeugId)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{meldung.beschreibung}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>📅 {formatDate(meldung.datum)}</span>
                      <span>🛣️ {meldung.kmStand.toLocaleString('de-DE')} km</span>
                      {meldung.melder && <span>👤 {meldung.melder}</span>}
                    </div>
                  </div>
                  <span
                    className={clsx(
                      'px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
                      meldung.status === 'Abgeschlossen'
                        ? 'bg-green-100 text-green-800'
                        : meldung.status === 'In Bearbeitung'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {meldung.status}
                  </span>
                </div>
                {meldung.bemerkungen && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Bemerkungen:</span> {meldung.bemerkungen}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'wartung' && (
        <div className="space-y-4">
          {wartungsmeldungen.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Keine Wartungsmeldungen
              </h3>
              <p className="text-gray-600">
                Aktuell sind keine Wartungen gemeldet.
              </p>
            </div>
          ) : (
            wartungsmeldungen.map((meldung) => (
              <div
                key={meldung.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={clsx(
                          'px-3 py-1 rounded-full text-xs font-semibold',
                          meldung.dringlichkeit === 'Sofort'
                            ? 'bg-red-100 text-red-800'
                            : meldung.dringlichkeit === 'Hoch'
                            ? 'bg-orange-100 text-orange-800'
                            : meldung.dringlichkeit === 'Mittel'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        )}
                      >
                        {meldung.dringlichkeit}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {getFahrzeugInfo(meldung.fahrzeugId)}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">{meldung.beschreibung}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>📅 {formatDate(meldung.datum)}</span>
                      <span>🛣️ {meldung.kmStand.toLocaleString('de-DE')} km</span>
                      {meldung.melder && <span>👤 {meldung.melder}</span>}
                    </div>
                  </div>
                  <span
                    className={clsx(
                      'px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap',
                      meldung.status === 'Erledigt'
                        ? 'bg-green-100 text-green-800'
                        : meldung.status === 'Geplant'
                        ? 'bg-blue-100 text-blue-800'
                        : meldung.status === 'Bestätigt'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-gray-100 text-gray-800'
                    )}
                  >
                    {meldung.status}
                  </span>
                </div>
                {meldung.bemerkungen && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Bemerkungen:</span> {meldung.bemerkungen}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}


