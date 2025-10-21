import { useState } from 'react';
import type { WartungsMeldung } from '../types';

interface WartungsFormProps {
  fahrzeugId: number;
  currentKmStand: number;
}

export default function WartungsForm({ fahrzeugId, currentKmStand }: WartungsFormProps) {
  const [formData, setFormData] = useState<Partial<WartungsMeldung>>({
    fahrzeugId,
    kmStand: currentKmStand,
    beschreibung: '',
    dringlichkeit: 'Mittel',
    melder: '',
    bemerkungen: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      const response = await fetch('/api/fahrer/wartung', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Wartungsmeldung erfolgreich gesendet!' });
        setFormData({
          fahrzeugId,
          kmStand: currentKmStand,
          beschreibung: '',
          dringlichkeit: 'Mittel',
          melder: '',
          bemerkungen: '',
        });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Fehler beim Senden' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Verbindungsfehler. Bitte versuchen Sie es erneut.' });
      console.error('Wartungsmeldung error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Wartungsbedarf melden</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="dringlichkeit" className="block text-sm font-medium text-gray-700 mb-2">
            Dringlichkeit
          </label>
          <select
            id="dringlichkeit"
            name="dringlichkeit"
            value={formData.dringlichkeit}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            data-test-id="select-dringlichkeit"
            aria-label="Dringlichkeit auswählen"
          >
            <option value="Niedrig">Niedrig (kann warten)</option>
            <option value="Mittel">Mittel (bald erledigen)</option>
            <option value="Hoch">Hoch (zeitnah)</option>
            <option value="Sofort">Sofort (dringend!)</option>
          </select>
        </div>

        <div>
          <label htmlFor="kmStand" className="block text-sm font-medium text-gray-700 mb-2">
            Aktueller Kilometerstand
          </label>
          <input
            id="kmStand"
            name="kmStand"
            type="number"
            step="0.1"
            value={formData.kmStand}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            data-test-id="input-wartung-km"
            aria-label="Kilometerstand eingeben"
          />
        </div>

        <div>
          <label htmlFor="beschreibung" className="block text-sm font-medium text-gray-700 mb-2">
            Was muss gewartet werden? *
          </label>
          <textarea
            id="beschreibung"
            name="beschreibung"
            value={formData.beschreibung}
            onChange={handleChange}
            placeholder="z.B. Ölwechsel fällig, komisches Geräusch beim Bremsen..."
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            data-test-id="textarea-wartung-beschreibung"
            aria-label="Wartungsbeschreibung eingeben"
          />
        </div>

        <div>
          <label htmlFor="melder" className="block text-sm font-medium text-gray-700 mb-2">
            Ihr Name (optional)
          </label>
          <input
            id="melder"
            name="melder"
            type="text"
            value={formData.melder}
            onChange={handleChange}
            placeholder="z.B. Max Mustermann"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            data-test-id="input-wartung-melder"
            aria-label="Namen eingeben"
          />
        </div>

        <div>
          <label htmlFor="bemerkungen" className="block text-sm font-medium text-gray-700 mb-2">
            Zusätzliche Bemerkungen (optional)
          </label>
          <textarea
            id="bemerkungen"
            name="bemerkungen"
            value={formData.bemerkungen}
            onChange={handleChange}
            placeholder="Weitere Informationen..."
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            data-test-id="textarea-wartung-bemerkungen"
            aria-label="Bemerkungen eingeben"
          />
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
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          data-test-id="button-submit-wartung"
          aria-label="Wartungsmeldung senden"
        >
          {loading ? 'Wird gesendet...' : 'Wartungsmeldung senden'}
        </button>
      </form>
    </div>
  );
}


