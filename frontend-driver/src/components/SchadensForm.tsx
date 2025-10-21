import { useState } from 'react';
import type { Schadensmeldung } from '../types';

interface SchadensFormProps {
  fahrzeugId: number;
  currentKmStand: number;
}

export default function SchadensForm({ fahrzeugId, currentKmStand }: SchadensFormProps) {
  const [formData, setFormData] = useState<Partial<Schadensmeldung>>({
    fahrzeugId,
    kmStand: currentKmStand,
    beschreibung: '',
    schadensart: 'Kratzer',
    schweregrad: 'Leicht',
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
      const response = await fetch('/api/fahrer/schaden', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: '✅ Schadensmeldung erfolgreich gesendet!' });
        setFormData({
          fahrzeugId,
          kmStand: currentKmStand,
          beschreibung: '',
          schadensart: 'Kratzer',
          schweregrad: 'Leicht',
          melder: '',
          bemerkungen: '',
        });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Fehler beim Senden' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Verbindungsfehler. Bitte versuchen Sie es erneut.' });
      console.error('Schadensmeldung error:', err);
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
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Schaden melden</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="schadensart" className="block text-sm font-medium text-gray-700 mb-2">
            Schadensart
          </label>
          <select
            id="schadensart"
            name="schadensart"
            value={formData.schadensart}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            data-test-id="select-schadensart"
            aria-label="Schadensart auswählen"
          >
            <option value="Kratzer">Kratzer</option>
            <option value="Delle">Delle</option>
            <option value="Unfall">Unfall</option>
            <option value="Technisch">Technischer Defekt</option>
            <option value="Sonstiges">Sonstiges</option>
          </select>
        </div>

        <div>
          <label htmlFor="schweregrad" className="block text-sm font-medium text-gray-700 mb-2">
            Schweregrad
          </label>
          <select
            id="schweregrad"
            name="schweregrad"
            value={formData.schweregrad}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            data-test-id="select-schweregrad"
            aria-label="Schweregrad auswählen"
          >
            <option value="Leicht">Leicht</option>
            <option value="Mittel">Mittel</option>
            <option value="Schwer">Schwer</option>
          </select>
        </div>

        <div>
          <label htmlFor="kmStand" className="block text-sm font-medium text-gray-700 mb-2">
            Kilometerstand beim Schaden
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
            data-test-id="input-schaden-km"
            aria-label="Kilometerstand eingeben"
          />
        </div>

        <div>
          <label htmlFor="beschreibung" className="block text-sm font-medium text-gray-700 mb-2">
            Schadensbeschreibung *
          </label>
          <textarea
            id="beschreibung"
            name="beschreibung"
            value={formData.beschreibung}
            onChange={handleChange}
            placeholder="Beschreiben Sie den Schaden..."
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
            data-test-id="textarea-beschreibung"
            aria-label="Schadensbeschreibung eingeben"
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
            data-test-id="input-melder"
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
            data-test-id="textarea-bemerkungen"
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
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
          data-test-id="button-submit-schaden"
          aria-label="Schadensmeldung senden"
        >
          {loading ? 'Wird gesendet...' : 'Schadensmeldung senden'}
        </button>
      </form>
    </div>
  );
}


