import { useState } from 'react';

interface ReifenProfiltiefeFormProps {
  fahrzeugId: number;
  currentKmStand: number;
}

export default function ReifenProfiltiefeForm({ fahrzeugId, currentKmStand }: ReifenProfiltiefeFormProps) {
  const [reifenArt, setReifenArt] = useState<'sommer' | 'winter'>('sommer');
  const [profiltiefen, setProfiltiefen] = useState({
    vl: '',
    vr: '',
    hl: '',
    hr: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (position: 'vl' | 'vr' | 'hl' | 'hr', value: string) => {
    // Nur Zahlen und Dezimalpunkt erlauben
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setProfiltiefen((prev) => ({
        ...prev,
        [position]: value,
      }));
      setError('');
      setSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Validierung
      const vl = profiltiefen.vl ? parseFloat(profiltiefen.vl) : null;
      const vr = profiltiefen.vr ? parseFloat(profiltiefen.vr) : null;
      const hl = profiltiefen.hl ? parseFloat(profiltiefen.hl) : null;
      const hr = profiltiefen.hr ? parseFloat(profiltiefen.hr) : null;

      if (vl !== null && (vl < 0 || vl > 20)) {
        setError('Profiltiefe VL muss zwischen 0 und 20 mm liegen');
        setLoading(false);
        return;
      }
      if (vr !== null && (vr < 0 || vr > 20)) {
        setError('Profiltiefe VR muss zwischen 0 und 20 mm liegen');
        setLoading(false);
        return;
      }
      if (hl !== null && (hl < 0 || hl > 20)) {
        setError('Profiltiefe HL muss zwischen 0 und 20 mm liegen');
        setLoading(false);
        return;
      }
      if (hr !== null && (hr < 0 || hr > 20)) {
        setError('Profiltiefe HR muss zwischen 0 und 20 mm liegen');
        setLoading(false);
        return;
      }

      // Backend-Aufruf
      const response = await fetch('/api/fahrer/reifen-profiltiefe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fahrzeugId,
          reifenArt,
          profiltiefen: {
            vl,
            vr,
            hl,
            hr,
          },
          kmStand: currentKmStand,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Speichern der Profiltiefen');
      }

      setSuccess(true);
      // Formular zurücksetzen
      setProfiltiefen({
        vl: '',
        vr: '',
        hl: '',
        hr: '',
      });
      
      // Nach 3 Sekunden Success-Message ausblenden
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="reifenArt"
          className="block text-sm font-medium text-gray-700 mb-3"
        >
          Reifenart
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => {
              setReifenArt('sommer');
              setSuccess(false);
              setError('');
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-base transition-all duration-200 border-2 ${
              reifenArt === 'sommer'
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }`}
            data-test-id="button-reifen-sommer"
            aria-label="Sommerreifen auswählen"
            aria-pressed={reifenArt === 'sommer'}
          >
            ☀️ Sommerreifen
          </button>
          <button
            type="button"
            onClick={() => {
              setReifenArt('winter');
              setSuccess(false);
              setError('');
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-base transition-all duration-200 border-2 ${
              reifenArt === 'winter'
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }`}
            data-test-id="button-reifen-winter"
            aria-label="Winterreifen auswählen"
            aria-pressed={reifenArt === 'winter'}
          >
            ❄️ Winterreifen
          </button>
        </div>
        {reifenArt && (
          <p className="mt-2 text-xs text-gray-500 text-center">
            Ausgewählt: {reifenArt === 'sommer' ? '☀️ Sommerreifen' : '❄️ Winterreifen'}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Profiltiefe eingeben (in mm)
        </label>
        <div className="grid grid-cols-2 gap-4">
          {/* Vorne Links */}
          <div>
            <label
              htmlFor="profiltiefe-vl"
              className="block text-xs text-gray-600 mb-1"
            >
              Vorne Links (VL)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="profiltiefe-vl"
                type="text"
                inputMode="decimal"
                value={profiltiefen.vl}
                onChange={(e) => handleInputChange('vl', e.target.value)}
                placeholder="6.5"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                data-test-id="input-profiltiefe-vl"
                aria-label="Profiltiefe Vorne Links"
              />
              <span className="text-gray-600 text-sm font-normal whitespace-nowrap">
                mm
              </span>
            </div>
          </div>

          {/* Vorne Rechts */}
          <div>
            <label
              htmlFor="profiltiefe-vr"
              className="block text-xs text-gray-600 mb-1"
            >
              Vorne Rechts (VR)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="profiltiefe-vr"
                type="text"
                inputMode="decimal"
                value={profiltiefen.vr}
                onChange={(e) => handleInputChange('vr', e.target.value)}
                placeholder="6.5"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                data-test-id="input-profiltiefe-vr"
                aria-label="Profiltiefe Vorne Rechts"
              />
              <span className="text-gray-600 text-sm font-normal whitespace-nowrap">
                mm
              </span>
            </div>
          </div>

          {/* Hinten Links */}
          <div>
            <label
              htmlFor="profiltiefe-hl"
              className="block text-xs text-gray-600 mb-1"
            >
              Hinten Links (HL)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="profiltiefe-hl"
                type="text"
                inputMode="decimal"
                value={profiltiefen.hl}
                onChange={(e) => handleInputChange('hl', e.target.value)}
                placeholder="6.5"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                data-test-id="input-profiltiefe-hl"
                aria-label="Profiltiefe Hinten Links"
              />
              <span className="text-gray-600 text-sm font-normal whitespace-nowrap">
                mm
              </span>
            </div>
          </div>

          {/* Hinten Rechts */}
          <div>
            <label
              htmlFor="profiltiefe-hr"
              className="block text-xs text-gray-600 mb-1"
            >
              Hinten Rechts (HR)
            </label>
            <div className="flex items-center gap-2">
              <input
                id="profiltiefe-hr"
                type="text"
                inputMode="decimal"
                value={profiltiefen.hr}
                onChange={(e) => handleInputChange('hr', e.target.value)}
                placeholder="6.5"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                data-test-id="input-profiltiefe-hr"
                aria-label="Profiltiefe Hinten Rechts"
              />
              <span className="text-gray-600 text-sm font-normal whitespace-nowrap">
                mm
              </span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
          role="alert"
        >
          ✓ Profiltiefen erfolgreich gespeichert!
        </div>
      )}

      <button
        type="submit"
        disabled={loading || (!profiltiefen.vl && !profiltiefen.vr && !profiltiefen.hl && !profiltiefen.hr)}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
        data-test-id="button-save-profiltiefe"
        aria-label="Profiltiefen speichern"
      >
        {loading ? 'Speichern...' : '💾 Profiltiefen speichern'}
      </button>
    </form>
  );
}

