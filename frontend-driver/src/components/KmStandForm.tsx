import { useState } from 'react';

interface KmStandFormProps {
  fahrzeugId: number;
  currentKmStand: number;
  onSuccess: (newKmStand: number) => void;
}

export default function KmStandForm({ fahrzeugId, currentKmStand, onSuccess }: KmStandFormProps) {
  const [kmStand, setKmStand] = useState(currentKmStand.toString());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const newKmStand = parseFloat(kmStand);

    if (newKmStand < currentKmStand) {
      setMessage({ type: 'error', text: 'Der neue KM-Stand muss höher als der aktuelle sein.' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/fahrer/km-stand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fahrzeugId, kmStand: newKmStand }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Kilometerstand erfolgreich aktualisiert!' });
        onSuccess(newKmStand);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Fehler beim Aktualisieren' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Verbindungsfehler. Bitte versuchen Sie es erneut.' });
      console.error('KM-Stand update error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Kilometerstand aktualisieren</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="kmStand" className="block text-sm font-medium text-gray-700 mb-2">
            Neuer Kilometerstand
          </label>
          <div className="relative">
            <input
              id="kmStand"
              type="number"
              step="0.1"
              value={kmStand}
              onChange={(e) => setKmStand(e.target.value)}
              placeholder="z.B. 25500"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12"
              data-test-id="input-km-stand"
              aria-label="Kilometerstand eingeben"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">km</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Aktuell: {currentKmStand.toLocaleString('de-DE')} km
          </p>
        </div>

        {message && (
          <div
            className={`px-4 py-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          data-test-id="button-submit-km"
          aria-label="Kilometerstand speichern"
        >
          {loading ? 'Wird gespeichert...' : 'Kilometerstand speichern'}
        </button>
      </form>
    </div>
  );
}


