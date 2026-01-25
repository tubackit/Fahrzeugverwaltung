import { useState } from 'react';
import type { Fahrzeug, Schadensmeldung, WartungsMeldung } from '../types';
import clsx from 'clsx';
import Kennzeichen from './Kennzeichen';
import DataCard, { DataField } from './DataCard';
import StatWidget from './StatWidget';

interface FahrzeugReportProps {
  fahrzeug: Fahrzeug;
  schadensmeldungen: Schadensmeldung[];
  wartungsmeldungen: WartungsMeldung[];
  onMeldungenUpdate?: () => void;
}

export default function FahrzeugReport({
  fahrzeug,
  schadensmeldungen,
  wartungsmeldungen,
  onMeldungenUpdate,
}: FahrzeugReportProps) {
  const [updatingSchaden, setUpdatingSchaden] = useState<number | null>(null);
  const [updatingWartung, setUpdatingWartung] = useState<number | null>(null);

  const handleSchadenStatusUpdate = async (schadenId: number, neuerStatus: 'Repariert' | 'Abgeschlossen') => {
    setUpdatingSchaden(schadenId);
    try {
      const response = await fetch(`/api/fahrer/schaden/${schadenId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: neuerStatus }),
      });

      if (response.ok) {
        if (onMeldungenUpdate) {
          onMeldungenUpdate();
        }
      } else {
        alert('Fehler beim Aktualisieren des Status');
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Schadensmeldung:', error);
      alert('Verbindungsfehler');
    } finally {
      setUpdatingSchaden(null);
    }
  };

  const handleWartungStatusUpdate = async (wartungId: number) => {
    setUpdatingWartung(wartungId);
    try {
      const response = await fetch(`/api/fahrer/wartung/${wartungId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Erledigt' }),
      });

      if (response.ok) {
        if (onMeldungenUpdate) {
          onMeldungenUpdate();
        }
      } else {
        alert('Fehler beim Aktualisieren des Status');
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Wartungsmeldung:', error);
      alert('Verbindungsfehler');
    } finally {
      setUpdatingWartung(null);
    }
  };

  // E-Mail für Wartungsmeldung erstellen
  const createWartungEmail = (wartung: WartungsMeldung): string => {
    if (!fahrzeug.autohaus) {
      return '';
    }

    // Prüfen, ob es eine E-Mail-Adresse ist
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(fahrzeug.autohaus)) {
      return '';
    }

    const betreff = encodeURIComponent(
      `Terminanfrage für Wartung - Fahrzeug ${fahrzeug.kennzeichen}`
    );

    const kmStandText = wartung.kmStand
      ? `\nAktueller Kilometerstand: ${wartung.kmStand.toLocaleString('de-DE')} km`
      : '';

    const dringlichkeitText = wartung.dringlichkeit
      ? `\nDringlichkeit: ${wartung.dringlichkeit}`
      : '';

    const datumText = wartung.datum
      ? `\nDatum der Meldung: ${new Date(wartung.datum).toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}`
      : '';

    const body = encodeURIComponent(
      `Sehr geehrte Damen und Herren,

ich möchte einen Termin für eine Wartung/Reparatur vereinbaren.

Fahrzeugdetails:
Kennzeichen: ${fahrzeug.kennzeichen}
Hersteller: ${fahrzeug.hersteller}
Modell: ${fahrzeug.modell}${kmStandText}${dringlichkeitText}${datumText}

Beschreibung:
${wartung.beschreibung}

${wartung.bemerkungen ? `\nBemerkungen:\n${wartung.bemerkungen}\n` : ''}

Bitte kontaktieren Sie mich zur Terminvereinbarung.

Mit freundlichen Grüßen`
    );

    return `mailto:${fahrzeug.autohaus}?subject=${betreff}&body=${body}`;
  };
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

  // Schäden nach Datum sortieren (neueste zuerst)
  const sortierteSchäden = [...schadensmeldungen].sort((a, b) => 
    new Date(b.datum).getTime() - new Date(a.datum).getTime()
  );

  // Wartungen nach Datum sortieren (neueste zuerst)
  const sortierteWartungen = [...wartungsmeldungen].sort((a, b) => 
    new Date(b.datum).getTime() - new Date(a.datum).getTime()
  );

  return (
            <div className="h-full overflow-y-auto shadow-lg" style={{ backgroundColor: '#faf8f5' }}>
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

            {fahrzeug.huTermin && (
              <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                <div className="flex flex-col items-center gap-2 mb-3">
                  <div className="text-3xl">🔧</div>
                  <div className="text-xs uppercase tracking-wide" style={{ color: 'black', fontWeight: '900' }}>Nächste HU</div>
                </div>
                <div className="flex flex-col items-center gap-1 mb-3">
                  <div className="text-3xl font-bold text-orange-600">
                    {new Date(fahrzeug.huTermin).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </div>
                </div>
                <button
                  onClick={async () => {
                    if (confirm('HU-Termin als erledigt markieren?')) {
                      try {
                        const response = await fetch(`/api/fahrzeuge/${fahrzeug.id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ huTermin: null }),
                        });

                        if (response.ok) {
                          if (onMeldungenUpdate) {
                            onMeldungenUpdate();
                          }
                        } else {
                          alert('Fehler beim Aktualisieren');
                        }
                      } catch (error) {
                        console.error('Fehler beim Aktualisieren:', error);
                        alert('Verbindungsfehler');
                      }
                    }
                  }}
                  className="w-full text-xs px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded transition font-medium"
                  data-test-id="button-hu-erledigt"
                  aria-label="HU als erledigt markieren"
                >
                  ✅ Erledigt
                </button>
              </div>
            )}

            {fahrzeug.leasingEnde && (
              <StatWidget 
                icon="📋" 
                label="Leasing Ende" 
                value={new Date(fahrzeug.leasingEnde).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })} 
                unit=""
                color="purple"
              />
            )}

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

            {/* Schadensmeldungen - Kompakte Liste */}
            {schadensmeldungen.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-xs mb-3 uppercase tracking-wide text-center" style={{ color: 'black', fontWeight: '900' }}>
                  Schadensmeldungen ({schadensmeldungen.length})
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {sortierteSchäden.slice(0, 5).map((schaden) => (
                    <div
                      key={schaden.id}
                      className="border-l-4 pl-3 py-2 rounded"
                      style={{
                        borderColor:
                          schaden.schweregrad === 'Schwer'
                            ? '#ef4444'
                            : schaden.schweregrad === 'Mittel'
                            ? '#f97316'
                            : '#eab308',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={clsx(
                            'text-xs font-semibold px-2 py-0.5 rounded',
                            schaden.schweregrad === 'Schwer'
                              ? 'bg-red-100 text-red-800'
                              : schaden.schweregrad === 'Mittel'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-yellow-100 text-yellow-800'
                          )}
                        >
                          {schaden.schweregrad}
                        </span>
                        <span
                          className={clsx(
                            'text-xs px-2 py-0.5 rounded',
                            schaden.status === 'Abgeschlossen'
                              ? 'bg-green-100 text-green-800'
                              : schaden.status === 'Repariert'
                              ? 'bg-green-100 text-green-800'
                              : schaden.status === 'In Bearbeitung'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          )}
                        >
                          {schaden.status}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-900 mb-1 line-clamp-2">
                        {schaden.beschreibung}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <span>{schaden.schadensart}</span>
                        <span>•</span>
                        <span>{new Date(schaden.datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}</span>
                      </div>
                      {schaden.status !== 'Abgeschlossen' && schaden.status !== 'Repariert' && (
                        <div className="flex gap-1 mt-2">
                          <button
                            onClick={() => handleSchadenStatusUpdate(schaden.id, 'Repariert')}
                            disabled={updatingSchaden === schaden.id}
                            className="flex-1 text-xs px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded transition font-medium"
                            data-test-id={`button-repariert-${schaden.id}`}
                            aria-label="Als Repariert markieren"
                          >
                            {updatingSchaden === schaden.id ? '...' : '✅ Repariert'}
                          </button>
                          <button
                            onClick={() => handleSchadenStatusUpdate(schaden.id, 'Abgeschlossen')}
                            disabled={updatingSchaden === schaden.id}
                            className="flex-1 text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded transition font-medium"
                            data-test-id={`button-abgeschlossen-${schaden.id}`}
                            aria-label="Als Abgeschlossen markieren"
                          >
                            {updatingSchaden === schaden.id ? '...' : '✔️ Abgeschlossen'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {schadensmeldungen.length > 5 && (
                    <div className="text-xs text-center text-gray-500 pt-2">
                      +{schadensmeldungen.length - 5} weitere
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Wartungsmeldungen - Kompakte Liste */}
            {wartungsmeldungen.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="text-xs mb-3 uppercase tracking-wide text-center" style={{ color: 'black', fontWeight: '900' }}>
                  Wartungsmeldungen ({wartungsmeldungen.length})
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {sortierteWartungen.slice(0, 5).map((wartung) => (
                    <div
                      key={wartung.id}
                      className="border-l-4 pl-3 py-2 rounded"
                      style={{
                        borderColor:
                          wartung.dringlichkeit === 'Sofort'
                            ? '#ef4444'
                            : wartung.dringlichkeit === 'Hoch'
                            ? '#f97316'
                            : wartung.dringlichkeit === 'Mittel'
                            ? '#eab308'
                            : '#22c55e',
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={clsx(
                            'text-xs font-semibold px-2 py-0.5 rounded',
                            wartung.dringlichkeit === 'Sofort'
                              ? 'bg-red-100 text-red-800'
                              : wartung.dringlichkeit === 'Hoch'
                              ? 'bg-orange-100 text-orange-800'
                              : wartung.dringlichkeit === 'Mittel'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          )}
                        >
                          {wartung.dringlichkeit}
                        </span>
                        <span
                          className={clsx(
                            'text-xs px-2 py-0.5 rounded',
                            wartung.status === 'Erledigt'
                              ? 'bg-green-100 text-green-800'
                              : wartung.status === 'Geplant'
                              ? 'bg-blue-100 text-blue-800'
                              : wartung.status === 'Bestätigt'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          )}
                        >
                          {wartung.status}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-gray-900 mb-1 line-clamp-2">
                        {wartung.beschreibung}
                      </p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">
                          {new Date(wartung.datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex gap-1 mt-2">
                        {fahrzeug.autohaus && createWartungEmail(wartung) && (
                          <a
                            href={createWartungEmail(wartung)}
                            className="flex-1 text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition font-medium text-center"
                            data-test-id={`button-email-${wartung.id}`}
                            aria-label="E-Mail an Autohaus senden"
                            onClick={(e) => e.stopPropagation()}
                          >
                            📧 E-Mail
                          </a>
                        )}
                        {wartung.status !== 'Erledigt' && (
                          <button
                            onClick={() => handleWartungStatusUpdate(wartung.id)}
                            disabled={updatingWartung === wartung.id}
                            className={clsx(
                              'text-xs px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white rounded transition font-medium',
                              fahrzeug.autohaus && createWartungEmail(wartung) ? 'flex-1' : 'w-full'
                            )}
                            data-test-id={`button-erledigt-${wartung.id}`}
                            aria-label="Als Erledigt markieren"
                          >
                            {updatingWartung === wartung.id ? '...' : '✅ Erledigt'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {wartungsmeldungen.length > 5 && (
                    <div className="text-xs text-center text-gray-500 pt-2">
                      +{wartungsmeldungen.length - 5} weitere
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
  );
}


