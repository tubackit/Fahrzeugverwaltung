import { useState, useEffect } from 'react';
import type { Fahrzeug } from '../types';
import DataCard, { DataField } from './DataCard';

interface ReifenDetailsProps {
  fahrzeug: Fahrzeug;
  onUpdate: () => void;
}

type ReifenTyp = 'sommer' | 'winter';

export default function ReifenDetails({ fahrzeug, onUpdate }: ReifenDetailsProps) {
  const [reifenTyp, setReifenTyp] = useState<ReifenTyp>('sommer');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Generiere Feldnamen basierend auf Reifen-Typ
  const getFieldName = (baseName: string): string => {
    return `${baseName}${reifenTyp === 'sommer' ? 'Sommer' : 'Winter'}`;
  };
  
  // Lade aktuelle Werte basierend auf Reifen-Typ
  const getCurrentValues = () => {
    const suffix = reifenTyp === 'sommer' ? 'Sommer' : 'Winter';
    return {
      reifenMarke: fahrzeug[`reifenMarke${suffix}` as keyof Fahrzeug] as string || '',
      reifenModell: fahrzeug[`reifenModell${suffix}` as keyof Fahrzeug] as string || '',
      reifenGroesse: fahrzeug[`reifenGroesse${suffix}` as keyof Fahrzeug] as string || '',
      reifenMontagedatum: fahrzeug[`reifenMontagedatum${suffix}` as keyof Fahrzeug] as string || '',
      reifenKmBeiMontage: fahrzeug[`reifenKmBeiMontage${suffix}` as keyof Fahrzeug] as number || '',
      profiltiefeVL: fahrzeug[`reifenProfiltiefeVL${suffix}` as keyof Fahrzeug] as number || '',
      profiltiefeVR: fahrzeug[`reifenProfiltiefeVR${suffix}` as keyof Fahrzeug] as number || '',
      profiltiefeHL: fahrzeug[`reifenProfiltiefeHL${suffix}` as keyof Fahrzeug] as number || '',
      profiltiefeHR: fahrzeug[`reifenProfiltiefeHR${suffix}` as keyof Fahrzeug] as number || '',
    };
  };

  const [formData, setFormData] = useState(getCurrentValues());
  const [profiltiefen, setProfiltiefen] = useState({
    VL: '',
    VR: '',
    HL: '',
    HR: '',
  });

  // Aktualisiere Daten, wenn sich das Fahrzeug oder der Reifen-Typ ändert
  useEffect(() => {
    const values = getCurrentValues();
    setFormData(values);
    setProfiltiefen({
      VL: values.profiltiefeVL !== '' && values.profiltiefeVL !== null && values.profiltiefeVL !== undefined
        ? String(values.profiltiefeVL)
        : '',
      VR: values.profiltiefeVR !== '' && values.profiltiefeVR !== null && values.profiltiefeVR !== undefined
        ? String(values.profiltiefeVR)
        : '',
      HL: values.profiltiefeHL !== '' && values.profiltiefeHL !== null && values.profiltiefeHL !== undefined
        ? String(values.profiltiefeHL)
        : '',
      HR: values.profiltiefeHR !== '' && values.profiltiefeHR !== null && values.profiltiefeHR !== undefined
        ? String(values.profiltiefeHR)
        : '',
    });
    setIsEditing(false); // Beende Bearbeitungsmodus beim Wechseln
  }, [fahrzeug, reifenTyp]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfiltiefeChange = (position: 'VL' | 'VR' | 'HL' | 'HR', value: string) => {
    setProfiltiefen(prev => ({
      ...prev,
      [position]: value
    }));
  };

  const handleSaveProfiltiefe = async (position: 'VL' | 'VR' | 'HL' | 'HR') => {
    const profiltiefeValue = profiltiefen[position];
    const fieldName = `reifenProfiltiefe${position}${reifenTyp === 'sommer' ? 'Sommer' : 'Winter'}`;
    
    // Wenn leer, dann null (löschen)
    let profiltiefeNumber: number | null = null;
    if (profiltiefeValue !== '' && profiltiefeValue !== null && profiltiefeValue !== undefined) {
      profiltiefeNumber = parseFloat(profiltiefeValue);
      if (isNaN(profiltiefeNumber) || profiltiefeNumber < 0) {
        alert('Bitte geben Sie eine gültige Profiltiefe ein (≥ 0 mm)');
        return;
      }
    }
    
    setLoading(true);
    try {
      const response = await fetch(`/api/fahrzeuge/${fahrzeug.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [fieldName]: profiltiefeNumber }),
      });

      if (response.ok) {
        // Daten vom Server aktualisieren - der useEffect wird dann den State synchronisieren
        onUpdate();
      } else {
        const data = await response.json();
        alert(data.error || 'Fehler beim Speichern der Profiltiefe');
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Profiltiefe:', error);
      alert('Verbindungsfehler');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const suffix = reifenTyp === 'sommer' ? 'Sommer' : 'Winter';
      const response = await fetch(`/api/fahrzeuge/${fahrzeug.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          [`reifenMarke${suffix}`]: formData.reifenMarke || null,
          [`reifenModell${suffix}`]: formData.reifenModell || null,
          [`reifenGroesse${suffix}`]: formData.reifenGroesse || null,
          [`reifenMontagedatum${suffix}`]: formData.reifenMontagedatum || null,
          [`reifenKmBeiMontage${suffix}`]: formData.reifenKmBeiMontage ? parseFloat(formData.reifenKmBeiMontage.toString()) : null,
        }),
      });

      if (response.ok) {
        onUpdate();
        setIsEditing(false);
      } else {
        alert('Fehler beim Speichern der Reifen-Daten');
      }
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Verbindungsfehler');
    } finally {
      setLoading(false);
    }
  };

  const reifenPositionen = [
    { id: 'VL', label: 'Vorne Links', icon: '🔄', field: 'reifenProfiltiefeVL' as const },
    { id: 'VR', label: 'Vorne Rechts', icon: '🔄', field: 'reifenProfiltiefeVR' as const },
    { id: 'HL', label: 'Hinten Links', icon: '🔄', field: 'reifenProfiltiefeHL' as const },
    { id: 'HR', label: 'Hinten Rechts', icon: '🔄', field: 'reifenProfiltiefeHR' as const },
  ];

  const currentValues = getCurrentValues();

  if (isEditing) {
    return (
      <div className="h-full overflow-y-auto bg-gray-50">
        <div className="bg-white px-6 py-5 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-2xl">🛞</span>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {reifenTyp === 'sommer' ? '☀️ Sommerreifen' : '❄️ Winterreifen'} bearbeiten
                </h1>
                <p className="text-sm text-gray-500">{fahrzeug.hersteller} {fahrzeug.modell}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Tabs */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setReifenTyp('sommer')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    reifenTyp === 'sommer'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  data-test-id="button-reifen-typ-sommer"
                  aria-label="Sommerreifen"
                >
                  ☀️ Sommer
                </button>
                <button
                  onClick={() => setReifenTyp('winter')}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    reifenTyp === 'winter'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  data-test-id="button-reifen-typ-winter"
                  aria-label="Winterreifen"
                >
                  ❄️ Winter
                </button>
              </div>
              <button
                onClick={() => {
                  setIsEditing(false);
                  const values = getCurrentValues();
                  setFormData(values);
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 font-medium transition-colors shadow-sm flex items-center gap-2"
                style={{ borderRadius: '16px' }}
                data-test-id="button-cancel-reifen"
                aria-label="Abbrechen"
              >
                ✖️ Abbrechen
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <DataCard title={`Allgemeine ${reifenTyp === 'sommer' ? 'Sommer' : 'Winter'}reifen-Daten`} icon="🛞">
            <div className="grid grid-cols-2 gap-x-12 gap-y-5">
              <div>
                <label htmlFor="reifenMarke" className="block text-sm font-medium text-gray-700 mb-2">
                  Marke
                </label>
                <input
                  id="reifenMarke"
                  name="reifenMarke"
                  type="text"
                  value={formData.reifenMarke}
                  onChange={handleChange}
                  placeholder="z.B. Michelin, Continental"
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
                  data-test-id="input-reifen-marke"
                  aria-label="Reifen Marke"
                />
              </div>
              <div>
                <label htmlFor="reifenModell" className="block text-sm font-medium text-gray-700 mb-2">
                  Modell
                </label>
                <input
                  id="reifenModell"
                  name="reifenModell"
                  type="text"
                  value={formData.reifenModell}
                  onChange={handleChange}
                  placeholder="z.B. Primacy 4"
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
                  data-test-id="input-reifen-modell"
                  aria-label="Reifen Modell"
                />
              </div>
              <div>
                <label htmlFor="reifenGroesse" className="block text-sm font-medium text-gray-700 mb-2">
                  Größe
                </label>
                <input
                  id="reifenGroesse"
                  name="reifenGroesse"
                  type="text"
                  value={formData.reifenGroesse}
                  onChange={handleChange}
                  placeholder="z.B. 205/65 R15"
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
                  data-test-id="input-reifen-groesse"
                  aria-label="Reifen Größe"
                />
              </div>
              <div>
                <label htmlFor="reifenMontagedatum" className="block text-sm font-medium text-gray-700 mb-2">
                  Montagedatum
                </label>
                <input
                  id="reifenMontagedatum"
                  name="reifenMontagedatum"
                  type="date"
                  value={formData.reifenMontagedatum}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
                  data-test-id="input-reifen-montagedatum"
                  aria-label="Reifen Montagedatum"
                />
              </div>
              <div>
                <label htmlFor="reifenKmBeiMontage" className="block text-sm font-medium text-gray-700 mb-2">
                  KM-Stand bei Montage
                </label>
                <input
                  id="reifenKmBeiMontage"
                  name="reifenKmBeiMontage"
                  type="number"
                  value={formData.reifenKmBeiMontage}
                  onChange={handleChange}
                  placeholder="z.B. 120000"
                  className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-gray-400 outline-none transition"
                  data-test-id="input-reifen-km-stand"
                  aria-label="KM-Stand bei Montage"
                />
              </div>
            </div>
          </DataCard>

          <div className="flex gap-4">
            <button
              onClick={() => {
                setIsEditing(false);
                const values = getCurrentValues();
                setFormData(values);
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition shadow-md"
              data-test-id="button-cancel-reifen-form"
              aria-label="Abbrechen"
            >
              ❌ Abbrechen
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-6 py-3 rounded-lg font-bold transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              data-test-id="button-save-reifen"
              aria-label="Reifen-Daten speichern"
            >
              {loading ? 'Wird gespeichert...' : '💾 Speichern'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 py-5 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-2xl">🛞</span>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Reifen</h1>
              <p className="text-sm text-gray-500">{fahrzeug.hersteller} {fahrzeug.modell}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setReifenTyp('sommer')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  reifenTyp === 'sommer'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                data-test-id="button-reifen-typ-sommer"
                aria-label="Sommerreifen"
              >
                ☀️ Sommer
              </button>
              <button
                onClick={() => setReifenTyp('winter')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  reifenTyp === 'winter'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                data-test-id="button-reifen-typ-winter"
                aria-label="Winterreifen"
              >
                ❄️ Winter
              </button>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2.5 font-medium transition-colors shadow-sm flex items-center gap-2"
              style={{ borderRadius: '16px' }}
              data-test-id="button-edit-reifen"
              aria-label="Reifen-Daten bearbeiten"
            >
              ✏️ Bearbeiten
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Allgemeine Reifen-Daten */}
        <DataCard title={`Allgemeine ${reifenTyp === 'sommer' ? 'Sommer' : 'Winter'}reifen-Daten`} icon="🛞">
          {currentValues.reifenMarke || currentValues.reifenModell || currentValues.reifenGroesse ? (
            <div className="grid grid-cols-2 gap-x-12 gap-y-5">
              <DataField label="Marke" value={currentValues.reifenMarke} />
              <DataField label="Modell" value={currentValues.reifenModell} />
              <DataField label="Größe" value={currentValues.reifenGroesse} />
              <DataField 
                label="Montagedatum" 
                value={currentValues.reifenMontagedatum ? new Date(currentValues.reifenMontagedatum).toLocaleDateString('de-DE') : undefined} 
              />
              <DataField 
                label="KM-Stand bei Montage" 
                value={currentValues.reifenKmBeiMontage ? Number(currentValues.reifenKmBeiMontage).toLocaleString('de-DE') : undefined} 
              />
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm mb-2">Keine {reifenTyp === 'sommer' ? 'Sommer' : 'Winter'}reifen-Daten hinterlegt</p>
              <p className="text-xs">Klicken Sie auf "Bearbeiten", um Reifen-Daten hinzuzufügen</p>
            </div>
          )}
        </DataCard>

        {/* Profiltiefen für alle 4 Reifen */}
        <DataCard title="Profiltiefen" icon="📏">
          <div className="grid grid-cols-2 gap-4">
            {reifenPositionen.map((pos) => {
              const currentProfiltiefe = profiltiefen[pos.id as 'VL' | 'VR' | 'HL' | 'HR'];
              let dbProfiltiefe: number | undefined | null;
              
              const suffix = reifenTyp === 'sommer' ? 'Sommer' : 'Winter';
              const fieldName = `reifenProfiltiefe${pos.id}${suffix}` as keyof Fahrzeug;
              dbProfiltiefe = fahrzeug[fieldName] as number | undefined | null;
              
              // Vergleiche String-Repräsentationen für präzisen Vergleich
              const normalizeValue = (val: string | number | null | undefined): string => {
                if (val === null || val === undefined || val === '') return '';
                const str = String(val).trim();
                if (str === '') return '';
                const num = parseFloat(str);
                if (!isNaN(num)) {
                  return num.toString();
                }
                return str;
              };
              
              const currentStr = normalizeValue(currentProfiltiefe);
              const dbStr = normalizeValue(dbProfiltiefe);
              
              // String-Vergleich ist einfacher und präziser
              const hasChanged = currentStr !== dbStr;
              
              return (
                <div key={pos.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{pos.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{pos.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      value={currentProfiltiefe}
                      onChange={(e) => handleProfiltiefeChange(pos.id as 'VL' | 'VR' | 'HL' | 'HR', e.target.value)}
                      onKeyDown={(e) => {
                        // Enter-Taste zum Speichern
                        if (e.key === 'Enter' && hasChanged) {
                          handleSaveProfiltiefe(pos.id as 'VL' | 'VR' | 'HL' | 'HR');
                          e.currentTarget.blur();
                        }
                      }}
                      placeholder={dbProfiltiefe !== undefined && dbProfiltiefe !== null ? dbProfiltiefe.toString() : 'mm'}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                      data-test-id={`input-profiltiefe-${pos.id}`}
                      aria-label={`Profiltiefe ${pos.label}`}
                    />
                    <span className="text-sm text-gray-600 font-medium whitespace-nowrap">mm</span>
                    <button
                      onClick={() => handleSaveProfiltiefe(pos.id as 'VL' | 'VR' | 'HL' | 'HR')}
                      disabled={loading || !hasChanged}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed shadow-sm"
                      data-test-id={`button-save-profiltiefe-${pos.id}`}
                      aria-label={`Profiltiefe ${pos.label} speichern`}
                      title={hasChanged ? 'Speichern' : 'Keine Änderungen'}
                    >
                      💾
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {dbProfiltiefe !== undefined && dbProfiltiefe !== null ? (
                      <>Gespeichert: {dbProfiltiefe} mm</>
                    ) : (
                      <>Noch nicht gespeichert</>
                    )}
                  </div>
                  {hasChanged && (
                    <div className="mt-1 text-xs text-blue-600 font-medium">
                      ✏️ Änderung vorhanden - auf 💾 klicken zum Speichern
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </DataCard>
      </div>
    </div>
  );
}
